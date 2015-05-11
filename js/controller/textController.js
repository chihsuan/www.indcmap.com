(function() {
  'use strict'

  module.exports = textCtrl;

  function textCtrl ($scope, $rootScope, $location, $http, mapService) {

    $scope.languages = {'Chinese - Traditional': 'tw', 'English': 'en'};
    $scope.selectedLang = 'tw';
    $scope.changeLanguage = changeLanguage;
    $rootScope.page = {};
    setLang($scope.selectedLang);

    function setLang(lang) {
      $http.get('./data/' + lang +'.json').then(function(response) {
        $rootScope.page = response.data;
        mapService.updateLang($rootScope.page);
      });
    }

    function changeLanguage() {
      setLang($scope.selectedLang);
    }


  }

})();
