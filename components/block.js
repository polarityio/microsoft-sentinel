polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  timezone: Ember.computed('Intl', function () {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }),
  activeTab: '',
  expandableTitleStates: {
    indicators: { 0: true},
    incidents: { 0: true},
    kustoQueryResults: { 0: true}
  },
  displayTabNames: {
    indicators: 'Threat Intel Indicators',
    incidents: 'Incidents',
    ipGeodata: 'IP Geodata',
    domainWhois: 'Domain WHOIS',
    kustoQueryResults: 'Kusto Query Logs'
  },
  whoisDisplayNames: {
    admin: 'Administrator',
    registrant: 'Registrant',
    billing: 'Billing',
    tech: 'Technical Contact'
  },
  init() {
    const details = this.get('details');

    this.set(
      'activeTab',
      details.indicators && details.indicators.length
        ? 'indicators'
        : details.incidents && details.incidents.length
        ? 'incidents'
        : details.ipGeodata && Object.keys(details.ipGeodata).length
        ? 'ipGeodata'
        : details.domainWhois && Object.keys(details.domainWhois).length
        ? 'domainWhois'
        : 'kustoQueryResults'
    );

    this._super(...arguments);
  },
  actions: {
    changeTab: function (tabName) {
      this.set('activeTab', tabName);
    },
    toggleExpandableTitle: function (index, type) {
      this.set(
        `expandableTitleStates`,
        Object.assign({}, this.get('expandableTitleStates'), {
          [type]: Object.assign({}, this.get('expandableTitleStates')[type], {
            [index]: !(
              this.get('expandableTitleStates')[type] &&
              this.get('expandableTitleStates')[type][index]
            )
          })
        })
      );

      this.get('block').notifyPropertyChange('data');
    }
  }
});
