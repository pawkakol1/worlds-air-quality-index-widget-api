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
  }

  callbackMutationObserver(mutationList, index) {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        this.content[index].innerHTML = document.getElementById(this.body_container_name[index]).innerHTML;//city-aqi-container
        bodyRoot.removeChild(this.temporaryContent[index]);
        observer.disconnect();
      }
    }
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
    this.content = new Array();
    this.temporaryContent = new Array();
    this.observerConfig = new Array();
    this.observer = new Array();
    this.parameters = new Array();
    this._config = cardConfig;
    if(config.cities != undefined) {
      //if there is only one city defined, then convert value to one element Array
      if(!Array.isArray(config.cities)) {
        var city = config.cities;
        this._config.cities = new Array();
        this._config.cities.push(city);
      }
      //generate names of containers and scripts
      this.body_container_name = new Array();
      this.script_name = new Array();
      var converted_city;
      for(var i = 0; i < this._config.cities.lenght; i++) {
        converted_city = this._config.cities[i].replace(/[\/]/gm, '-');
        this.body_container_name.push(converted_city + "-aqi-container");
        this.card_container_name.push(converted_city + "-waqi-container");
        this.script_name.push(converted_city + "_AqiFeedScript");
      }
    }
  }

  /**
   * Script downloaded from https://aqicn.org/faq/2015-07-28/air-quality-widget-new-improved-feed/
   * adjusted to work with worlds-air-quaility
   */
  loadAqiFeedScript(scriptName) {
    if(window[scriptName]){
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
    window[scriptName] = true;
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
      for(var i = 0; i < this._config.cities.lenght; i++) {
        if(this.content.length < (i + 1)) {
          const card = document.createElement('ha-card');
          this.temporaryContent.push(document.createElement('div'));
          this.temporaryContent[i].setAttribute("id", this.body_container_name[i]);//city-aqi-container
          bodyRoot.appendChild(this.temporaryContent[i]);
          if(!window[this.script_name[i]])
            this.loadAqiFeedScript(this.script_name[i]);
          if(window[this.script_name[i]]) {
            this.content.push(document.createElement('div'));
            this.content[i].setAttribute("id", card_container_name[i]);

            //set MutationObserver
            this.observerConfig.push({childList: true});
            this.observer.push(new MutationObserver(mutationList => {
              callbackMutationObserver(mutationList, i)
            }));
            this.observer[i].observe(this.temporaryContent[i], this.observerConfig[i]);

            if(config.cities != undefined) {
              this.parameters[i] = {container:this.body_container_name[i], callback: ""};//city-aqi-container
              if(config.lang != undefined)
                this.parameters[i]["lang"] = config.lang;
              if(config.display != undefined)
                this.parameters[i]["display"] = config.display;
              
              this.parameters[i]["city"] = config.cities[i];
              _aqiFeed(this.parameters[i]); 
            }
            else 
              throw new Error('The minimum parameter is singe "city" or "cities" array');
            card.appendChild(this.content[i]);
            root.appendChild(card);
          }
        }
      }
    } catch(err){
      console.trace();
      console.log(err);
      console.log('waiting for AQI feed script load');
      this.loadAqiFeedScript(this.temporaryContent[i]);
    }
  }

  getCardSize() {
    return 3;
  }
}

customElements.define('worlds-air-quality-index-widget-api', WorldsAirQualityIndexWidgetApi);