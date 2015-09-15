/*globals Ember*/

export function initialize(instance) {
  var originalDidCreateRootView = instance.didCreateRootView;

  instance.didCreateRootView = function() {
    Ember.$(instance.rootElement + ' .ember-view').remove();

    originalDidCreateRootView.apply(instance, arguments);
  };
}

export default {
  initialize: initialize
};
