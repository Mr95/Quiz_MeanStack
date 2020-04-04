MyApp.controller('historiqueController',['$scope','historiqueService' ,  function($scope , historiqueService){

historiqueService.getHistorique().then(function(response){
    
    console.log('profileService called') ;
    $scope.historiques  = response ;

   });


   historiqueService.getTopTen().then(function(response){
    
    console.log('profileService called') ;
    $scope.topten  = response ;

   });

   

}]);