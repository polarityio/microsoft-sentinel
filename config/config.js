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
      key: 'url',
      name: 'URL',
      description: 'The URL of the  API you would like to connect to',//TODO
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'userToken',
      name: 'User Token',
      description: 'TODO',
      default: '',
      type: 'password',
      userCanEdit: false,
      adminOnly: true
    }
  ]
};
