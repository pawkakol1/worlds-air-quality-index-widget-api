/**
 * Hassio frontend custom worlds-air-quality-index-widget-api
 */
class WorldsAirQualityIndexWidgetApi extends HTMLElement {
  /**
   * Constructor
   */
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.elementsSet = false;
  }

  /**
   * Sets configuration of the card
   * @param {Collection} config 
   */
  setConfig(config) {
    const root = this.shadowRoot
    if (root.lastChild) 
      root.removeChild(root.lastChild);
    const cardConfig = Object.assign({}, config);
    this._config = cardConfig
  }

  /**
   * Script downloaded from https://aqicn.org/faq/2015-07-28/air-quality-widget-new-improved-feed/
   * adjusted to work with worlds-air-quaility
   */
  loadAqiFeedScript() {
    if(window[`scriptLoaded_AqiFeedScript`]){
      return;
    }
    window['_aqiFeed'] = window['_aqiFeed'] || function(c,k,n) {
      var s = window['_aqiFeed'], k = s['k'] = (s['k'] || (k ? ('&k=' + k) : ''));
      s['c'] = c = (c instanceof Array) ? c : [c];
      s['n'] = n = n || 0;
      var L = document.createElement('script');
      var e = document.getElementsByTagName('body')[0];
      L.async = 1;
      L.src = 'https://feed.aqicn.org/feed/' + (c[n].city) + '/' + (c[n].lang || '') + '/feed.v1.js?n=' + n + k;
      e.appendChild(L);
    };
    window[`scriptLoaded_AqiFeedScript`] = true;
  }

  /**
   * 
   * @param {Collection} hass 
   */
  set hass(hass) {
    const config = this._config;
    const root = this.shadowRoot;
    const bodyRoot = document.getElementsByTagName('body')[0];
    try{
      this._hass = hass;
      if(!this.content) {
        const card = document.createElement('ha-card');
        this.temporaryContent = document.createElement('div');
        this.temporaryContent.setAttribute("id", "city-aqi-container");
        bodyRoot.appendChild(this.temporaryContent);
        if(!window[`scriptLoaded_AqiFeedScript`])
          this.loadAqiFeedScript();
        this.elementsSet = true;
        if(window[`scriptLoaded_AqiFeedScript`]) {
          console.log(config);
          this.content = document.createElement('div');
          this.content.setAttribute("id", "waqi-container");
          const observerConfig = {childList: true};
          const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
              if (mutation.type === "childList") {
                this.content.innerHTML = document.getElementById('city-aqi-container').innerHTML;
                bodyRoot.removeChild(this.temporaryContent);
                observer.disconnect();
              }
            }
          };
          const observer = new MutationObserver(callback);
          observer.observe(this.temporaryContent, observerConfig);
          if(config.city != undefined || config.cities != undefined) {
            var parameters = {container:"city-aqi-container", callback: ""};
            if(config.lang != undefined)
              parameters["lang"] = config.lang;
            if(config.display != undefined)
              parameters["display"] = config.display;
            
            if(config.cities != undefined) {
              for(var i = 0; i < config.cities.lenght; i++) {
                parameters["city"] = config.cities[i];
                _aqiFeed(parameters); 
              }
            }
            else {
              parameters["city"] = config.city;
              _aqiFeed(parameters); 
            }
          }
          else 
            throw new Error('The minimum parameter is singe "city" or "cities" array');
          card.appendChild(this.content);
          root.appendChild(card);
        }
      }
    } catch(err){
      console.trace();
      console.log(err);
      console.log('waiting for AQI feed script load');
      this.loadAqiFeedScript();
    }
  }

  getCardSize() {
    return 3;
  }
}

customElements.define('worlds-air-quality-index-widget-api', WorldsAirQualityIndexWidgetApi);