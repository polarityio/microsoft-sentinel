module.exports = {
  name: 'Microsoft Sentinel',
  acronym: 'MS-SNTL',
  description: 'TODO',
  entityTypes: ['*'],
  styles: ['./styles/styles.less'],
  defaultColor: 'light-gray',
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
    }
  ]
};
