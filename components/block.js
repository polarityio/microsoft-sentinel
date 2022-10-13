polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  init() {
    //TODO: Change or delete
    this._super(...arguments);
  },
  observer: Ember.on(
    'willUpdate',
    Ember.observer('details.maxUniqueKeyNumber', function () {
      if (this.get('maxUniqueKeyNumber') !== this.get('_maxUniqueKeyNumber')) {
        this.set('_maxUniqueKeyNumber', this.get('maxUniqueKeyNumber'));

        //TODO: Change or delete
      }
    })
  ),
  actions: {
    toggleOwnershipMessage: function () {
      this.toggleProperty('change or delete');
    },
    onMessageExample: function () {
      const outerThis = this;
      outerThis.set('asdfMessage', '');
      outerThis.set('asdfErrorMessage', '');
      outerThis.set('asdfIsRunning', true);
      outerThis.get('block').notifyPropertyChange('data');

      outerThis
        .sendIntegrationMessage({
          action: 'onMessageExample',
          data: {
            entity: outerThis.get('entity'),
          }
        })
        .then(({ result }) => {
          outerThis.set('change or delete', result);
          outerThis.set('asdfMessage', 'Successfully asdfd IOC');
        })
        .catch((err) => {
          outerThis.set(
            'asdfErrorMessage',
            'Failed to asdf IOC: ' +
              (err &&
                (err.detail || err.err || err.message || err.title || err.description)) ||
              'Unknown Reason'
          );
        })
        .finally(() => {
          outerThis.set('asdfIsRunning', false);
          outerThis.get('block').notifyPropertyChange('data');
          setTimeout(() => {
            outerThis.set('asdfMessage', '');
            outerThis.set('asdfErrorMessage', '');
            outerThis.get('block').notifyPropertyChange('data');
          }, 5000);
        });
    },
});
