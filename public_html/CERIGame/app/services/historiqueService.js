MyApp.service('historiqueService',['$http', function($http){

    console.log('historique service called');

    // Enregistrement historique Service
    this.saveHistorique = function( date , nbreponse , temps , score ){

      var data = {date : date , nbreponse : nbreponse , temps : temps , score : score} ;
       return $http({  
            method: 'POST',
            url:'/saveHistorique',
            data: data ,
            headers: {'Content-Type': 'application/json'} })
            .then(function success(response){

               console.log(response.data);       

               return response.data ;
       
         },function fail(response){
          
         });

     }  


     this.getHistorique = function(){
       console.log('historique called');
      return $http({
        method:'GET',
        url:'/getHistorique',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
        .then(function(response){
             
           return (response.data);
   
        });
    
     }


     
     this.getTopTen = function(){

      console.log('Top Ten called');
      return $http({
        method:'GET',
        url:'/getTopTen',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
        .then(function(response){
             
           return (response.data);
   
        });


     }




     this.saveHistorique_defi = function( date , id_gagnant , id_perdant ){

      var data = { date : date , id_gagnant : id_gagnant , id_perdant : id_perdant } ;
       return $http({  
            method: 'POST',
            url:'/saveHistorique_defi',
            data: data ,
            headers: {'Content-Type': 'application/json'} })
            .then(function success(response){

               console.log(response.data);       

               return response.data ;
       
         },function fail(response){
          
         });

     }  







}]);