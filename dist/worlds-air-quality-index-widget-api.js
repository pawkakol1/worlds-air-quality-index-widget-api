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

  /**
   * Callback method of MutationObserver
   * @param {Collection} mutationList 
   */
  callbackMutationObserver(mutationList) {
    const bodyRoot = document.getElementsByTagName('body')[0];
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        var index = -1;
        //Get Array index of mutated object
        for(var i= 0; i < this.body_container_name.length; i++) {
          if(mutation.target.id == this.body_container_name[i]) {
            index = i;
            break;
          }
        }
        //move widget from body to ha-card and remove object from body
        this.content[index].innerHTML = document.getElementById(mutation.target.id).innerHTML;//city-aqi-container
        bodyRoot.removeChild(this.temporaryContent[index]);
        this.observer[index].disconnect();
      }
    }
  }

  /**
   * Sets configuration of the card
   * @param {Collection} config 
   */
  setConfig(config) {
    const root = this.shadowRoot
    //remove added widgets
    while (root.lastChild) {
      root.removeChild(root.lastChild);
    };
    const cardConfig = Object.assign({}, config);
    this.content = new Array();
    this.temporaryContent = new Array();
    this.observerConfig = new Array();
    this.observer = new Array();
    this.parameters = new Array();
    this._config = cardConfig;
    this.card = null;
    //get configuration parameters
    if(config.city != undefined) {
      //if there is only one city defined, then convert value to one element Array
      if(!Array.isArray(config.city)) {
        var city = config.city;
        this._config.city = new Array();
        this._config.city.push(city);
      }
      //generate names of containers and scripts
      this.body_container_name = new Array();
      this.card_container_name = new Array();
      this.script_name = new Array();
      var converted_city;
      //read all defined cities
      for(var i = 0; i < this._config.city.length; i++) {
        console.log("city: " + this._config.city[i]);
        converted_city = this._config.city[i].replace(/[\/]/gm, '-');
        console.log("converted_city: " + converted_city);
        this.body_container_name.push(converted_city + "-aqi-container");
        this.card_container_name.push(converted_city + "-waqi-container");
        this.script_name.push(converted_city + "_AqiFeedScript");
      }
    }
  }

  /**
   * Script downloaded from https://aqicn.org/faq/2015-07-28/air-quality-widget-new-improved-feed/
   * adjusted to work with worlds-air-quaility
   * @param {String} scriptName   Name of the script
   */
  loadAqiFeedScript(scriptName) {
    if(window[scriptName]) {
      return;
    }
    window[scriptName] = true;
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
  }

  /**
   * 
   * @param {Collection} hass 
   */
  set hass(hass) {
    const config = this._config;
    const root = this.shadowRoot;
    const bodyRoot = document.getElementsByTagName('body')[0];

    if(this.card == null) {
      this.card = document.createElement('ha-card');
    }

    try{
      this._hass = hass;
      //repeat for all predefined cities names
      for(var i = 0; i < this._config.city.length; i++) {
        if(this.content.length < (i + 1)) {
          this.temporaryContent.push(document.createElement('div'));
          this.temporaryContent[i].setAttribute("id", this.body_container_name[i]);//city-aqi-container
          bodyRoot.appendChild(this.temporaryContent[i]);
          
          //load city script
          if(!window[this.script_name[i]])
            this.loadAqiFeedScript(this.script_name[i]);
          
          //if script loaded
          if(window[this.script_name[i]]) {
            //add new div to content array
            this.content.push(document.createElement('div'));
            this.content[i].setAttribute("id", this.card_container_name[i]);

            //set MutationObserver
            this.observerConfig.push({childList: true});
            this.observer.push(new MutationObserver(mutationList => {
              this.callbackMutationObserver(mutationList)//can be added additional argument
            }));
            this.observer[i].observe(this.temporaryContent[i], this.observerConfig[i]);
            //prepare parameters for _aqiFeed()
            if(config.city != undefined) {
              this.parameters[i] = {container: this.body_container_name[i]};//, callback: WorldsAirQualityIndexWidgetApi.callbackAqiFeed};//city-aqi-container
              if(config.lang != undefined)
                this.parameters[i]["lang"] = config.lang;
              if(config.display != undefined)
                this.parameters[i]["display"] = config.display;
              this.parameters[i]["city"] = config.city[i];
            }
            else 
              throw new Error('The minimum parameter is singe "city" or "city" array');
            this.card.appendChild(this.content[i]);
          }
        }
      }
      _aqiFeed(this.parameters); 
      root.appendChild(this.card);
    } catch(err){
      console.trace();
      console.log(err);
      console.log('waiting for AQI feed script load');
      //this.loadAqiFeedScript(this.temporaryContent[i]);
    }
  }

  getCardSize() {
    return 3;
  }
}

customElements.define('worlds-air-quality-index-widget-api', WorldsAirQualityIndexWidgetApi);