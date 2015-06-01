!function t(e,n,o){function r(i,c){if(!n[i]){if(!e[i]){var u="function"==typeof require&&require;if(!c&&u)return u(i,!0);if(a)return a(i,!0);throw new Error("Cannot find module '"+i+"'")}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(t){var n=e[i][1][t];return r(n?n:t)},p,p.exports,t,e,n,o)}return n[i].exports}for(var a="function"==typeof require&&require,i=0;i<o.length;i++)r(o[i]);return r}({1:[function(t,e,n){!function(){e.exports=function(){var t=[100,31.1],e=d3.select("#bar").insert("svg",":first-child").attr("class","chart").attr("width",150).attr("height",20*t.length),n=d3.scale.linear().domain([0,d3.max(t)]).range([0,150]);e.selectAll("rect").data(t).enter().append("rect").attr("width",n).attr("height",20).attr("rx",5).attr("ry",5),e.selectAll("text").data([t[1]]).enter().append("text").attr("x",n).attr("y",10).attr("dx",-3).attr("dy",".35em").attr("text-anchor","end").text(t[1]+"%")}}()},{}],2:[function(t,e,n){!function(){"use strict";function t(t,e,n,o,r){function a(){o.get("./data/lang.json").then(function(t){r.countryLang=t.data})}function i(t){t in l?(n.path(t),e.page=l[t],r.updateLang(t,l[t],d[t])):o.get("./data"+t+"Data.json").then(function(a){o.get("./data"+t+".json").then(function(o){n.path(t),e.page=o.data,r.updateLang(t,e.page,a.data),l[t]=o.data,d[t]=a.data})})}function c(){i(t.selectedLang)}var u=n.path(),p=["/tw","/en"];t.languages={"Chinese - Traditional":"/tw",English:"/en"},t.selectedLang=-1!=p.indexOf(u)?u:"/tw",t.changeLanguage=c,e.page={};var l={},d={};a(),i(t.selectedLang)}e.exports=t}()},{}],3:[function(t,e,n){!function(){"use strict";function e(t){$("section.panel").hide(),$(t).show()}function n(t){$(t).hide()}window.showInfo=e,window.hideInfo=n;{var o=t("./controller/textController");angular.module("myApp",["ngRoute"]).controller("TextController",o)}o.$inject=["$scope","$rootScope","$location","$http","mapService"],t("./service/mapService"),t("./bar")()}()},{"./bar":1,"./controller/textController":2,"./service/mapService":4}],4:[function(t,e,n){!function(){"use strict";function t(t,e){function o(){b=new L.Map("map");var t="http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png",e='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',n=new L.TileLayer(t,{minZoom:2,maxZoom:16,attribution:e,continuousWorld:!0});b.setView(new L.LatLng(50,15),2),n.addTo(b),b.on("popupopen",function(t){$("div.leaflet-top.leaflet-right").hide(),$(".leaflet-bottom").hide(),$(".penguin").hide(),$("#bar").hide(),$("header").hide(),$(".close-pop-up-button").show()}),b.on("popupclose",function(t){$("div.leaflet-top.leaflet-right").show(),$(".leaflet-bottom").show(),$(".penguin").show(),$("#bar").show(),$("header").show(),$(".close-pop-up-button").hide()})}function r(t,e,o){if(y.page=e,y.data=o,y.lang=t,j&&(b.removeLayer(A),b.removeControl(T),b.removeControl(x),x=L.control({position:"bottomleft"}),T=L.control(),T.update=m),a(),T.onAdd=v,T.addTo(b),x.onAdd=w,x.addTo(b),"Europen Union"in y.data){var r="Europen Union",i="/tw"==y.lang?"歐盟":"Europen Union",c=d(r,i);C&&b.removeLayer(C),C=L.marker([50.843611,4.382418],{icon:n}),C.addTo(b).bindPopup(c)}}function a(){j?(A=i(j),A.addTo(b)):t.get("./data/countries.geo.topo.json").then(function(t){j=t.data,A=i(j),A.addTo(b)})}function i(t){var e;for(var n in t.objects)e=topojson.feature(t,t.objects[n]);return L.geoJson(e,{style:c,onEachFeature:p})}function c(t){return{fillColor:u(t),weight:2,opacity:1,color:"#eee",dashArray:"",fillOpacity:.55}}function u(t){return t.properties.name in y.data?"#B50000":"#D5D5D5"}function p(t,e){e.on({mouseover:h,mouseout:f,click:g}),l(t,e)}function l(t,e){var n=t.properties.name,o=y.countryLang[n]&&y.countryLang[n][y.lang]?y.countryLang[n][y.lang]:n;if(n in y.data){var r=d(n,o);e.bindPopup(r,{minWidth:500})}else e.bindPopup("<h2>"+o+"</h2><p>"+y.page.unsubmitted+"</p>")}function d(t,e){var n="<h2>"+e+'</h2><table class="table table-condensed"><tbody>';for(var o in y.data[t])n=n+"<tr><td><strong>"+o.substring(2)+"</strong></td><td>"+y.data[t][o]+"</td></tr>";return n+"</tbody></table>"}function s(){$(".leaflet-popup-close-button")[0].click()}function f(t){A.resetStyle(t.target),T.update()}function h(t){var e=t.target;e.setStyle({weight:2,color:"#666",dashArray:"",fillOpacity:.7}),L.Browser.ie||L.Browser.opera||e.bringToFront(),T.update(e.feature.properties)}function g(t){T.update(t.target.feature.properties)}function v(){return this._div=L.DomUtil.create("div","info"),this._div.innerHTML="<h4>"+y.page.selectCountry+"</h4>",this._div}function m(t){if(t){var e=y.countryLang[t.name][y.lang];this._div.innerHTML=e?"<h4>"+e+"</h4>":"<h4>"+t.name+"</h4>"}else this._div.innerHTML="<h4>"+y.page.selectCountry+"</h4>"}function w(){for(var t=L.DomUtil.create("div","info legend"),e=["#D5D5D5","#B50000"],n=0;n<y.page.labels.length;n++)t.innerHTML+='<div><i style="background:'+e[n]+'"></i>'+(0==n?y.page.labels[n]:y.page.labels[n]+"（"+Object.keys(y.data).length+"）")+"</div>";return t}var y=this;y.updateLang=r;var b,x=L.control({position:"bottomleft"}),T=L.control(),A={},j="",C=(L.icon({iconUrl:"./img/tree.png",iconSize:[30,35],iconAnchor:[17,42],popupAnchor:[0,-35]}),null);return window.closePopup=s,T.update=m,o(),this}e.exports=angular.module("myApp").factory("mapService",t),t.$inject=["$http","$window"];var n=L.icon({iconUrl:"http://europa.eu/wel/images/eu_portal/quick_eu_flag.gif",iconSize:[25,20],iconAnchor:[17,42],popupAnchor:[0,-35]})}()},{}]},{},[3]);