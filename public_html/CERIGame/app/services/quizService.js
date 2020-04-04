MyApp.service('quizService',['$http', function($http){


    this.getThemes = function(){
        return $http({
              method:'GET',
              url:'/getThemes',
              headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
              .then(function(response){
                   
         // console.log(response.data);

             return (response.data);

    });
        }


        this.getQuiz = function(level , theme){

            var data = {level : level , theme : theme} ;
           
             return $http({  
                  method: 'POST',
                  url:'/getQuizthemeQues',
                  data: data ,
                  headers: {'Content-Type': 'application/json'} })
                  .then(function success(response){
   
                     console.log(response.data);       
   
                     return response.data ;
             
               },function fail(response){
                
               });



        }



}]);