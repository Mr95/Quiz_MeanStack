MyApp.controller('profileController',['$scope','ProfileService', function($scope,profileService){

    console.log('controller called');
  
         //pour afficher le profil
         profileService.profil().then(function(response){
         
            console.log('profileService called') ;

            if (response.id !== 0){
       
                $scope.identifiant = response.identifiant;
                $scope.nom = response.nom ;
                $scope.prenom = response.prenom ;
                $scope.DN = response.date_naissance;
                $scope.statut = response.statut ;
                
                if(response.humeur == null){
    
                   $scope.humeur = "pas d'humeur" ; 
                
                }else{
                  $scope.humeur = response.humeur ;
                
                } 
    
             }else{
             
                console.log('error;;;;;;;;;;;;;;');
              
             }
    
           });

 
     
   //mettre a jour le profil
    $scope.updateProfile = function(){

         console.log("update profile clicked  humeur => " + $scope.humeur);
         profileService.updateProfile($scope.humeur).then(function(response){

            //console.log("humeur model " + " " + response);

         });

    }




    

}]);