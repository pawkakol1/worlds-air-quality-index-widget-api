/**
 * Hassio frontend custom worlds-air-quality-index-widget-api
 */
class WorldsAirQualityIndexWidgetApi extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.elementsSet = false;
  }

  setConfig(config) {
    //console.log('setConfig:try:loadAqiFeedScript');
    const root = this.shadowRoot;
    //this.loadAqiFeedScript(window, 'script', '_aqiFeed');
    //console.log('setConfig:loaded:loadAqiFeedScript');
    if (root.lastChild) root.removeChild(root.lastChild);

    const cardConfig = Object.assign({}, config);
    this._config = cardConfig
  }

/**
 * Script downloaded from https://aqicn.org/faq/2015-07-28/air-quality-widget-new-improved-feed/
 */
  loadAqiFeedScript(w,t,f) {
    if(window[`scriptLoaded_AqiFeedScript`]){
      return;
    }
    console.log("loadAqiFeedScript");
    w[f] = w[f] || function(c,k,n) {
      console.log("AqiFeed Func1");
      var s = w[f], k = s['k'] = (s['k'] || (k ? ('&k=' + k) : ''));
      console.log("AqiFeed Func2");
      s['c'] = c = (c instanceof Array) ? c : [c];
      console.log("AqiFeed Func3");
      s['n'] = n = n || 0;
      console.log("AqiFeed Func4");
      var L = document.createElement(t);
      var e = document.getElementsByTagName('body')[0]; //need to be done for last element!!!
      console.log("AqiFeed Func5");
      L.async = 1;
      console.log("AqiFeed Func6");
      L.src = 'https://feed.aqicn.org/feed/' + (c[n].city) + '/' + (c[n].lang || '') + '/feed.v1.js?n=' + n + k;
      console.log(e);
      console.log(L);
      e.appendChild(L);
    };
    window[`scriptLoaded_AqiFeedScript`] = true;
  }

  set hass(hass) {
    const config = this._config;
    const root = this.shadowRoot;
    const bodyRoot = document.getElementsByTagName('body')[0];
    try{
      console.log('try!');
      this._hass = hass;
      console.log(window);
      console.log(this.content);
      console.log((!this.content && window[`scriptLoaded_AqiFeedScript`]));
      if(!this.content) {
        console.log("create elements");
        const card = document.createElement('ha-card');
        this.temporaryContent = document.createElement('div');
        this.temporaryContent.setAttribute("id", "city-aqi-container");
        bodyRoot.appendChild(this.temporaryContent);
        //root.appendChild(card);
        console.log(this.shadowRoot.querySelector('#city-aqi-container'));
        this.loadAqiFeedScript(window, 'script', '_aqiFeed');
        console.log(document.getElementById('city-aqi-container'));
        this.elementsSet = true;
        console.log("elements creating done");
        if(window[`scriptLoaded_AqiFeedScript`]) {
          this.content = document.createElement('div');
          this.content.setAttribute("id", "waqi-container");
          console.log('start!');
          /*document.addEventListener("DOMNodeInsertedIntoDocument", function(event) {
            var content = document.getElementById('city-aqi-container').innerHTML;
            if(content != "") {
              this.content.innerHTML = content;
              bodyRoot.removeChild(this.temporaryContent);
              console.log('child removed!');
            }
          });*/
          /*const config = {childList: true};
          const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
              if (mutation.type === "childList") {
                console.log("A child node has been added or removed.");
                var content = document.getElementById('city-aqi-container').innerHTML;
                console.log(content);
                this.content.innerHTML = content;
                bodyRoot.removeChild(this.temporaryContent);
                console.log('child removed!');
                observer.disconnect();
              }
            }
          };
          const observer = new MutationObserver(callback);
          observer.observe(this.temporaryContent, config);*/

          console.log('_aqiFeed!');
          _aqiFeed({container:"city-aqi-container", city:"poland/gdansk/gdansk-srodmiescie/", lang:"pl", display:"<center>%details</center>"}); 
          console.log('_aqiFeed done!');
          console.log('finish!');
          console.log(this.temporaryContent);
          console.log("Delayed for 0,1 second.");
          setTimeout(() => {
            console.log("Done!");
            var content = document.getElementById('city-aqi-container').innerHTML;
            this.content.innerHTML = content;
            console.log(this.content);
            bodyRoot.removeChild(this.temporaryContent);
            console.log('child removed!');
          }, 100);
          card.appendChild(this.content);
          root.appendChild(card);
        }
      }
    } catch(err){
      console.trace();
      console.log(err);
      console.log('waiting for AQI feed script load');
      this.loadAqiFeedScript(window, 'script', '_aqiFeed');
    }
  }

  getCardSize() {
    return 3;
  }
}

customElements.define('worlds-air-quality-index-widget-api', WorldsAirQualityIndexWidgetApi);