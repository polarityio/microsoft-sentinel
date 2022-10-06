const IGNORED_IPS = new Set(['127.0.0.1', '255.255.255.255', '0.0.0.0']);

const ERROR_MESSAGES = {
  method_not_supported_for_channel_type:
    'This type of conversation cannot be used with this method.',
  missing_scope:
    'The token used is not granted the specific scope permissions required to complete this request.',
  invalid_types:
    "Value passed for type could not be used based on the method's capabilities or the permission scopes granted to the used token.",
  invalid_cursor: 'Value passed for cursor was not valid or is no longer valid.',
  invalid_limit: 'Value passed for limit is not understood.',
  missing_argument: 'A required argument is missing.',
  team_access_not_granted:
    'The token used is not granted the specific workspace access required to complete this request.',
  not_authed: 'No authentication token provided.',
  invalid_auth:
    'Some aspect of authentication cannot be validated. Either the provided token is invalid or the request originates from an IP address disallowed from making the request.',
  access_denied: 'Access to a resource specified in the request is denied.',
  account_inactive:
    'Authentication token is for a deleted user or workspace when using a bot token.',
  token_revoked:
    'Authentication token is for a deleted user or workspace or the app has been removed when using a user token.',
  token_expired: 'Authentication token has expired',
  no_permission:
    "The workspace token used in this request does not have the permissions necessary to complete the request. Make sure your app is a member of the conversation it's attempting to post a message to.",
  org_login_required:
    'The workspace is undergoing an enterprise migration and will not be available until migration is complete.',
  ekm_access_denied: 'Administrators have suspended the ability to post a message.',
  not_allowed_token_type: 'The token type used in this request is not allowed.',
  method_deprecated: 'The method has been deprecated.',
  deprecated_endpoint: 'The endpoint has been deprecated.',
  two_factor_setup_required: 'Two factor setup is required.',
  enterprise_is_restricted: 'The method cannot be called from an Enterprise.',
  invalid_arguments:
    'The method was either called with invalid arguments or some detail about the arguments passed are invalid, which is more likely when using complex arguments like blocks or attachments.',
  invalid_arg_name:
    'The method was passed an argument whose name falls outside the bounds of accepted or expected values. This includes very long names and names with non-alphanumeric characters other than _. If you get this error, it is typically an indication that you have made a very malformed API call.',
  invalid_array_arg:
    'The method was passed an array as an argument. Please only input valid strings.',
  invalid_charset:
    'The method was called via a POST request, but the charset specified in the Content-Type header was invalid. Valid charset names are: utf-8 iso-8859-1.',
  invalid_form_data:
    'The method was called via a POST request with Content-Type application/x-www-form-urlencoded or multipart/form-data, but the form data was either missing or syntactically invalid.',
  invalid_post_type:
    'The method was called via a POST request, but the specified Content-Type was invalid. Valid types are: application/json application/x-www-form-urlencoded multipart/form-data text/plain.',
  missing_post_type:
    'The method was called via a POST request and included a data payload, but the request did not include a Content-Type header.',
  team_added_to_org:
    'The workspace associated with your request is currently undergoing migration to an Enterprise Organization. Web API and other platform operations will be intermittently unavailable until the transition is complete.',
  ratelimited:
    'The request has been ratelimited. Refer to the Retry-After header for when to retry the request.',
  accesslimited: 'Access to this method is limited on the current network',
  request_timeout:
    'The method was called via a POST request, but the POST data was either missing or truncated.',
  service_unavailable: 'The service is temporarily unavailable',
  fatal_error:
    "The server could not complete your operation(s) without encountering a catastrophic error. It's possible some aspect of the operation succeeded before the error was raised.",
  internal_error:
    "The server could not complete your operation(s) without encountering an error, likely due to a transient issue on our end. It's possible some aspect of the operation succeeded before the error was raised.",

  //Messaging Specific Errors
  channel_not_found: 'Channel Name Value was invalid.  You might need to add the @Polarity App to this channel.',
  duplicate_channel_not_found: 'Channel associated with client_msg_id was invalid.',
  duplicate_message_not_found:
    'No duplicate message exists associated with client_msg_id.',
  not_in_channel: 'Cannot post user messages to a channel they are not in.',
  is_archived: 'Channel has been archived.',
  msg_too_long: 'Message text is too long',
  no_text: 'No message text provided',
  restricted_action:
    'A workspace preference prevents the authenticated user from posting.',
  restricted_action_read_only_channel:
    'Cannot post any message into a read-only channel.',
  restricted_action_thread_only_channel:
    'Cannot post top-level messages into a thread-only channel.',
  restricted_action_non_threadable_channel:
    'Cannot post thread replies into a non_threadable channel.',
  restricted_action_thread_locked:
    'Cannot post replies to a thread that has been locked by admins.',
  too_many_attachments:
    'Too many attachments were provided with this message. A maximum of 100 attachments are allowed on a message.',
  too_many_contact_cards:
    'Too many contact_cards were provided with this message. A maximum of 10 contact cards are allowed on a message.',
  rate_limited:
    'Application has posted too many messages, read the Rate Limit documentation for more information',
  as_user_not_supported: 'The as_user parameter does not function with workspace apps.',
  slack_connect_file_link_sharing_blocked:
    'Admin has disabled Slack File sharing in all Slack Connect communications',
  invalid_blocks: 'Blocks submitted with this message are not valid',
  invalid_blocks_format:
    "The blocks is not a valid JSON object or doesn't match the Block Kit syntax.",
  messages_tab_disabled: 'Messages tab for the app is disabled.',
  metadata_too_large: 'Metadata exceeds size limit',
  invalid_metadata_format: 'Invalid metadata format provided',
  invalid_metadata_schema: 'Invalid metadata schema provided',
  metadata_must_be_sent_from_app:
    'Message metadata can only be posted or updated using an app token'
};

module.exports = {
  IGNORED_IPS,
  ERROR_MESSAGES
};
