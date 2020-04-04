MyApp.controller('controller',['$scope','Authenticate','$timeout','$rootScope',function($scope,Authenticate,$timeout,$rootScope){
  $rootScope.success = true;
  $scope.danger = true;

  //$rootScope.loginPage = false ;
  //$rootScope.home =true;
  
  $scope.login = function(){
  console.log(new Date());
  
 Authenticate.login($scope.nom , $scope.password).then(function(response){
  
          if (response.id !== 0){
          
                var last = localStorage.getItem("last_connexion") ;
                $rootScope.storage = last ;  
                $rootScope.success = false;
                
                $timeout(function () {
                // $scope.success = true;
                    }, 2000);
              
                    socket.emit('newConnection', response);
              
              $scope.loginPage = true;
              $rootScope.home = false;

          }else{

              $scope.danger = false;
              $timeout(function () {
                $scope.danger = true;
              }, 2000);
          }
//	return response ;

     });
   
   }

}]);