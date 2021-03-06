(function() {
  'use strict';

  module.exports = textCtrl;

  function textCtrl ($scope, $rootScope, $location, $http, mapService) {

    var path = $location.path();
    var supLang = ['/tw', '/en', '/esp'];
    $scope.languages = {'Chinese - Traditional': '/tw', 'English': '/en', 'Spanish': '/esp'};
    $scope.selectedLang = supLang.indexOf(path) != -1 ? path : '/tw';
    $scope.changeLanguage = changeLanguage;
    $scope.country = null;
    $rootScope.page = {};
    var langs = {};
    var mapData = {};
    initCountryLang();
    setLang($scope.selectedLang);

    function initCountryLang() {
      $http.get('./data/lang.json').then(function(resp) {
        mapService.countryLang = resp.data;
        $scope.countries = Object.keys(resp.data).sort();
      });
    }

    function setLang(lang) {
      if (lang in langs) {
        $location.path(lang);
        lang = lang.substring(1);
        $rootScope.page = langs[lang];
        mapService.updateLang(lang, langs[lang], mapData[lang]);
      }
      else {
        $http.get('./data' + lang + 'Data.json').then(function(resp) {
          $http.get('./data' + lang +'.json').then(function(response) {
            $location.path(lang);
            lang = lang.substring(1);
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
