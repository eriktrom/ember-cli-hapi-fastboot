/*globals SimpleDOM, Ember, HapiFastboot, URL*/

export function initialize(application) {
  // Are we running in node? If not, there's nothing to do.
  if (typeof document !== 'undefined') { return; }

  var doc = new SimpleDOM.Document();
  var domHelper = new Ember.HTMLBars.DOMHelper(doc);

  domHelper.protocolForURL = function domHelper_protocolForURL(url) {
    var protocol = URL.parse(url).protocol;
    return (protocol === null) ? ':' : protocol;
  };

  domHelper.setMorphHTML = function domHelper_setMorphHTML(morph, html) {
    var section = this.document.createRawHTMLSection(html);
    morph.setNode(section);
  };

  // Disable automatic routing. Routing will only occur via our calls to visit()
  application.autoboot = false;

  // hack to setup renderer:main with a fake document
  application.register('renderer:-dom', {
    create: function() {
      var Renderer = Ember._Renderer || Ember.View._Renderer;
      return new Renderer(domHelper, false);
    }
  });

  HapiFastboot.debug('resolving HapiFastboot promise');

  HapiFastboot.resolve(function(url) {
    HapiFastboot.debug('routing url=%s', url);

    var promise;
    Ember.run(function() {
      promise = application.visit(url);
    });

    return promise.then(function(instance) {
      var view = instance.view;
      var title = view.renderer._dom.document.title;
      var element;

      Ember.run(function() {
        element = view.renderToElement();
      });

      var serializer = new SimpleDOM.HTMLSerializer(SimpleDOM.voidMap);

      return {
        body: serializer.serialize(element),
        title: title
      };
    });
  });
}

export default {
  name: 'hapi-fastboot',
  initialize: initialize
};
