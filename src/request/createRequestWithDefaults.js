const fs = require('fs');

const request = require('postman-request');
const { eq, get, flow, identity } = require('lodash/fp');

const authenticateRequest = require('./authenticateRequest');
const { ERROR_MESSAGES } = require('../../src/constants');
const handleRequestErrorsForServices = require('./handleRequestErrorsForServices');

const SUCCESSFUL_ROUNDED_REQUEST_STATUS_CODES = [200];

const _configFieldIsValid = (field) => typeof field === 'string' && field.length > 0;

const createRequestWithDefaults = (Logger = console) => {
  const {
    request: { ca, cert, key, passphrase, rejectUnauthorized, proxy }
  } = require('../../config/config.js');

  const defaults = {
    ...(_configFieldIsValid(ca) && { ca: fs.readFileSync(ca) }),
    ...(_configFieldIsValid(cert) && { cert: fs.readFileSync(cert) }),
    ...(_configFieldIsValid(key) && { key: fs.readFileSync(key) }),
    ...(_configFieldIsValid(passphrase) && { passphrase }),
    ...(_configFieldIsValid(proxy) && { proxy }),
    ...(typeof rejectUnauthorized === 'boolean' && { rejectUnauthorized }),
    rejectUnauthorized: false,
    json: true
  };

  const requestWithDefaultsBuilder = (
    preRequestFunction = async () => ({}),
    postRequestSuccessFunction = async (x) => x,
    postRequestFailureFunction = async (e) => {
      throw e;
    }
  ) => {
    const defaultsRequest = request.defaults(defaults);

    const _requestWithDefaults = (requestOptions) =>
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
        const result = await _requestWithDefaults(_requestOptions);
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
  
  const checkForStatusError = ({ statusCode, body }, requestOptions) => {
    const requestOptionsWithoutSensitiveData = {
      ...requestOptions,
      headers: {
        ...requestOptions.headers,
        Cookie: '*********',
        Authorization: 'Bearer ************',
      },
      body: {
        ...requestOptions.body,
        identification: '*******',
        password: '*******'
      }
    };

    // Logger.info({
    //   responseBody: JSON.stringify(body, null, 2),
    //   MESSAGE: 'Request Ran, Checking Status...',
    //   statusCode,
    //   requestOptions: JSON.stringify(requestOptionsWithoutSensitiveData, null, 2)
    // });

    const roundedStatus = Math.round(statusCode / 100) * 100;
    const statusCodeNotSuccessful =
      !SUCCESSFUL_ROUNDED_REQUEST_STATUS_CODES.includes(roundedStatus);

    const requestIsNotOk = flow(get('ok'), eq(false))(body);
    if (statusCodeNotSuccessful || requestIsNotOk) {
      const requestError = Error('Request Error');
      requestError.status = statusCodeNotSuccessful ? statusCode : body.error;
      requestError.detail = get(
        get('error', body),
        ERROR_MESSAGES
      );
      requestError.description = JSON.stringify(body);
      requestError.requestOptions = JSON.stringify(requestOptionsWithoutSensitiveData);
      throw requestError;
    }
  };

  const requestDefaultsWithInterceptors = requestWithDefaultsBuilder(
    authenticateRequest(requestWithDefaultsBuilder),
    identity,
    handleRequestErrorsForServices(requestWithDefaultsBuilder)
  );

  return requestDefaultsWithInterceptors;
};



module.exports = createRequestWithDefaults ;
