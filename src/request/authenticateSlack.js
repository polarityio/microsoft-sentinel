const { createHmac } = require('crypto');
const timingSafeCompare = require('tsscmp');

const {get, getOr, toLower, join } = require('lodash/fp');

const { getStateValueByPath } = require('../../slack-command/localStateManager');

const getHeader = (header, req) =>
  getOr(get(['headers', toLower(header)], req), ['headers', header], req);

const authenticateSlack = (req, res, next) => {
  const timestampHeader = getHeader('X-Slack-Request-Timestamp', req);
  const requestIsFromMoreThanFiveMinutesAgo =
    Math.abs(Date.now() - timestampHeader * 1000) > 60 * 5 * 1000;
  if (requestIsFromMoreThanFiveMinutesAgo) return;

  const slackApiVersion = 'v0';
  const slackSigningSecret = getStateValueByPath('config.slackSigningSecret');
  if (!slackSigningSecret) {
    console.log({
      MESSAGE:
        'Failed to get POLARITY_SLACK_APP_SIGNING_SECRET from .env file.  Slack Request Authentication Failed'
    });
    return;
  }

  const requestBody = get('body', req);
  const signatureHeader = getHeader('X-Slack-Signature', req);

  const signatureBase = join(':', [slackApiVersion, timestampHeader, requestBody]);

  const digest = createHmac('sha256', slackSigningSecret)
    .update(signatureBase)
    .digest('hex');
  const computedSignature = join('=', [slackApiVersion, digest]);

  const signatureIsValid = timingSafeCompare(computedSignature, signatureHeader);

  if (!signatureIsValid)
    console.log({
      MESSAGE: 'Request from Slack Failed to match Signatures',
      slackApiVersion,
      requestBody,
      signatureBase,
      digest,
      computedSignature,
      signatureHeader
    });

  next(!signatureIsValid && 'Request from Slack Failed to match Signatures');
};;

module.exports = authenticateSlack;
