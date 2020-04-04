MyApp.controller('usersController',['$scope','$routeParams','usersService','$timeout',function($scope,$routeParams,usersService,$timeout){

   $scope.on_users = [] ; 
   $scope.of_users = [];
   onli_users = [] ; 
   ofli_users = [];
   $scope.theme = $routeParams.theme ;
   $scope.level = $routeParams.level ;
   $scope.score = $routeParams.score ;
   $scope.chalenger =  $routeParams.chalenger;
   $scope.adversaire = $routeParams.adversaire;
   $scope.alert = true ;
   
   usersService.getUsers().then(function(response){
            for(i = 0 ; i < response.length ; i++){
                if(response[i].statut == 1){
                    onli_users.push(response[i]);
                }
            }
            
            for(i = 0 ; i < response.length ; i++){
                if(response[i].statut == 0){
                    ofli_users.push(response[i]);
                }
            }
            $scope.of_users = ofli_users;
            $scope.on_users = onli_users ;
    }); 


    send();

 

 function send(){

    if($routeParams.adversaire != null){

        var defi = { theme : $routeParams.theme, level : $routeParams.level, score : $routeParams.score 
            ,chalenger : $routeParams.chalenger  , adversaire : $routeParams.adversaire };
          
            socket.emit('defi',defi);
          
            $timeout( function(){
                $scope.alert = false ;
            },500 );
            $routeParams.adversaire = null ;
            $scope.alert = true ;
        }else if($routeParams.adversaire == null){
            $scope.alert = true ;
            console.log('adversaire not specified');
        }

    }







   console.log('users controller called');



}]);