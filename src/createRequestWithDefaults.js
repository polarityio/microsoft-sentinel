const fs = require('fs');
const { eq, get, flow, getOr, some, includes, __ } = require('lodash/fp');
const request = require('postman-request');
const config = require('../config/config');
const { ERROR_MESSAGES } = require('./constants');

const SUCCESSFUL_ROUNDED_REQUEST_STATUS_CODES = [200];

const _configFieldIsValid = (field) => typeof field === 'string' && field.length > 0;

const createRequestWithDefaults = (Logger) => {
  const {
    request: { ca, cert, key, passphrase, rejectUnauthorized, proxy }
  } = config;

  const defaults = {
    ...(_configFieldIsValid(ca) && { ca: fs.readFileSync(ca) }),
    ...(_configFieldIsValid(cert) && { cert: fs.readFileSync(cert) }),
    ...(_configFieldIsValid(key) && { key: fs.readFileSync(key) }),
    ...(_configFieldIsValid(passphrase) && { passphrase }),
    ...(_configFieldIsValid(proxy) && { proxy }),
    ...(typeof rejectUnauthorized === 'boolean' && { rejectUnauthorized }),
    json: true
  };

  const requestWithDefaults = (
    preRequestFunction = async () => ({}),
    postRequestSuccessFunction = async (x) => x,
    postRequestFailureFunction = async (e) => {
      throw e;
    }
  ) => {
    const defaultsRequest = request.defaults(defaults);

    const _requestWithDefault = (requestOptions) =>
      new Promise((resolve, reject) => {
        defaultsRequest(requestOptions, (err, res, body) => {
          if (err) return reject(err);
          resolve({ ...res, body });
        });
      });

    return async (requestOptions) => {
      const preRequestFunctionResults = await preRequestFunction(requestOptions);
      const _requestOptions = {
        ...requestOptions,
        ...preRequestFunctionResults
      };

      let postRequestFunctionResults;
      try {
        const result = await _requestWithDefault(_requestOptions);
        checkForStatusError(result, _requestOptions);

        postRequestFunctionResults = await postRequestSuccessFunction(
          result,
          _requestOptions
        );
      } catch (error) {
        postRequestFunctionResults = await postRequestFailureFunction(
          error,
          _requestOptions
        );
      }
      return postRequestFunctionResults;
    };
  };

  const handleAuth = async ({ options, ...requestOptions }) => ({
    ...requestOptions,
    headers: {
      ...requestOptions.headers,
      Authorization: `Bearer ${
        some(includes(__, requestOptions.url), ['search.messages'])
          ? options.userToken
          : options.botToken
      }`
    }
  });

  const checkForStatusError = ({ statusCode, body }, requestOptions) => {
    const requestOptionsWithoutSensitiveData = {
      ...requestOptions,
      headers: { ...requestOptions.headers, Authorization: 'Bearer ************' },
      options: '************'
    };

    Logger.trace({
      MESSAGE: 'Request Ran, Checking Status...',
      statusCode,
      requestOptions: requestOptionsWithoutSensitiveData,
      body
    });

    const roundedStatus = Math.round(statusCode / 100) * 100;
    const statusCodeNotSuccessful =
      !SUCCESSFUL_ROUNDED_REQUEST_STATUS_CODES.includes(roundedStatus);
      
    const requestIsNotOk = flow(get('ok'), eq(false))(body)
    if (statusCodeNotSuccessful || requestIsNotOk) {
      const requestError = Error('Request Error');
      requestError.status = statusCodeNotSuccessful ? statusCode : body.error;
      requestError.detail = getOr(
        'Sending Message Unsuccessful',
        get('error', body),
        ERROR_MESSAGES
      );
      requestError.description = JSON.stringify(body);
      requestError.requestOptions = JSON.stringify(requestOptionsWithoutSensitiveData);
      throw requestError;
    }
  };

  const requestDefaultsWithInterceptors = requestWithDefaults(handleAuth);

  return requestDefaultsWithInterceptors;
};

module.exports = createRequestWithDefaults;
