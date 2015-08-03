(function() {
  'use strict'

  module.exports = angular.module('myApp')
                   .factory('mapService', mapService);
  
  mapService.$inject = ['$http', '$window'];
  var euIcon = L.icon({
    iconUrl: 'http://europa.eu/wel/images/eu_portal/quick_eu_flag.gif',
    iconSize:     [25, 20], // size of the icon
    iconAnchor:   [17, 42], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -35] // point from which the popup should open relative to the iconAnchor
  });

  function mapService ($http, $window) {
   
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
    var euMarker = null;
    var searchControl;
    window.closePopup = closePopup;
   
    info.update = infoUpdate;

    initMap();

    function initMap() {
      map = new L.Map('map');

      var url = 'http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png';
      var attrib = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
      var osm = new L.TileLayer(url, {minZoom: 2,  maxZoom: 16, attribution: attrib, continuousWorld: true});   

      map.setView(new L.LatLng(50, 15), 2);
      osm.addTo(map);
      map.on('popupopen', function(e) {
        $('div.leaflet-top.leaflet-right').hide();
        $('.leaflet-bottom').hide();
        $('.penguin').hide();
        $('#bar').hide();
        $('header').hide();
        //if ($window.innerWidth < 768) {
        $('.close-pop-up-button').show();
        //}
      });
      map.on('popupclose', function(e) {
        $('div.leaflet-top.leaflet-right').show();
        $('.leaflet-bottom').show();
        $('.penguin').show();
        $('#bar').show();
        $('header').show();
        $('.close-pop-up-button').hide();
      });
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
      info.onAdd = addInfo;
      info.addTo(map);
      legend.onAdd = addLegend;
      legend.addTo(map);
      addTopoLayer();
      // marker EU
      if ('European Union' in vm.data) {
          var name = 'European Union';
          var nameLang = vm.lang == 'tw' ? '歐盟' : 'European Union';
          var content = getContent(name, nameLang);
          if (euMarker) {
            map.removeLayer(euMarker)
          }
          euMarker = L.marker([50.843611, 4.382418], {icon: euIcon});
          euMarker.addTo(map).bindPopup(content); 
      }

    }

    function addTopoLayer () {
      if (countryJson) {
        topoLayer = addTopoData(countryJson);
        topoLayer.addTo(map);
        $('.leaflet-control-search').remove();
        searchControl = new L.Control.Search({layer: topoLayer,
         propertyName: 'name', position: 'topright'});
        map.addControl(searchControl);
      }
      else {
        info.update('loading');
        $http.get('./data/countries.lang.geo.json').then(function(response) {
          countryJson = response.data;
          topoLayer = addTopoData(countryJson);
          topoLayer.addTo(map);
          searchControl = new L.Control.Search({layer: topoLayer,
            propertyName: 'name', position: 'topright'});
          map.addControl(searchControl);
          info.update();
        });
      }
    }

    function addTopoData(topoData) {
      var geojson = topoData;
      /*for (var key in topoData.objects) {
        geojson = topojson.feature(topoData, topoData.objects[key]);
      }*/
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
          : '#D5D5D5';
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
        var content = getContent(name, nameLang);
        layer.bindPopup(content, {minWidth: 500});
      }
      else {
        layer.bindPopup('<h2>' + nameLang
          +'</h2><p>' + vm.page.unsubmitted + '</p>');
      }

    }

    function getContent(name, nameLang) {
      var content = '<h2>' + nameLang +'</h2>'
                    + '<table class="table table-condensed"><tbody>';
      for (var key in vm.data[name]) {
         content = content 
                + '<tr><td><strong>'
                + key.substring(2)
                + '</strong></td><td>' 
                + vm.data[name][key]
                + '</td></tr>';
      }
      return content + '</tbody></table>';     
    }

    function closePopup() {
      $(".leaflet-popup-close-button")[0].click();
    }
 
    function resetHighlight(e) {
      topoLayer.resetStyle(e.target);
      info.update();
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
      if (props && props != 'loading') {
        var name = vm.countryLang[props.name][vm.lang];
        this._div.innerHTML = name 
          ? '<h4>' + name +'</h4>'
          : '<h4>' + props.name + '</h4>';
      }
      else if (props) {
        this._div.innerHTML = '<h4>' + vm.page.loadingMsg +'</h4>';
      }
      else {
        this._div.innerHTML = '<h4>' + vm.page.selectCountry + '</h4>';
      }
    };

    function addLegend () {
      var div = L.DomUtil.create('div', 'info legend');
      var color = ['#D5D5D5', '#B50000'];

      for (var i = 0; i < vm.page.labels.length; i++) {
        div.innerHTML += '<div><i style="background:' + color[i]  + '"></i>'
                      + (i == 0 
                        ? vm.page.labels[i]
                        : vm.page.labels[i] + '（'+ Object.keys(vm.data).length + '）'
                      ) + '</div>';
      }
      return div;
    }

    return this;
  }

})();
