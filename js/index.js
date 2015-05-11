(function() {
  'use strict'

  window.showInfo = showInfo;
  window.hideInfo = hideInfo;
  var textCtrl = require('./controller/textController');

  var app = angular.module('myApp', ['ngRoute'])
                   .controller('TextController', textCtrl);
  
  textCtrl.$inject = ['$scope', '$rootScope', '$location', '$http', 'mapService'];

  function showInfo (id) {
    $('section.panel').hide();
    $(id).show();
  }

  function hideInfo (id) {
    $(id).hide();
  }

  require('./service/mapService');
})();
