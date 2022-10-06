const { get, eq, flow, getOr } = require('lodash/fp');

const { getStateValueByPath, setStateValueForPath } = require('../localStateManager');

const { parseErrorToReadableJSON, or } = require('../../src/dataTransformations');


const handleRequestErrorsForServices =
  (requestWithDefaultsBuilder) => async (error, requestOptions) =>
    await get(requestOptions.site, authenticationProcessBySite)(
      error,
      requestOptions,
      requestWithDefaultsBuilder
    );

const checkForSlackExpiredTokenAndRetry = async (
  error,
  requestOptions,
  requestWithDefaultsBuilder
) => {
  const err = parseErrorToReadableJSON(error)
  
  const isTokenExpired = flow(
    get('description'),
    JSON.parse,
    get('error'),
    or(eq('token_expired'), eq('invalid_auth'))
  )(err);

  if (isTokenExpired)
    return await refreshToken(requestOptions, requestWithDefaultsBuilder);

  throw error;
}

const refreshToken = async (requestOptions, requestWithDefaultsBuilder) => {
  let requestWithDefaults = requestWithDefaultsBuilder();
  
  const {token, refresh_token} = getOr({},
    'body',
    await requestWithDefaults({
      method: 'POST',
      url: 'https://slack.com/api/tooling.tokens.rotate',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      form: {
        refresh_token: getStateValueByPath('config.appRefreshToken')
      }
    })
  );

  setStateValueForPath('config.appToken', token);
  setStateValueForPath('config.appRefreshToken', refresh_token);

  const authenticateRequest = require('./authenticateRequest');

  requestWithDefaults = requestWithDefaultsBuilder(
    authenticateRequest(requestWithDefaultsBuilder)
  );
  
  return await requestWithDefaults(requestOptions);
};


const ignoreErrorIfAuthenticationError = async (
  error,
  requestOptions
) => {
  const err = parseErrorToReadableJSON(error);

  const isAuthenticationError = flow(get('status'), or(eq(401), eq(422)))(err);
  if (!isAuthenticationError) throw error;
};


const authenticationProcessBySite = {
  polarity: ignoreErrorIfAuthenticationError,
  slack: checkForSlackExpiredTokenAndRetry
};

module.exports = handleRequestErrorsForServices;
