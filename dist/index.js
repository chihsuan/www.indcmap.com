!function t(e,o,n){function r(a,u){if(!o[a]){if(!e[a]){var s="function"==typeof require&&require;if(!u&&s)return s(a,!0);if(i)return i(a,!0);throw new Error("Cannot find module '"+a+"'")}var c=o[a]={exports:{}};e[a][0].call(c.exports,function(t){var o=e[a][1][t];return r(o?o:t)},c,c.exports,t,e,o,n)}return o[a].exports}for(var i="function"==typeof require&&require,a=0;a<n.length;a++)r(n[a]);return r}({1:[function(t,e,o){!function(){"use strict";function t(t){var e;for(var n in t.objects)e=topojson.feature(t,t.objects[n]);return L.geoJson(e,{style:o,onEachFeature:a})}function e(){f=new L.Map("map");var t="http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png",e='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',o=new L.TileLayer(t,{minZoom:2,maxZoom:16,attribution:e});f.fitBounds([[40.712,-74.227],[40.774,-74.125]]),f.setView(new L.LatLng(50,15),2),o.addTo(f),p.addTo(f),l.addTo(f)}function o(t){return{fillColor:"#F9BD52",weight:2,opacity:1,color:"#eee",dashArray:"3",fillOpacity:.4}}function n(t){d.resetStyle(t.target)}function r(t){var e=t.target;e.setStyle({weight:5,color:"#666",dashArray:"",fillOpacity:.7}),L.Browser.ie||L.Browser.opera||e.bringToFront(),p.update(e.feature.properties)}function i(t){p.update(t.target.feature.properties)}function a(t,e){e.on({mouseover:r,mouseout:n,click:i}),e.bindPopup("<h2>"+t.properties.name+'</h2><table class="table table-condensed"><tbody><tr><td><strong>INDC summary </strong></td><td>Limiting anthropogenic greenhouse gases in Russia to 70-75% of 1990 levels by the year 2030 might be a long-term indicator, subject to the maximum possible account of absorbing capacity of forests.</td></tr></tbody></table>')}function u(){f.setView(new L.LatLng(50,15),2)}function s(t){$("section.panel").hide(),$(t).show()}function c(t){$(t).hide()}var f,d,p=L.control();window.resetView=u,window.showInfo=s,window.hideInfo=c,$(document).ready(function(){e(),$.getJSON("./data/countries.geo.topo.json",function(e){d=t(e),d.addTo(f)})}),p.onAdd=function(t){return this._div=L.DomUtil.create("div","info"),this._div.innerHTML="<h4>請選擇國家</h4>",this._div},p.update=function(t){t&&(this._div.innerHTML="<h4>"+t.name+"</h4>")};var l=L.control({position:"bottomright"});l.onAdd=function(t){for(var e=L.DomUtil.create("div","info legend"),o=["#684064","#D24C39","#E39941","#39AADD"],n=[""],r=0;r<n.length;r++)e.innerHTML+='<i style="background:'+o[r]+'"></i>'+n[r]+"<br/>";return e}}()},{}]},{},[1]);