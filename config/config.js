module.exports = {
  name: 'Microsoft Sentinel',
  acronym: 'MS-SNTL',
  description:
    'Search for WHOIS, Geolocation Data, Incidents, Threat Intelligence Indicators, and Query Logs via Kusto Queries',
  entityTypes: ['domain', 'IPv4', 'email', 'MD5', 'SHA1', 'SHA256', 'cve'],
  styles: ['./styles/styles.less'],
  defaultColor: 'light-blue',
  block: {
    component: {
      file: './components/block.js'
    },
    template: {
      file: './templates/block.hbs'
    }
  },
  request: {
    cert: '',
    key: '',
    passphrase: '',
    ca: '',
    proxy: ''
  },
  logging: {
    level: 'info' //trace, debug, info, warn, error, fatal
  },
  options: [
    {
      key: 'managementApiUrl',
      name: 'Azure Management API URL',
      description:
        'The Azure Management API URL associated with your Azure Microsoft 365 Defender Instance.',
      default: 'https://management.azure.com',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'logAnalyticsApiUrl',
      name: 'Azure Log Analytics API URL',
      description:
        'The Azure Log Analytics API URL associated with your Azure Microsoft 365 Defender Instance.',
      default: 'https://api.loganalytics.io',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'clientId',
      name: 'Azure AD Registered App Client/Application ID',
      description:
        "Your Azure AD Registered App's Client ID associated with your Microsoft Sentinel Instance.",
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'tenantId',
      name: 'Azure AD Registered App Tenant/Directory ID',
      description:
        "Your Azure AD Registered App's Tenant ID associated with your Microsoft Sentinel Instance.",
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'clientSecret',
      name: 'Azure AD Registered App Client Secret Value',
      description:
        "Your Azure AD Registered App's Client Secret Value associated with your Microsoft Sentinel Instance.",
      default: '',
      type: 'password',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'subscriptionIds',
      name: 'Sentinel Subscription ID',
      description:
        'The Subscription ID associated with your Microsoft Sentinel Instance.',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'resourceGroupNames',
      name: 'Sentinel Resource Group Name',
      description:
        'The Resource Group Name associated with your Microsoft Sentinel Instance.',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'workspaceNamesAndIds',
      name: 'Sentinel Workspace Name & ID',
      description:
        'The {{WORKSPACE_NAME}}:{{WORKSPACE_ID}} for the workspace associated with your Microsoft Sentinel Instance.\n' +
        '(e.g. sentinel-workspace1: 8dbg2cdf-fd06-42zf-8557-4606c98adb2a)',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'kustoQueryString',
      name: 'Kusto Query String',
      description:
        'Kusto Query String to execute on the Sentinel Log Analytics Workspace. The string `{{ENTITY}}` will be replace by the looked up Entity. For example: ThreatIntelligenceIndicator | search "{{ENTITY}}" | take 10',
      default: 'ThreatIntelligenceIndicator | search "{{ENTITY}}" | take 10',
      type: 'text',
      userCanEdit: false,
      adminOnly: false
    },
    {
      key: 'kustoQuerySummaryFields',
      name: 'Kusto Query Summary Fields',
      description:
        'Comma delimited list of field values to include as part of the summary.  These fields must be returned by your Kusto Query. This option must be set to "User can view and edit" or "User can view only".',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: false
    },
    {
      key: 'kustoQueryIgnoreFields',
      name: 'Kusto Query Ignore Fields',
      description:
        'Comma delimited list of Fields to ignore from the Kusto Query Results in the Overlay. This option must be set to "User can view and edit" or "User can view only".',
      default: '',
      type: 'text',
      userCanEdit: true,
      adminOnly: false
    },
    {
      key: 'lookbackDays',
      name: 'Lookback Days',
      description: 'The number of days to look back when querying logs, and incidents.',
      default: 30,
      type: 'number',
      userCanEdit: false,
      adminOnly: false
    },
    {
      key: 'ignoreWhenGeodataWhoisOnlyReturn',
      name: 'Ignore Geodata/WHOIS Only Results',
      description:
        'If checked, entities will not return if only Geodata and/or WHOIS data is found, and no other query types have results.',
      default: false,
      type: 'boolean',
      userCanEdit: false,
      adminOnly: false
    },
    {
      key: 'enableThreatIntelligenceResults',
      name: 'Enable Threat Intelligence Searches',
      description:
        'If enabled, the integration will search threat intelligence indicator data',
      default: true,
      type: 'boolean',
      userCanEdit: false,
      adminOnly: false
    }
  ]
};
