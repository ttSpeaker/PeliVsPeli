var conDb = require("./conexionDb.js");
function existeCompetencia(id) {}
function obtenerCompetencias(req, res) {
  var sqlQuery = "select id, nombre from competicion";
  conDb.query(sqlQuery, function(error, resp) {
    res.send(resp);
  });
}
function competenciaQuery(data) {
  console.log(data);
  var sql =
    "SELECT * FROM pelicula JOIN actor_pelicula ON pelicula.id = actor_pelicula.pelicula_id JOIN actor on actor_pelicula.actor_id = actor.id";
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
    sql = sql.concat(" director LIKE '%" + data.director+"'%");
    paramsCount = true;
  }
  sql = sql.concat(" ORDER BY rand() LIMIT 2;");
  return sql;
}
function obtenerOpciones(id, res) {
  var sqlCompetencia = "select * from competicion where id =" + id + ";";
  conDb.query(sqlCompetencia, function(error, respCompetencia) {
    if (respCompetencia.length>0) {
        console.log(respCompetencia);
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

module.exports = {
  obtenerCompetencias: obtenerCompetencias,
  obtenerOpciones: obtenerOpciones
};
