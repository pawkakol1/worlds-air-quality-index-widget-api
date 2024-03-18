# worlds-air-quality-index-widget-api

A Home Assistant custom Fronted for World's Air Quality Index widget API (waqi.info).

![Widget](https://github.com/pawkakol1/worlds-air-quality-index-widget-api/blob/main/images/london-AQI_widget_API.png)

Fronted supports widget described in this link: [](https://aqicn.org/faq/2015-07-28/air-quality-widget-new-improved-feed/en/)

To add it into Lovelace dashoard, you need to select:
- add card,
- Manual (Need to add a custom card or just want to manually write the YAML?)
- And put below example code in Card configuration popup

```
city:
  - london
lang: en
display: <center>%details</center>
type: custom:worlds-air-quality-index-widget-api
```

City parameter determines station, you can put simple name of city such as london, or you can put full name of your specified station:
```
city:
  - united-kingdom/london-bloomsbury/
lang: en
display: <center>%details</center>
type: custom:worlds-air-quality-index-widget-api
```
To get your station city text, you need to find it on waqi.info website map, and click on it. You will be moved to aqicn.org website to your specific station details. 
In the URL of the browser you will find name of the station. You need to copy it and paste to the Manual card configuration as a city parameter

![URL text](https://github.com/pawkakol1/worlds-air-quality-index-widget-api/blob/main/images/station_URL.png)

Lang parameter allows to set language of the widget. Supported languages are predefined by waqi.info, below is the list of all supported languages:
- "en": English
- "cn": Chinese
- "jp": Japanese
- "es": Spanish
- "kr": Korean
- "ru": Russian
- "hk": Traditional Chinese
- "fr": French
- "pl": Polish
- "de": German
- "pt": Portuguese
- "vn": Vietnamese
- "it": Italian
- "id": Indonesian
- "nl": Dutch
- "fa": Persian
- "th": Thai
- "hu": Hungarian
- "el": Greek
- "ro": Romanian
- "bg": Bulgarian
- "ur": Urdu
- "hi": Hindi
- "ar": Arabic
- "sr": Serbian
- "bn": Bangla
- "hu": Hungarian
- "bs": Bosnian
- "hr": Croatian

Display determines method of widget printing, and it affects appearance of the widget. It is a HTML-based string, and can contain any of the following keywords:
- `%cityname` for the name of the city (eg Beijing),
- `%aqi` for the decorated AQI value (eg 58),
- `%aqiv` for the undecorated (raw text) AQI value (eg 58),
- `%style` for the css declaration of the decorated AQI details (eg background-color: #ffde33;color:#000000;),
- `%date` for the time at which the AQI was updated (eg Wed 20:00),
- `%impact` for the associated health impact (eg Good, Moderate...)
- `%attribution` for the AQI data attribution ( eg Beijing Environmental Protection Monitoring Center)
- `%details` for the full AQI details (the content of the popup displayed when moving the mouse over the AQI value).

For examples of the usage you can go to this link: [](https://aqicn.org/faq/2015-07-28/air-quality-widget-new-improved-feed/en/)