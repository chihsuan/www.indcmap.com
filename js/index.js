(function() {
  'use strict'

  var map;
  var showLinks = false;
  var info = L.control();
  var topoLayer;
  var treeIcon = L.icon({
    iconUrl: './img/tree.png',
    iconSize:     [30, 35], // size of the icon
    iconAnchor:   [17, 42], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -35] // point from which the popup should open relative to the iconAnchor
  });


  window.resetView = resetView;
  window.showInfo = showInfo;
  window.hideInfo = hideInfo;

  $( document ).ready(function() {
    initMap();
    //addMarkers();
    $.getJSON('./data/countries.geo.topo.json', function(topoData) {
       topoLayer = addTopoData(topoData);
       topoLayer.addTo(map);
    });
  });


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


  function initMap() {
    map = new L.Map('map');

    var url = 'http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png';
    var attrib = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
    var osm = new L.TileLayer(url, {minZoom: 2,  maxZoom: 16, attribution: attrib});   

    map.fitBounds([
      [40.712, -74.227],
      [40.774, -74.125]
    ]);
    map.setView(new L.LatLng(50, 15), 2);
    osm.addTo(map);
    info.addTo(map); 
    legend.addTo(map);
  }

  function style(feature) {
    return {
      fillColor: '#F9BD52', //getColor(feature.properties.name),
      weight: 2,
      opacity: 1,
      color: '#eee',
      dashArray: '3',
      fillOpacity: 0.4
    };
  } 


  function addMarkers() {
    var marker = L.marker([23, 122],
      {icon: treeIcon, opacity: 0.9})
      .addTo(map);   
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

  info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this._div.innerHTML = '<h4>請選擇國家</h4>'
      return this._div;
  };

  info.update = function (props) {
    if (props) {
      this._div.innerHTML = '<h4>' + props.name +'</h4>';
    }
  };

  var legend = L.control({position: 'bottomleft'});

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    var color = ['#F9BD52'];
    var labels = ['尚未提交減碳承諾'];

    for (var i = 0; i < labels.length; i++) {
      div.innerHTML += '<i style="background:' + color[i] 
        + '"></i>' + labels[i] + '<br/>';
    }

    return div;
  };


  function resetView () {
    map.setView(new L.LatLng(50, 15), 2);
  }

  function showInfo (id) {
    $('section.panel').hide();
    $(id).show();
  }

  function hideInfo (id) {
    $(id).hide();
  }

})();
