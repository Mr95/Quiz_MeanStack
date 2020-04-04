MyApp.controller('logoutController',['$scope','$rootScope','Authenticate' ,function($scope , $rootScope,Authenticate){

     
    
     $scope.logout = function(){

  

        socket.emit('leave',localStorage.getItem('user'));

        Authenticate.logout();
        $rootScope.success = false;
        $rootScope.loginPage = true ;
        $rootScope.home =false;
       /* console.log('logout function controller called');
        console.log($rootScope.success);
        console.log($rootScope.loginPage);
        console.log($rootScope.home);
        */  
            window.location = '/';
     }

     
    

}]);

