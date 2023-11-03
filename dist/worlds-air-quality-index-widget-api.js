/**
 * Script downloaded from https://aqicn.org/faq/2015-07-28/air-quality-widget-new-improved-feed/
 */
function loadAirQualityWidget(w,d,t,f) {
  w[f] = w[f] || function(c,k,n) {
    s = w[f], k = s['k'] = (s['k'] || (k ? ('&k=' + k) : ''));
    s['c'] = c = (c instanceof Array) ? c : [c];
    s['n'] = n = n || 0;
    L = d.createElement(t), e = d.getElementsByTagName(t)[0];
    L.async = 1;
    L.src = 'https://feed.aqicn.org/feed/' + (c[n].city) + '/' + (c[n].lang || '') + '/feed.v1.js?n=' + n + k;
    e.parentNode.insertBefore(L, e);
  };
}

/**
 * Hassio frontend custom worlds-air-quality-index-widget-api
 */
class WorldsAirQualityIndexWidgetApi extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  setConfig(config) {
    loadAqiFeedScript(window, document, 'script', '_aqiFeed');
    const root = this.shadowRoot;
    if (root.lastChild) root.removeChild(root.lastChild);

    const cardConfig = Object.assign({}, config);
    this._config = cardConfig
  }

  set hass(hass) {
    const config = this._config;
    loadAqiFeedScript(window, document, 'script', '_aqiFeed');

    try{
      const root = this.shadowRoot;
      this._hass = hass;
      const card = document.createElement('ha-card');
      this.content = document.createElement('div');
      this.content.setAttribute("id", "city-aqi-container");
      card.appendChild(this.content);
      root.appendChild(card);
      _aqiFeed({container: "city-aqi-container", city: this._config.city, lang: this._config.lang, display: this._config.display});
    } catch(err){
      console.log('waiting for AQI feed script load');
      loadAqiFeedScript(window, document, 'script', '_aqiFeed');
    }
  }

  getCardSize() {
    return 3;
  }
}

customElements.define('worlds-air-quality-index-widget-api', WorldsAirQualityIndexWidgetApi);