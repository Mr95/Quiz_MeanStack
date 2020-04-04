const express = require('express');
const pgClient  = require('pg') ;
const crypto = require('crypto');
var bodyParser = require('body-parser') ;

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session); 
const mongoClient = require('mongodb').MongoClient ;
const mongoObjectId = require ('mongodb').ObjectId ;
const app = express() ;

const url= 'mongodb://127.0.0.1:27017/db';

var server = app.listen(3308 , function(){
	console.log('listening on 3308') ;
  }) ;


app.use(express.static('/home/nas02a/etudiants/inf/myuapv/public_html'));

// create application/json parser
app.use(bodyParser.json());
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({extended : true})) ;

app.use(session({
               secret:'XX11',
               saveUninitialized: false,
               resave: false,
               store: new MongoDBStore({
               uri: url,
               collection:'mysession3308',
               touchAfter: 24 * 3600
              }), 
            cookie: {maxAge: 24 * 3600 * 1000}
       }));


/*************************************************** Sockets **********************************************/
//tabeau cntenant les utilisateurs connectés
var connectedPlayers = []; 

socketss = [] ;
//tableau contenant les defis
var list_defi = [];
var nb_connected = 0 ;

/**
 * gestion partie sockets 
 * 
 */

var io = require('socket.io').listen(server);

io.sockets.on('connection',function(socket){

 // socketss.push(socket);
 
  socket.on('disconnect',function(){
    socketss.splice(socketss.indexOf(socket),1);
  //  console.log('disconnected n° ' , socketss.length);
  });

  //Ajout d'un nouveau utilisateur connecté
  socket.on('newConnection',function(data){
    
    var boo = true ;

     if(connectedPlayers[0] == null){
    
         socketss.push(socket);  
         connectedPlayers.push(data);
         io.sockets.emit('user_connected', connectedPlayers); 
     }else{
     
      for(i = 0 ; i < connectedPlayers.length  ; i++){
          if(connectedPlayers[i].id == data.id){
            boo = false ;
            break;
          }
        }     

        if(boo == true){
          connectedPlayers.push(data);
          socketss.push(socket);
          io.sockets.emit('user_connected', connectedPlayers);
          io.emit('test',data.id);
         }

     }

  });

  //lorsqu'un utlisateur se déconnecte
  socket.on('leave',function(user){

    var obj = JSON.parse(user);
  
    for(i = 0 ; i < connectedPlayers.length  ; i++){
      if(obj.id == connectedPlayers[i].id){
        connectedPlayers.splice(i,1);
        io.emit('khroj',obj.id);
      }
    }
    //envoyer la nouvelle liste lorsqu'un client est déconnecté
    io.emit('user_connected',connectedPlayers);
   });
 
   //Ajout d'un défi et emmision de la liste des defi qui sera ensuite traité coté client selon l'adversaire
  socket.on('defi',function(data){
     console.log(data);
    list_defi.push(data);
    io.emit('notification',data);
    io.sockets.emit('list_defi', list_defi); 
  });

  //lorsqu'un défi est refusé on le supprime de la liste des défi
  socket.on('refused',function(data){
    console.log('refusé');
    //var d = JSON.parse(data);
    console.log('id = ' + data.id);
    console.log('chalenger = ' + data.chalenger );
    console.log('action = ' + data.action );
    
    list_defi.splice(data.id,1);
    io.sockets.emit('list_defi', list_defi); 
    //notifié celui qui a envoyé le défi que son défi est refusé
    io.sockets.emit('notif_defi_sender', data);

  });


});


/********************************************************************************************************/

//URL's
app.get('/',(req,res )=> res.sendFile('/home/nas02a/etudiants/inf/myuapv/public_html/CERIGame/index.htm')) ;

/** 
 * route pour faire le logout d'un utilsateur 
 * est modifié le statut de l'utilisateur de connecté 1 vers déconnecté 0
 */
app.get('/logout' ,(req,res)=>{
  
  //console.log(req.session.user_id);
  const svalue = req.session.user_id ;

    if(svalue !== null ){

      	//configuration de connexion a la BD postgress
        var pool = new pgClient.Pool({user: 'myidentif', host: '127.0.0.1', database: 'etd', password: 'mypassword', port: '5432' }); 

	      //connexion
        pool.connect(function(err, client, done) {

            if(err) {console.log('Error connecting to pg server' + err.stack);}  
          
                  client.query('update fredouil.users set statut = 0 where id=$1',[svalue],()=>{

                    if(err){
                      console.log('ereur d execution');
                     }
                  });
    }) ;

}

 req.session.destroy();
  
});

/**
 * 
 * route pour le login d'un utilisateur selon son nom et mot de passe crypté en utilisant la fonction createHash du Module crypto 
 * 
 *  */ 
