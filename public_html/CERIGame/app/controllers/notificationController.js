MyApp.controller('notificationController',['$scope','$rootScope',function($scope,$rootScope){
console.log('notif called ..');
//$scope.notifications = $rootScope.notifs ;

//$scope.notifs = $rootScope.defis ;
var defi = [];
var user = JSON.parse(localStorage.getItem('user'));


filtrerDefis();


$scope.refuseChallenge = function(id , chalenger){

  console.log(id);
  console.log(chalenger);
  var obj = { 'id' : id , 'chalenger' : chalenger , action : 'refuse' } ;
  socket.emit('refused' , { 'id' : id , 'chalenger' : chalenger , action : 'refuse' });

}


socket.on('list_defi', function(data){


  //console.log('new liste : '+data[0].theme);
if(data[0] == null){

  $scope.notifs = data ;

}else if(data[0] != null){
 
  for(i = 0 ; i <  data.length ; i++){
    console.log('i =  ' + i );
    if( data[i].adversaire == user.id){

      var d = {id_defi : i , theme : $rootScope.defis[i].theme , level : $rootScope.defis[i].level ,
      score : $rootScope.defis[i].score, chalenger : $rootScope.defis[i].chalenger ,
      adversaire: $rootScope.defis[i].adversaire };

        //defi.push($rootScope.defis[i]);
        defi.push(d);
    }

  }

  $scope.notifs = defi ;
}
});






function filtrerDefis(){

  
  for(i = 0 ; i <  $rootScope.defis.length ; i++){
    
    if( $rootScope.defis[i].adversaire == user.id){

      var d = {id_defi : i , theme : $rootScope.defis[i].theme , level : $rootScope.defis[i].level ,
      score : $rootScope.defis[i].score, chalenger : $rootScope.defis[i].chalenger ,
      adversaire: $rootScope.defis[i].adversaire };

        //defi.push($rootScope.defis[i]);
        defi.push(d);
    }

 }
 
  $scope.notifs = defi ;

}

 console.log(defi);





}]);