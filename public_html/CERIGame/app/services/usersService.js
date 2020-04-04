MyApp.service('usersService',['$http',function($http){


    this.getUsers = function(){
       
         return $http({
            method:'GET',
            url:'/getUsers',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
            .then(function(response){
                 
       // console.log(response.data);

           return (response.data);

          });


        
    };




}]);