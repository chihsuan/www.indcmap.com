!function t(n,e,o){function r(i,u){if(!e[i]){if(!n[i]){var d="function"==typeof require&&require;if(!u&&d)return d(i,!0);if(a)return a(i,!0);throw new Error("Cannot find module '"+i+"'")}var c=e[i]={exports:{}};n[i][0].call(c.exports,function(t){var e=n[i][1][t];return r(e?e:t)},c,c.exports,t,n,e,o)}return e[i].exports}for(var a="function"==typeof require&&require,i=0;i<o.length;i++)r(o[i]);return r}({1:[function(t,n,e){!function(){"use strict";function t(t,n,e,o,r){function a(){o.get("./data/lang.json").then(function(t){r.countryLang=t.data})}function i(t){t in d?(n.page=d[t],r.updateLang(t,d[t],c[t])):o.get("./data/"+t+"Data.json").then(function(e){o.get("./data/"+t+".json").then(function(o){n.page=o.data,r.updateLang(t,n.page,e.data),d[t]=o.data,c[t]=e.data})})}function u(){i(t.selectedLang)}t.languages={"Chinese - Traditional":"tw",English:"en"},t.selectedLang="tw",t.changeLanguage=u,n.page={};var d={},c={};a(),i(t.selectedLang)}n.exports=t}()},{}],2:[function(t,n,e){!function(){"use strict";function n(t){$("section.panel").hide(),$(t).show()}function e(t){$(t).hide()}window.showInfo=n,window.hideInfo=e;{var o=t("./controller/textController");angular.module("myApp",["ngRoute"]).controller("TextController",o)}o.$inject=["$scope","$rootScope","$location","$http","mapService"],t("./service/mapService")}()},{"./controller/textController":1,"./service/mapService":3}],3:[function(t,n,e){!function(){"use strict";function t(t){function n(){y=new L.Map("map");var t="http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png",n='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',e=new L.TileLayer(t,{minZoom:2,maxZoom:16,attribution:n,continuousWorld:!0});y.setView(new L.LatLng(50,15),2),e.addTo(y),y.on("popupopen",function(t){$(".leaflet-top").hide(),$(".leaflet-bottom").hide(),$(".penguin").hide()}),y.on("popupclose",function(t){$(".leaflet-top").show(),$(".leaflet-bottom").show(),$(".penguin").show()})}function o(t,n,o){if(v.page=n,v.data=o,v.lang=t,T&&(y.removeLayer(C),y.removeControl(w),y.removeControl(b),b=L.control({position:"bottomleft"}),w=L.control(),w.update=h),r(),w.onAdd=f,w.addTo(y),"EU"in v.data){var a=s("EU","歐盟");return void L.marker([50.843611,4.382418],{icon:e}).addTo(y).bindPopup(a)}b.onAdd=m,b.addTo(y)}function r(){T?(C=a(T),C.addTo(y)):t.get("./data/countries.geo.topo.json").then(function(t){T=t.data,C=a(T),C.addTo(y)})}function a(t){var n;for(var e in t.objects)n=topojson.feature(t,t.objects[e]);return L.geoJson(n,{style:i,onEachFeature:d})}function i(t){return{fillColor:u(t),weight:2,opacity:1,color:"#eee",dashArray:"",fillOpacity:.55}}function u(t){return t.properties.name in v.data?"#B50000":"#D5D5D5"}function d(t,n){n.on({mouseover:l,mouseout:p,click:g}),c(t,n)}function c(t,n){var e=t.properties.name,o=v.countryLang[e]&&v.countryLang[e][v.lang]?v.countryLang[e][v.lang]:e;if(e in v.data)if("en"==v.lang)n.bindPopup("<h2>"+o+'</h2><table class="table table-condensed"><tbody><tr><td><strong>INDC summary</strong></td><td>'+v.data[e].INDCsummary+"</td></tr><tr><td><strong>INDC type</strong></td><td>"+v.data[e].INDCtype+"</td></tr><tr><td><strong>GHG target type</strong></td><td>"+v.data[e].GHGtarget+"</td></tr><tr><td><strong>Link to the submission</strong></td><td>"+v.data[e].Linkto+"</td></tr><tr><td><strong>Source</strong></td><td>WRI, CAIT 2.0. 2015. CAIT Paris Contributions Map. Washington, DC: World Resources Institute. Available at: http://cait2.wri.org/indcs/</td></tr></tbody></table>",{minWidth:500});else{var r=s(e,o);n.bindPopup(r,{minWidth:500})}else n.bindPopup("<h2>"+o+"</h2><p>"+v.page.unsubmitted+"</p>")}function s(t,n){var e="<h2>"+n+'</h2><table class="table table-condensed"><tbody>';for(var o in v.data[t])e=e+"<tr><td><strong>"+o.substring(2)+"</strong></td><td>"+v.data[t][o]+"</td></tr>";return e+"</tbody></table>"}function p(t){C.resetStyle(t.target),w.update()}function l(t){var n=t.target;n.setStyle({weight:2,color:"#666",dashArray:"",fillOpacity:.7}),L.Browser.ie||L.Browser.opera||n.bringToFront(),w.update(n.feature.properties)}function g(t){w.update(t.target.feature.properties)}function f(){return this._div=L.DomUtil.create("div","info"),this._div.innerHTML="<h4>"+v.page.selectCountry+"</h4>",this._div}function h(t){if(t){var n=v.countryLang[t.name][v.lang];this._div.innerHTML=n?"<h4>"+n+"</h4>":"<h4>"+t.name+"</h4>"}else this._div.innerHTML="<h4>"+v.page.selectCountry+"</h4>"}function m(){for(var t=L.DomUtil.create("div","info legend"),n=["#D5D5D5","#B50000"],e=0;e<v.page.labels.length;e++)t.innerHTML+='<i style="background:'+n[e]+'"></i>'+v.page.labels[e]+"<br/>";return t}var v=this;v.updateLang=o;{var y,b=L.control({position:"bottomleft"}),w=L.control(),C={},T="";L.icon({iconUrl:"./img/tree.png",iconSize:[30,35],iconAnchor:[17,42],popupAnchor:[0,-35]})}return w.update=h,n(),this}n.exports=angular.module("myApp").factory("mapService",t),t.$inject=["$http"];var e=L.icon({iconUrl:"http://europa.eu/wel/template-2011/images/europa-flag.gif",iconSize:[25,25],iconAnchor:[17,42],popupAnchor:[0,-35]})}()},{}]},{},[2]);