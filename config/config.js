module.exports = {
  name: 'Microsoft Sentinel',
  acronym: 'MS-SNTL',
  description: 'TODO',
  entityTypes: ['domain', 'IPv4', 'email', 'hash', 'MAC'],
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
    proxy: '',
    rejectUnauthorized: true
  },
  logging: {
    level: 'trace' //trace, debug, info, warn, error, fatal
  },
  options: [
    {
      key: 'clientId',
      name: 'Azure AD Registered App Application (client) ID',
      description: 'TODO add instructions of where to get',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'tenantId',
      name: 'Azure AD Registered App Directory (tenant) ID',
      description: 'TODO add instructions of where to get',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'clientSecret',
      name: 'Azure AD Registered App Client Secret',
      description: 'TODO add instructions of where to get',
      default: '',
      type: 'password',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'subscriptionIds',
      name: 'Sentinel Subscription IDs',
      description: 'TODO add instructions of where to get',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'resourceGroupNames',
      name: 'Sentinel Resource Group Names',
      description: 'TODO add instructions of where to get',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'workspaceNamesAndIds',
      name: 'Sentinel Workspace Names & IDs',
      description: 'TODO add instructions of where to get name: id, ',
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
      adminOnly: true
    },
    {
      key: 'kustoQuerySummaryFields',
      name: 'Kusto Query Summary Fields',
      description:
        'Comma delimited list of field values to include as part of the summary.  These fields must be returned by your Kusto Query. This option must be set to "User can view and edit" or "User can view only".',
      default: '',
      type: 'text',
      userCanEdit: true,
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
      description: 'TODO',
      default: 30,
      type: 'number',
      userCanEdit: true,
      adminOnly: false
    }
    // Could add checkbox option ignoring results that only have Geodata or WHOIS data to filter out less relevant results
  ]
};
