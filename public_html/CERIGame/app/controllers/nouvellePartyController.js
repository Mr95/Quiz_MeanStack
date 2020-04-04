MyApp.controller('nouvellePartyController',['$scope','$routeParams','quizService','$interval','historiqueService',function($scope , $routeParams , quizService , $interval , historiqueService){

    console.log('nouvellePartyCalled');

   $scope.theme = $routeParams.theme ;
    $scope.level = $routeParams.level ;
    $scope.score1 = $routeParams.score ;
    $scope.score2 = 0 ;
    $scope.chalenger =  $routeParams.chalenger;
    $scope.adversaire = $routeParams.adversaire;

        //
        var obj = JSON.parse(localStorage.getItem('user'));
        
        //  $scope.chalenger = obj.id ;
          $scope.quiz_board = true ;
          $scope.question = "" ; 
         
          $scope.current_quiz = 0 ;
          $scope.tableau = false ;
          $scope.tableau_resultat = true ;
      
          $scope.Timer = null ;
         
          //propositions du quiz manipuler selon la difficulté choisi
          $scope.prop1 = true ;
          $scope.prop2 = true ;
          $scope.prop3 = true ;
          $scope.prop4 = true ;
      
          var totalSeconds = 0 ;
          // le timer a démarer ??
          var isStarted = false ;
          var nbcorrectAnswer = 0 ;
          $scope.score2 = 0 ;
          //pour afficher si la réponse est correct
          $scope.Repcorrect = true ;
          // pour afficher si la réponse est fausse    
          $scope.Repfausse = true ;
      
        
      
          //commencement du quiz
          $scope.commencer = function(){
      
             $scope.quiz_board = false ;
             $scope.termine = true ;
      
            
           quizService.getQuiz($scope.level , $scope.theme).then(function(response){
                //traitement niveau facile
             if($scope.level == 'facile'){
      
                  var arr = new Array(response.length) ;
      
                  $scope.prop1 = false ;
                  $scope.prop2 = false;
                  $scope.prop3 = true ;
                  $scope.prop4 = true ;
      
                    for(i = 0 ; i < response.length ; i++ ){
      
                      var rand = Math.floor(Math.random() * 4);
                        
                      for( j = 0 ; j < response[i].propositions.length ; j++){
                        
                          if(response[i].réponse !== response[i].propositions[rand] ){
      
                              arr[i] = { 'question' : response[i].question ,'propositions' : [ response[i].propositions[rand] , response[i].réponse] , 'reponse' : response[i].réponse }
                          
                          }else{
      
                            while(response[i].réponse == response[i].propositions[rand]){
      
                              rand = Math.floor(Math.random() * 4) ;
      
                            }
      
                            arr[i] = { 'question' : response[i].question ,'propositions' : [ response[i].propositions[rand] , response[i].réponse] , 'reponse' : response[i].réponse }
      
                          }
                      
                      }
      
                     } 
                   
                      $scope.quizz = arr ;
      
                      if(isStarted == false){
                          StartTimer() ;
                      }
                  //Traitement niveau intermediaire
                }else if($scope.level == 'intermediaire'){
      
                  var arr = new Array(response.length) ;
      
                  $scope.prop1 = false ;
                  $scope.prop2 = false ;
                  $scope.prop3 = false ;
                  $scope.prop4 = true ;
      
                  for(i = 0 ; i < response.length ; i++ ){ 
      
                    var props = new Array(3);
                    var j = 0 ;
                    var k = 0 ;   
      
                    while( j < response[i].propositions.length){
                        console.log('k = ' + k);
                        console.log('j = ' + j);
      
                       if( response[i].réponse == response[i].propositions[j]){
                          j = j + 1 ;
                        }
                        props[k] = response[i].propositions[j] ;
      
                        k = k + 1 ;
                        j = j + 1 ;
                     
                     }     
                    
                     props[2] = response[i].réponse ;
      
                     arr[i] = { 'question' : response[i].question ,'propositions' : props , 'reponse' : response[i].réponse }
                    
                    }
      
                    $scope.quizz = arr ;
      
                    if(isStarted == false){
                      StartTimer() ;
                  }
      
                  //Traitement niveau difficile
                }else if($scope.level == 'difficile'){
      
                  var arr = new Array(response.length);
      
                  $scope.prop1 = false ;
                  $scope.prop2 = false ;
                  $scope.prop3 = false ;
                  $scope.prop4 = false ;
      
                  for(i = 0 ; i < response.length ; i++ ){
                
                        arr[i] = { 'question' : response[i].question ,'propositions' : [ response[i].propositions[0] , 
                        response[i].propositions[1] , response[i].propositions[2] , response[i].propositions[3] ] , 'reponse' : response[i].réponse }
          
                   } 
                 
                    $scope.quizz = arr ; 
      
                    if(isStarted == false){
                      StartTimer() ;
                  }
      
                }
      
              }) ;
      
            }
      
      
          //incrementation et verification
          $scope.next_quiz = function(){
      
              $scope.current_quiz ++ ;
              
              if($scope.current_quiz >= 5){
                StopTimer();
                $scope.tableau = true ;
                $scope.tableau_resultat = false ;
                $scope.nbcorrectAnswer = nbcorrectAnswer ;
             
                if($scope.level == 'facile'){
                
                  if(totalSeconds <= 20){
                    $scope.score2 = nbcorrectAnswer * 20 ;

                    if($scope.score1 > $scope.score2){
                        historiqueService.saveHistorique_defi(JSON.stringify(new Date()) , $scope.chalenger , $scope.adversaire );
                    }else if($scope.score2 > $scope.score1){
                        historiqueService.saveHistorique_defi(JSON.stringify(new Date()) , $scope.adversaire ,$scope.chalenger );
                    }
 
                  }else{
                    $scope.score2 = nbcorrectAnswer * 10 ;
                    
                    if($scope.score1 > $scope.score2){
                        historiqueService.saveHistorique_defi(JSON.stringify(new Date()) , $scope.chalenger , $scope.adversaire );
                    }else if($scope.score2 > $scope.score1){
                        historiqueService.saveHistorique_defi(JSON.stringify(new Date()) , $scope.adversaire ,$scope.chalenger );
                    }
                  }
      
      
      
                }else if($scope.level == 'intermediaire'){
      
                  if(totalSeconds <= 15){
                      $scope.score2 = nbcorrectAnswer * 20 ;
                      if($scope.score1 > $scope.score2){
                        historiqueService.saveHistorique_defi(JSON.stringify(new Date()) , $scope.chalenger , $scope.adversaire );
                    }else if($scope.score2 > $scope1){
                        historiqueService.saveHistorique_defi(JSON.stringify(new Date()) , $scope.adversaire ,$scope.chalenger );
                    }

                  }else{
                      $scope.score2 = nbcorrectAnswer * 10 ;
                      
                      
                      if($scope.score1 > $scope.score2){
                        historiqueService.saveHistorique_defi(JSON.stringify(new Date()) , $scope.chalenger , $scope.adversaire );
                        }else if($scope.score2 > $scope1){
                        historiqueService.saveHistorique_defi(JSON.stringify(new Date()) , $scope.adversaire ,$scope.chalenger );
                        }


                  }
      
                }else if($scope.level == 'difficile'){
      
                  if(totalSeconds <= 10){
                    $scope.score2 = nbcorrectAnswer * 20 ;
                    
                    if($scope.score1 > $scope.score2){
                        historiqueService.saveHistorique_defi(JSON.stringify(new Date()) , $scope.chalenger , $scope.adversaire );
                    }else if($scope.score2 > $scope1){
                        historiqueService.saveHistorique_defi(JSON.stringify(new Date()) , $scope.adversaire ,$scope.chalenger );
                    }

                    
                  }else{
                    $scope.score2 = nbcorrectAnswer * 10 ;
                   
                    if($scope.score1 > $scope.score2){
                        historiqueService.saveHistorique_defi(JSON.stringify(new Date()) , $scope.chalenger , $scope.adversaire );
                    }else if($scope.score2 > $scope1){
                        historiqueService.saveHistorique_defi(JSON.stringify(new Date()) , $scope.adversaire ,$scope.chalenger );
                    }

                    
                  }
      
                }
      
          
              }
              
            
           }
      
            //verification de la réponse et incrémentation du nombre des réponses correctes
            $scope.getAnswer = function(){
      
              console.log($scope.prop);
              console.log($scope.quizz[$scope.current_quiz].reponse);
      
              if ($scope.quizz[$scope.current_quiz].reponse ===  $scope.prop ){
      
                $scope.Repfausse = true ;
                $scope.Repcorrect = false ;
                nbcorrectAnswer++ ;
               
              }else{
                $scope.Repfausse = false ;
                $scope.Repcorrect = true ;
      
              }
           
            }
      
            
            //lancement du timer
           function StartTimer() {
              isStarted = true ;
              chronoMin = 0;
              chronoSec =0;
              $scope.chronoMin = 0;
              $scope.chronoMinn = "0"+0;
              $scope.chronoSec = 0;  
              $scope.chronoSecc = "0"+0;
      
                //Initialize the Timer to run every 1000 milliseconds i.e. one second.
                $scope.Timer = $interval(function () {
                      
                if ($scope.chronoSec === 59) {
                 
                    $scope.chronoSec = 0;
                    $scope.chronoMin += 1;
                }
                 
                else $scope.chronoSec += 1; totalSeconds++;
                  console.log(totalSeconds);
                if ($scope.chronoSec < 10){
                    $scope.chronoSecc = "0"+$scope.chronoSec;
                }else{
                    $scope.chronoSecc  = $scope.chronoSec;
                }
                if ($scope.chronoMin < 10){
                    $scope.chronoMinn = "0"+$scope.chronoMin;
                }else{
                    $scope.chronoMinn = $scope.chronoMin;
                }
                
                }, 1000);
            };
      
          
        //   Arret du timer 
          function StopTimer () {
      
              isStarted = false ;
             
                if (angular.isDefined($scope.Timer)) {
                    $interval.cancel($scope.Timer);
                }
            };
      
      




}]);