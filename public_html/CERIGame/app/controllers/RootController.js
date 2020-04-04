MyApp.controller('RootController',['$scope','$rootScope','Authenticate',function($scope,$rootScope,Authenticate){
 
    $rootScope.loginPage = false ;
    $rootScope.home =true;

    $rootScope.notif = true;
    $rootScope.notifs = [];

    $scope.connected_players = [];

    $scope.refus_defi = true ;
    
    if(!Authenticate.isLoggedin()){
  
        var last = localStorage.getItem("last_connexion") ;

        $rootScope.loginPage = false ;
        $rootScope.home = true;
        $rootScope.storage = last ;  
        console.log('logedin');
    }else{

        $rootScope.loginPage = true ;
        $rootScope.home = false ;
        console.log('loggedout');
    }

    socket.on('user_connected',function(data){
        
        $scope.connected_players = data ;
    });


    socket.on('notification',function(data){
        
        var user = JSON.parse(localStorage.getItem('user'));
        
        if(user.id == data.adversaire){
            $rootScope.notif = false;
            $rootScope.notifs.push(data);
        }

    });


    socket.on('list_defi',function(data){
        console.log(data);
        $rootScope.defis = data ;
        
          });


    socket.on('notif_defi_sender',function(data){

        var user = JSON.parse(localStorage.getItem('user'));

        if(user.id == data.chalenger && data.action == 'refuse'){

            $scope.refus_defi = false ;

        }

    });

}]);