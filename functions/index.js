const functions = require('firebase-functions');
const admin = require('firebase-admin'); //Todo el SDK de Firebase => Acceso a Realtime Database
const express = require('express');
const app = express();

var serviceAccount = require("../key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://psicotest-online.firebaseio.com"
});

const database = admin.database();

///========================= Variables globales ===================///
const dbPeople = "usuario"; //Referencia al nodo en donde se van a guardar las personas
const dbSkills= "skills"
///========================= Métodos internos ===================///
function createPerson(person){
  database.ref(dbPeople).push(person);  
}

function retrievePerson(id){
  return database.ref(dbPeople).child(id).once('value');
}

function updatePerson(id, person){
  database.ref(dbPeople).child(id).set(person);
}

function deletePerson(id){
  database.ref(dbPeople).child(id).remove();
}

function listPersons(){
  return database.ref(dbPeople).once('value');
}

function createSkills(id,skill){
  database.ref(dbPeople).child(id).child(dbSkills).push(skill);  
}

function retrieveSkills(id,idskill){
  return database.ref(dbPeople).child(id).child(dbSkills).child(idskill).once('value');  
}

function updateSkills(id,idskill, skill){
  database.ref(dbPeople).child(id).child(dbSkills).child(idskill).set(skill);  
}

function deleteSkills(id, idskill){
  database.ref(dbPeople).child(id).child(dbSkills).child(idskill).remove();
}

function listSkills(id){
  return database.ref(dbPeople).child(id).child(dbSkills).once('value');
}

///========================= Funciones URLs ===================///
app.post('/api/persons', function (req, res) {
  let varName = req.body['name'];
  let varAge = req.body['age'];
  var person = {
    name : varName,
    age : varAge  };
  createPerson(person);
  return res.status(201).json({ message: "Success person was added." });
});

app.get('/api/persons/:id', function(req, res){
  let varId = req.params.id;
  retrievePerson(varId).then(result => {
      return res.status(200).json(result); 
    }
  ).catch(err => console.log(err));
});

app.put('/api/persons/:id', function (req, res) {
  let varId = req.params.id;
  let varName = req.body['name'];
  let varAge = req.body['age'];
  var person = {
    name : varName,
    age : varAge  };
  updatePerson(varId, person);
  return res.status(200).json({ message: "Success person was updated." });
});

app.delete('/api/persons/:id',function(req, res){
  let varId = req.params.id;
  deletePerson(varId);
  return res.status(200).json({ message: "Success person was deleted." });
});

app.get('/api/persons', function(req, res){
  listPersons().then(result => {
      return res.status(200).json(result); 
    }
  ).catch(err => console.log(err));
});

app.get('/api/persons', function(req, res){
  let varId = req.query.id;
  retrievePerson(varId).then(result => {
      return res.status(200).json(result); 
    }
  ).catch(err => console.log(err));
});

app.get('/api/', function (req, res) {
  res.send('Bienvenid@s a Cloud Functions de Desarrollo Web Avanzado NRC 7828')
})

exports.app = functions.https.onRequest(app);

app.post('/api/persons/:id/skills', function (req, res) {
  var skill = {
    name : req.body['name'],
    hours : req.body['hours'],
    date : req.body['date'],
    endorsed : req.body['endorsed']
  };
  
createSkills(req.params.id, skill);
  return res.status(201).json({ message: "Success skill was added." });
});

app.get('/api/persons/:id/skills/:id2', function(req, res){
  let varId = req.params.id;
  let varId2=req.params.id2;
  retrieveSkills(varId,varId2).then(result => {
      return res.status(200).json(result); 
    }
  ).catch(err => console.log(err));
});

app.put('/api/persons/:id/skills/:id2', function (req, res) {
  let varId = req.params.id;
  let varId2=req.params.id2;
  var skill = {
    name : req.body['name'],
    hours : req.body['hours'],
    date : req.body['date'],
    endorsed : req.body['endorsed']
  };
  updateSkills(varId, varId2,skill);
  return res.status(200).json({ message: "Success person was updated." });
});

app.delete('/api/persons/:id/skills/:id2',function(req, res){
  let varId = req.params.id;
  let varId2=req.params.id2;
  deleteSkills(varId,varId2);
  return res.status(200).json({ message: "Success skill was deleted." });
});

app.get('/api/persons/:id/skills', function(req, res){
  let varId=req.params.id;
  listSkills(varId).then(result => {
      return res.status(200).json(result); 
    }
  ).catch(err => console.log(err));
});
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
