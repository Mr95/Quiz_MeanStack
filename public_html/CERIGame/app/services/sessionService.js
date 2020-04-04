MyApp.service('sessionService',['$log',function($log){

    this._user = JSON.parse(localStorage.getItem('user'));


    this.getUser = function(){

        return this._user ;

    };

    this.setUser = function(id , nom , prenom){

        this._user = {
            'id'  : id ,
            'nom' :  nom ,
            'prenom' : prenom
        } ;

        localStorage.setItem('user', JSON.stringify(this._user));
        return this ;      
    }

    this.removeUser = function(){
        
        console.log('remove user called');
        
        localStorage.clear();
       // return this ;

    }

}]);