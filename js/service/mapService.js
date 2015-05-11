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
      var osm = new L.TileLayer(url, {minZoom: 2,  maxZoom: 16, attribution: attrib});   

      map.setView(new L.LatLng(50, 15), 2);
      osm.addTo(map);
    }

    function updateLang(page) {
      vm.page = page;
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
        fillColor: '#F9BD52', 
        weight: 2,
        opacity: 1,
        color: '#eee',
        dashArray: '3',
        fillOpacity: 0.4
      };
    }

    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
      });
      layer.bindPopup('<h2>' + feature.properties.name +'</h2>'
                    + '<table class="table table-condensed"><tbody>'
                    + '<tr><td><strong>INDC summary </strong></td><td>Limiting anthropogenic greenhouse gases in Russia to 70-75% of 1990 levels by the year 2030 might be a long-term indicator, subject to the maximum possible account of absorbing capacity of forests.</td></tr></tbody></table>');
    }
 
    function resetHighlight(e) {
      topoLayer.resetStyle(e.target);
    }

    function highlightFeature(e) {
      var layer = e.target;
      layer.setStyle({
        weight: 5,
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
        this._div.innerHTML = '<h4>' + props.name +'</h4>';
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
