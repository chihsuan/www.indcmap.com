(function() {
  'use strict'

  module.exports = angular.module('myApp')
                   .factory('mapService', mapService);
  
  mapService.$inject = ['$http'];

  function mapService ($http) {
   
    var vm = this;
    vm.updateLang = updateLang;
    var map;
    var legend = L.control({position: 'bottomleft'});
    var info = L.control();
    var topoLayer = {};
    var countryJson = '';
    var treeIcon = L.icon({
      iconUrl: './img/tree.png',
      iconSize:     [30, 35], 
      iconAnchor:   [17, 42], 
      popupAnchor:  [0, -35] 
    });
   
    info.update = infoUpdate;

    initMap();

    function initMap() {
      map = new L.Map('map');

      var url = 'http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png';
      var attrib = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
      var osm = new L.TileLayer(url, {minZoom: 2,  maxZoom: 16, attribution: attrib, continuousWorld: true});   

      map.setView(new L.LatLng(50, 15), 2);
      osm.addTo(map);
    }

    function updateLang(lang, page, data) {
      vm.page = page;
      vm.data = data;
      vm.lang = lang;
      if (countryJson) {
        map.removeLayer(topoLayer);
        map.removeControl(info);
        map.removeControl(legend);
        legend = L.control({position: 'bottomleft'});
        info = L.control();
        info.update = infoUpdate;
      }
      addTopoLayer();
      info.onAdd = addInfo;
      info.addTo(map);

      legend.onAdd = addLegend;
      legend.addTo(map);
    }

    function addTopoLayer () {
      if (countryJson) {
        topoLayer = addTopoData(countryJson);
        topoLayer.addTo(map);
      }
      else {
        $http.get('./data/countries.geo.topo.json').then(function(response) {
          countryJson = response.data;
          topoLayer = addTopoData(countryJson);
          topoLayer.addTo(map);
        });
      }
    }

    function addTopoData(topoData) {
      var geojson;
      for (var key in topoData.objects) {
        geojson = topojson.feature(topoData, topoData.objects[key]);
      }
      return L.geoJson(geojson, {
        style: style,
        onEachFeature: onEachFeature
      });
    }  

    function style(feature) {
      return {
        fillColor: getColor(feature), 
        weight: 2,
        opacity: 1,
        color: '#eee',
        dashArray: '',
        fillOpacity: 0.55
      };
    }

    function getColor (feature) {
      return feature.properties.name in vm.data 
          ? '#B50000'
          : '#F9BD52';
    } 

    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
      });
      bindContent(feature, layer);
    }

    function bindContent(feature, layer) {
      var name = feature.properties.name;
      var nameLang = (vm.countryLang[name] && vm.countryLang[name][vm.lang])
        ? vm.countryLang[name][vm.lang]
        : name;
      
      if (name in vm.data) {
        layer.bindPopup('<h2>' + nameLang +'</h2>'
                    + '<table class="table table-condensed"><tbody>'
                    + '<tr><td><strong>INDC summary</strong></td><td>' 
                    + vm.data[name].INDCsummary
                    + '</td></tr>'
                    + '<tr><td><strong>INDC type</strong></td><td>' 
                    + vm.data[name].INDCtype
                    + '</td></tr>'
                    + '<tr><td><strong>GHG target type</strong></td><td>' 
                    + vm.data[name].GHGtarget
                    + '</td></tr>'
                    + '<tr><td><strong>Link to the submission</strong></td><td>' 
                    + vm.data[name].Linkto
                    + '</td></tr>'
                    + '<tr><td><strong>Source</strong></td><td>WRI, CAIT 2.0. 2015. CAIT Paris Contributions Map. Washington, DC: World Resources Institute. Available at: http://cait2.wri.org/indcs/</td></tr>'
                    + '</tbody></table>', {minWidth: 500});
      }
      else {
        layer.bindPopup('<h2>' + nameLang
          +'</h2><p>' + vm.page.unsubmitted + '</p>');
      }
    }
 
    function resetHighlight(e) {
      topoLayer.resetStyle(e.target);
    }

    function highlightFeature(e) {
      var layer = e.target;
      layer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
      });

      if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
      }
      info.update(layer.feature.properties);
    }

    function zoomToFeature(e) {
      info.update(e.target.feature.properties);
    }
    
    function addInfo () {
      this._div = L.DomUtil.create('div', 'info'); 
      this._div.innerHTML = '<h4>' + vm.page.selectCountry + '</h4>';
      return this._div;
    };

    function infoUpdate (props) {
      if (props) {
        var name = vm.countryLang[props.name][vm.lang];
        this._div.innerHTML = name 
          ? '<h4>' + name +'</h4>'
          : '<h4>' + props.name + '</h4>';
      }

    };

    function addLegend () {
      var div = L.DomUtil.create('div', 'info legend');
      var color = ['#F9BD52', '#B50000'];

      for (var i = 0; i < vm.page.labels.length; i++) {
        div.innerHTML += '<i style="background:' + color[i] 
                      + '"></i>' + vm.page.labels[i] + '<br/>';
      }
      return div;
    }

    return this;
  }

})();