app.get('/login', (req,res) => {

	 const nom = req.query.nom ;
	 const pwd = req.query.password ;
        const  hashed_pwd = crypto.createHash('sha1').update(pwd).digest('hex')  ;

	 if(!nom || ! pwd)
		return res.status(400).send('Nom ou mot de passe non saisi');


	//configuration de connexion a la BD postgress
        var pool = new pgClient.Pool({user: 'myidentif', host: '127.0.0.1', database: 'etd', password: 'mypassword', port: '5432' }); 

	//connexion
        pool.connect(function(err, client, done) {

            if(err) {console.log('Errorconnecting to pg server' + err.stack);}  
            else{
               // console.log('Connection established with pgdb server'); 
            }

          const resultat =  client.query("select * from fredouil.users where identifiant = $1 and motpasse = $2 ;" ,[nom,hashed_pwd] ,(err,result) =>{

            if(err){

                console.log('ereur d execution');

            }

	    if(result.rows.length == 0){
               
        var responseObject = {'id' : 0} ;
        res.status(200).send(responseObject) ;
       
           


		}else{
                  req.session.isConnected = true ;
                  req.session.user_id = result.rows[0].id ;
                  req.session.users_id2 = result.rows[0].id_users ;
                  req.session.identifiant = result.rows[0].identifiant ; 
                  req.session.nom = result.rows[0].nom ; 
                  req.session.prenom = result.rows[0].prenom ;
                  req.session.date_de_naissance = result.rows[0].date_de_naissance ;
                  req.session.statut = result.rows[0].statut ;
                  req.session.humeur = result.rows[0].humeur ;
                  
                  var responseObject = {'id' : result.rows[0].id  ,'identifiant': result.rows[0].identifiant , 'nom' : result.rows[0].nom , 'prenom' : result.rows[0].prenom } ;

                  client.query('update fredouil.users set statut= 1 where id=$1',[result.rows[0].id],()=>{

                    if(err){

                      console.log('ereur d execution');
      
                     }
 
                     res.status(200).send(responseObject);
                   
                  });
            } 
      });
    }) ;

}) ;

/*
*  recupération du profil en utilisant son identifiant stocké dans la session 
*/  
app.get('/profile', (req,res)=>{


  if(req.session.user_id == null) {
   
   console.log('not connected');

  }else{

  var id = req.session.user_id ;

  //configuration de connexion a la BD postgress
  var pool = new pgClient.Pool({user: 'myidentif', host: '127.0.0.1', database: 'etd', password: 'mypassword', port: '5432' }); 

  //connexion
  pool.connect(function(err, client, done) {

      if(err) {console.log('Error connecting to pg server' + err.stack);}  
    
            client.query('select * from fredouil.users where id = $1 ;',[req.session.user_id],(err,result) =>{
             
              if(err){

                console.log('ereur d execution');

               }

             var profile = {'identifiant' : result.rows[0].identifiant , 'nom' : result.rows[0].nom ,'prenom' : result.rows[0].prenom , 'date_naissance': result.rows[0].date_de_naissance ,'statut': result.rows[0].statut , 'humeur': result.rows[0].humeur } ;
             res.send(profile);
          }) ;        

  }) ;
    
  }
  
});

//mettre a jour du profile  en passant l'humeur   
app.post('/updateProfile', (req,res)=>{ 

  var humeur = req.body.humeur ;

  console.log('humeur ' + req.body.humeur);

  if(!req.session.isConnected || req.body.humeur == null) {

    console.log("pas de statut ou vous n'etes non connecté ") ;

  }else{

    var id_user = req.session.id ;

    console.log('humeur is :  ' +req.body.humeur);

    //Connection a la base de données et récupération des données 
    var pool = new pgClient.Pool({user: 'myidentif', host: '127.0.0.1', database: 'etd', password: 'mypassword', port: '5432' }); 

    pool.connect(function(err, client, done) {

        if(err) {console.log('Errorconnecting to pg server' + err.stack);}  
        else{ console.log('Connection established with pgdb server '); }
       
        const resultat =  client.query("update fredouil.users set humeur = $1 where id = $2  ;" ,[req.body.humeur,req.session.user_id] ,(err,result) =>{

          if(err){
            console.log('ereur d execution');
           }
  
        if(!result){

            res.status(200).send(false) ;

          }else{

            res.status(200).send(true) ;

          }

      });

   });
  
  }

});

//Mongo DB

/*récupération des themes pour définir context du jeu pour cela en utilisant la
 fonction distinct(MapReduce) pour récuperer les themes sans répétition afin de pouvoir les afficher sur la liste déroulante du jeu quiz
*/
app.get('/getThemes', (req, res)=>{

  mongoClient.connect(url, { useUnifiedTopology: true } ,(err, db) => {

    if(err){
        throw err ;
    }

    var dbo = db.db("db");

    dbo.collection('quizz').distinct('thème', (err,result)=>{

      if (err) throw err;
      res.status(200).send(result);
      db.close();

    });

  });

}) ;

/*
 * récupération des questions par theme
 *
 */
