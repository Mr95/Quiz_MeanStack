MyApp.service('Authenticate',['sessionService','$http', function(sessionService,$http){
     
     // console.log("im here");
      
      this.login = function(nom,password){
            //var data = JSON.stringify({"nom" : nom , "password":password});
          
            return $http({
                  method:'GET',
                  url:'/login?nom='+nom+'&password='+password+'',
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
                  .then(function(response){
                       
              console.log(response.data);

             if(response.data.id !== 0/*true*/){
              
               localStorage.setItem("last_connexion",new Date()) ;
            
               sessionService.setUser(response.data.id , response.data.nom , response.data.prenom);
          
            }

             return (response.data);

		});
      }

            this.isLoggedin = function(){
                  
                  console.log("isLoggedin called..");
                  return sessionService.getUser() != null ;
               
            }

            
            this.logout = function(){
                  console.log('logout called');

                  sessionService.removeUser();

                  return $http({
                        method:'GET',
                        url:'/logout',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
                        .then(function(response){
                        
                              });
                    }


  }]);