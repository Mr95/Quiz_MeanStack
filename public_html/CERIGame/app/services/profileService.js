MyApp.service('ProfileService',['$http', function($http){
    console.log("im in profile Service");
   
   
    this.profil = function(){
          //var data = JSON.stringify({"nom" : nom , "password":password});
          return $http({
                method:'GET',
                url:'/profile',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
                .then(function(response){
                     
           // console.log(response.data);

               return (response.data);
           

      });
          }

        this.updateProfile = function(humeurp){

           console.log("update profile service called" +" "+ humeurp);
         var data = {humeur : humeurp} ;
          return $http({  
               method: 'POST',
               url:'/updateProfile',
               data: data ,
               headers: {'Content-Type': 'application/json'} })
               .then(function success(response){

                  console.log(response.data);       

                  return response.data ;
          
            },function fail(response){
             
            });


         



          
        }  


}]);