var MyApp = angular.module('MyApp',["ngRoute"]);

// routeProvider SPA
MyApp.config(['$routeProvider', '$locationProvider',function($routeProvider, $locationProvider){
 
    $routeProvider
          .when('/profile' , {
               
            title : 'profile' ,
            templateUrl : 'CERIGame/app/views/profile.htm' ,
            controller : 'profileController'
          
           }).when('/quiz' , {

            title : 'quiz' ,
            templateUrl : 'CERIGame/app/views/quiz.htm' ,
            controller : 'quizController'
           
           }).when('/historique' , {

              title : 'historique' ,
              templateUrl : 'CERIGame/app/views/historique.htm' ,
              controller : 'historiqueController'
             
           }).when('/notification' , {

            title : 'notification' ,
            templateUrl : 'CERIGame/app/views/notification.htm' ,
            controller : 'notificationController'
           
         }).when('/defi/:theme/:level/:score/:chalenger/:adversaire' , {
        
              title : 'defi' ,
              templateUrl : 'CERIGame/app/views/users.htm' ,
              controller : 'usersController'
             
           })
         .when('/defi/:theme/:level/:score/:chalenger' , {
     
            title : 'defi' ,
            templateUrl : 'CERIGame/app/views/users.htm' ,
            controller : 'usersController'

         }).when('/nouvelleParty/:id/:theme/:level/:score/:chalenger/:adversaire', {
            title: 'Nouvelle partie',
            templateUrl: 'CERIGame/app/views/nouvelleParty.htm',
            controller: 'nouvellePartyController',
            
        })
         .when('/logout' , {

            template : '' ,
            controller : 'logoutController',
            
           
         })/*.otherwise({
              redirectTo: '/logout'
           })*/ ;
      
         
}]);
