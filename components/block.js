polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  timezone: Ember.computed('Intl', function () {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }),
  availableChannelsToMessage: [],
  messageValue: '',
  sendingMessage: false,
  messagingToast: '',
  errorMessagingToast: '',
  sendingMessage: '',
  selectedChannel: {},
  foundMessageSearchResultsOpen: false,
  loadingMoreMessages: false,
  init() {
    const availableChannelsToMessage = this.get('block.userOptions.messagingChannelNames')
      .split(',')
      .map((channelName) =>
        this.get('details.channels').find(
          ({ name }) => name == channelName.trim().toLowerCase().replace(/ /g, '-')
        )
      )
      .filter((x) => x);

    this.set('availableChannelsToMessage', availableChannelsToMessage);
    this.set('selectedChannel', availableChannelsToMessage[0]);
    this.set(
      'messageValue',
      this.get('block.userOptions.addEntityToMessageByDefault')
        ? this.get('block.entity.value')
        : ''
    );

    this._super(...arguments);
  },
  actions: {
    toggleShowingFoundMessages: function () {
      this.toggleProperty('foundMessageSearchResultsOpen');
    },
    showMoreOfMessage: function (index) {
      this.set(
        `details.foundMessagesFromSearch.${index}.displayMessage`,
        this.get(`details.foundMessagesFromSearch.${index}.message`)
      );
      this.set(`details.foundMessagesFromSearch.${index}.shouldShowMoreMessage`, false);
    },
    selectChannel: function (selectedChannelId) {
      this.set(
        'selectedChannel',
        this.get('details.channels').find(({ id }) => id == selectedChannelId)
      );
    },
    loadMoreSearchMessages: function () {
      if(this.get('loadingMoreMessages')) return;
      const outerThis = this;
      outerThis.set('loadingMoreMessages', true);
      outerThis.get('block').notifyPropertyChange('data');

      outerThis
        .sendIntegrationMessage({
          action: 'loadMoreSearchMessages',
          data: {
            entity: this.get('block.entity'),
            channels: this.get('details.channels'),
            currentSearchResultsPage: this.get('details.currentSearchResultsPage')
          }
        })
        .then(
          ({
            foundMessagesFromSearch,
            currentSearchResultsPage,
            totalNumberOfSearchResultPages
          }) => {
            this.set(
              'details.foundMessagesFromSearch',
              this.get('details.foundMessagesFromSearch').concat(foundMessagesFromSearch)
            );
            this.set('details.currentSearchResultsPage', currentSearchResultsPage);
            this.set(
              'details.totalNumberOfSearchResultPages',
              totalNumberOfSearchResultPages
            );
          }
        )
        .catch((err) => {
          // Remove the `... Load More` button
          this.set(
            'details.currentSearchResultsPage',
            this.get('details.totalNumberOfSearchResultPages')
          );
        })
        .finally(() => {
          outerThis.set('loadingMoreMessages', false);
          outerThis.get('block').notifyPropertyChange('data');
        });
    },
    sendMessage: function () {
      const outerThis = this;
      outerThis.set('messagingToast', '');
      outerThis.set('errorMessagingToast', '');
      outerThis.set('sendingMessage', true);
      outerThis.get('block').notifyPropertyChange('data');

      outerThis
        .sendIntegrationMessage({
          action: 'sendMessage',
          data: {
            text: this.get('messageValue'),
            channel: this.get('selectedChannel').id
          }
        })
        .then(() => {
          outerThis.set('messageValue', '');
          outerThis.set('messagingToast', 'Successfully Sent Message');
        })
        .catch((err) => {
          outerThis.set(
            'errorMessagingToast',
            'Failed to Send Message: ' +
              (err &&
                (err.detail || err.err || err.message || err.title || err.description)) ||
              'Unknown Reason'
          );
        })
        .finally(() => {
          outerThis.set('sendingMessage', false);
          outerThis.get('block').notifyPropertyChange('data');
          setTimeout(() => {
            outerThis.set('messagingToast', '');
            outerThis.set('errorMessagingToast', '');
            outerThis.get('block').notifyPropertyChange('data');
          }, 5000);
        });
    }
  }
});
