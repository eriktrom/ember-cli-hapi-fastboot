/*globals SimpleDOM, Ember, FastBoot, URL*/

export function initialize(App) {
  // Detect if we're running in Node. If not, there's nothing to do.
  if (typeof document === 'undefined') {
    var doc = new SimpleDOM.Document();
    var domHelper = new Ember.HTMLBars.DOMHelper(doc);

    domHelper.protocolForURL = function(url) {
      var protocol = URL.parse(url).protocol;
      return (protocol == null) ? ':' : protocol;
    };

    domHelper.setMorphHTML = function(morph, html) {
      var section = this.document.createRawHTMLSection(html);
      morph.setNode(section);
    };

    // Disable autobooting of the app. This will disable automatic routing,
    // and routing will only occur via our calls to visit().
    App.autoboot = false;

    // This needs to be setting up renderer:main, and ideally would have a less hacked
    // up interface. In particular, the only ACTUAL swap-in here is the fake document,
    // so it would be nice if we could register just that.
    App.register('renderer:-dom', {
      create: function() {
        var Renderer = Ember._Renderer || Ember.View._Renderer;
        return new Renderer(domHelper, false);
      }
    });

    FastBoot.debug("resolving FastBoot promise");

    FastBoot.resolve(function(url) {
      FastBoot.debug("routing; url=%s", url);

      var promise;
      Ember.run(function() {
        promise = App.visit(url);
      });

      return promise.then(function(instance) {
        var view = instance.view;
        var title = view.renderer._dom.document.title;
        var element;

        Ember.run(function() {
          element = view.renderToElement();
        });

        var serializer = new SimpleDOM.HTMLSerializer(SimpleDOM.voidMap);
        var outerHTMLBody = serializer.serialize(element);
        var innerHTMLBody = outerHTMLBody.slice(6, outerHTMLBody.length-7); // strip <body></body>

        return {
          body: innerHTMLBody,
          title: title
        };
      });
    });
  }
}

export default {
  name: "hapi-fastboot",
  initialize: initialize
};
