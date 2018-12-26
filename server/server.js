var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var controlador = require('./controlador.js');

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/competencias',controlador.obtenerCompetencias);
app.get('/competencias/:id/peliculas',function(req,res){
    var id = req.params.id;
    controlador.obtenerOpciones(id, res);
});


var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});