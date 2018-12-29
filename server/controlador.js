var conDb = require("./conexionDb.js");
function obtenerCompetencias(req, res) {
  var sqlQuery = "select id, nombre from competicion";
  conDb.query(sqlQuery, function(error, resp) {
    res.send(resp);
  });
}
function competenciaQuery(data) {
  var sql =
    "SELECT pelicula.id, pelicula.titulo, pelicula.poster FROM pelicula JOIN actor_pelicula ON pelicula.id = actor_pelicula.pelicula_id JOIN actor on actor_pelicula.actor_id = actor.id";
  var paramsCount = false;
  if (data.genero_id) {
    sql = sql.concat(" WHERE genero_id =" + data.genero_id);
    paramsCount = true;
  }
  if (data.actor_id) {
    if (paramsCount) {
      sql = sql.concat(" AND");
    } else {
      sql = sql.concat(" WHERE");
    }
    sql = sql.concat(" actor_id =" + data.actor_id);
    paramsCount = true;
  }
  if (data.director) {
    if (paramsCount) {
      sql = sql.concat(" AND");
    } else {
      sql = sql.concat(" WHERE");
    }
    sql = sql.concat(" director LIKE '%" + data.director + "%'");
    paramsCount = true;
  }
  sql = sql.concat(" ORDER BY rand() LIMIT 2;");
  return sql;
}
function obtenerOpciones(id, res) {
  var sqlCompetencia = "select * from competicion where id =" + id + ";";
  conDb.query(sqlCompetencia, function(error, respCompetencia) {
    if (respCompetencia.length > 0) {
      var sqlOpciones = competenciaQuery(respCompetencia[0]);
      conDb.query(sqlOpciones, function(error, respPeli) {
        var opciones = {
          competencia: respCompetencia[0].nombre,
          peliculas: respPeli
        };
        res.send(opciones);
      });
    } else {
      return res.status(404).json("No se encontro la competencia");
    }
  });
}
function votar(req, res) {
  var competenciaId = req.params.id;
  var peliculaId = req.body.idPelicula;
  var verifPeli = "SELECT * FROM pelicula where id =" + peliculaId + ";";
  conDb.query(verifPeli, function(error, resp) {
    if (resp) {
      var verifComp =
        "SELECT * FROM competicion where id =" + competenciaId + ";";
      conDb.query(verifComp, function(error, respuesta) {
        if (respuesta) {
          var verifVoto =
            "SELECT * FROM votos_pelicula where competencia_id=" +
            competenciaId +
            " AND pelicula_id=" +
            peliculaId +
            ";";
          conDb.query(verifVoto, function(error, respVerifVoto) {
            if (respVerifVoto.length > 0) {
              var sql =
                "UPDATE votos_pelicula SET cantidad = cantidad +1 where competencia_id=" +
                competenciaId +
                " AND pelicula_id=" +
                peliculaId +
                ";";
              conDb.query(sql, function(error, respuestaVoto) {
                res.status(200).json("Voto agregado");
              });
            } else {
              var sql =
                "INSERT INTO votos_pelicula (competencia_id, pelicula_id, cantidad) values(+" +
                competenciaId +
                ", " +
                peliculaId +
                ", 1);";
              conDb.query(sql, function(error, respuestaVoto) {
                res.status(200).json("Voto agregado");
              });
            }
          });
        } else {
          return res.status(404).json("Competencia no encontrada");
        }
      });
    } else {
      return res.status(404).json("Pelicula no encontrada");
    }
  });
}
function obtenerResultados(id, res) {
  sqlVerifComp = "SELECT * FROM competicion where id=" + id + ";";
  conDb.query(sqlVerifComp, function(error, resultComp) {
    if (error) {
      return res.status(500);
    } else if (resultComp) {
      sql =
        "SELECT p.id as pelicula_id, titulo, poster, cantidad as votos FROM votos_pelicula vot JOIN pelicula p ON vot.pelicula_id = p.id JOIN competicion c ON vot.competencia_id=c.id WHERE c.id=" +
        id +
        " order by cantidad DESC LIMIT 3;";
      conDb.query(sql, function(error, resp) {
        if (error) {
          return res.status(500);
        } else {
          var data = {
            competencia: resultComp[0].titulo,
            resultados: resp
          };
          res.send(data);
                }
      });
    } else {
      return res.status(404).json("Competencia no encontrada");
    }
  });
}
module.exports = {
  obtenerCompetencias: obtenerCompetencias,
  obtenerOpciones: obtenerOpciones,
  votar: votar,
  obtenerResultados: obtenerResultados
};
//SELECT titulo, cantidad FROM votos_pelicula vot JOIN pelicula p ON vot.pelicula_id = p.id order by cantidad DESC LIMIT 3;