app.post('/getQuizthemeQues' , (req,res)=>{

  
  if(!req.session.isConnected){

    console.log('not connected...') ;

  }else{

   if(req.body.theme == null || req.body.level == null) console.log("niveau ou theme non spécifié") ;

    mongoClient.connect(url, { useUnifiedTopology: true } ,(err, db) => {

      if(err){
          throw err ;
      }

      console.log('connected...!') ;
      var dbo = db.db("db");

      dbo.collection('quizz').find({'thème':req.body.theme}).toArray((err,result)=>{
    
     if (err) throw err;

            const a = Math.floor(Math.random() * 26) ;
            var tableau = [ result[0].quizz[a] , result[0].quizz[a+1] , 
            result[0].quizz[a+2] , result[0].quizz[a+3] , result[0].quizz[a+4]];
          
           
            res.status(200).send(tableau);
        
        db.close();

      });
     
    });

  }

}) ;

// Ajout de l'historique  lorsqu'une partie du quiz se termine 
app.post('/saveHistorique' , (req, res)=>{

  //configuration de connexion a la BD postgress
  var pool = new pgClient.Pool({user: 'myidentif', host: '127.0.0.1', database: 'etd', password: 'mypassword', port: '5432' }); 

  //connexion
  pool.connect(function(err, client, done) {

      if(err) {console.log('Error connecting to pg server' + err.stack);}  
    
            client.query('insert into fredouil.historique(id_users,date,nbreponse,temps,score) values($1,$2,$3,$4,$5);',[req.session.user_id,req.body.date,
             req.body.nbreponse , req.body.temps , req.body.score],(err,result) =>{
             // console.log(req.session.user_id+ ' '+req.body.date);
             // console.log(req.body.nbreponse +' '+ req.body.temps + ' ' + req.body.score);
              if(err){

                console.log('ereur d execution');

               }

               if(result){
                  console.log('historique inserted');
               }else{
                  console.log('historique not inserted');
               }
            
      });

  }) ;


});

//récupération de l'historique d'un joueur en utilisant son identifiant stocké dans la session
app.get('/getHistorique' , (req, res)=>{

var id = req.session.user_id ;

console.log(id);

  //configuration de connexion a la BD postgress
  var pool = new pgClient.Pool({user: 'myidentif', host: '127.0.0.1', database: 'etd', password: 'mypassword', port: '5432' }); 
  //connexion
  pool.connect(function(err, client, done) {

      if(err) {console.log('Error connecting to pg server' + err.stack);}  
    
            client.query('select * from fredouil.historique where id_users = $1 ;',[id],(err,result) =>{
             
              if(err){

                console.log('ereur d execution');

               }

               if(result.rows.length > 0){
               
                res.send(result.rows);
               
                }else{
               
                  res.send(false);
               
                }
            
          }) ;

}) ;


});

/**
 * Récupération des dix meilleures score pour cela on utilise limit  10 desc dans la requete SQL
 */
app.get('/getTopTen' , (req,res) => {

  //configuration de connexion a la BD postgress
  var pool = new pgClient.Pool({user: 'myidentif', host: '127.0.0.1', database: 'etd', password: 'mypassword', port: '5432' }); 
  //connexion
  pool.connect(function(err, client, done) {

      if(err) {console.log('Error connecting to pg server' + err.stack);}  
    
            client.query('select * from fredouil.historique order by score DESC limit 10;',(err,result) =>{
             
              if(err){

                console.log('ereur d execution');

               }

               if(result.rows.length > 0){
               
                res.send(result.rows);
               
                }else{
               
                  res.send(false);
               
                }
            
          }) ;

}) ;



});

/**
 * recupération des utilisateurs pour qu'un joueurs puisse choisir son adversaire
 */
app.get('/getUsers', (req,res)=>{

  var pool = new pgClient.Pool({user: 'myidentif', host: '127.0.0.1', database: 'etd', password: 'mypassword', port: '5432' }); 

  //connexion
  pool.connect(function(err, client, done) {

      if(err) {console.log('Error connecting to pg server' + err.stack);}  
    
            client.query('select * from fredouil.users;',(err,result) =>{
             
              if(err){

                console.log('ereur d execution');

               }

               if(result.rows.length > 0){
               
                res.send(result.rows);
               
                }else{
               
                  res.send(false);
               
                }
            
          }) ;

}) ;


});


//route pour l'insertion d'un resultat d'un defi
app.post('/saveHistorique_defi' , (req, res)=>{


  console.log('gagnant '+req.body.id_gagnant );
  console.log('perdant' + req.body.id_perdant);
  console.log('date ' + req.body.date);

  //configuration de connexion a la BD postgress
  var pool = new pgClient.Pool({user: 'myidentif', host: '127.0.0.1', database: 'etd', password: 'mypassword', port: '5432' }); 
  
  //connexion
  pool.connect(function(err, client, done) {

      if(err) {console.log('Error connecting to pg server' + err.stack);}  
      
            client.query('insert into fredouil.hist_defi(id_users_gagnant,id_users_perdant,date) values($1,$2,$3);',[
             req.body.id_gagnant , req.body.id_perdant , req.body.date],(err,result) =>{
           
             
              if(err){

                console.log('ereur d execution');

               }

               if(result){
                  console.log('historique defi inserted');
               }else{
                  console.log('historique defi not inserted');
               }
            
      });

  }) ;


});