(function() {
  'use strict'

  module.exports = textCtrl;

  function textCtrl ($scope, $rootScope, $location, $http, mapService) {

    $scope.languages = {'Chinese - Traditional': 'tw', 'English': 'en'};
    $scope.selectedLang = 'tw';
    $scope.changeLanguage = changeLanguage;
    $rootScope.page = {};
    var langs = {};
    var mapData = {}
    initCountryLang();
    setLang($scope.selectedLang);

    function initCountryLang() {
      $http.get('./data/lang.json').then(function(resp) {
        mapService.countryLang = resp.data;
      });
    }

    function setLang(lang) {
      if (lang in langs) {
        $rootScope.page = langs[lang];
        mapService.updateLang(lang, langs[lang], mapData[lang]);
      }
      else {
        $http.get('./data/data.json').then(function(resp) {
          $http.get('./data/' + lang +'.json').then(function(response) {
            $rootScope.page = response.data;
            mapService.updateLang(lang, $rootScope.page, resp.data);
            langs[lang] = response.data;
            mapData[lang] = resp.data;
          });
        });
      }
    }

    function changeLanguage() {
      setLang($scope.selectedLang);
    }
  }

})();
