const { Pool } = require("pg");
const pool = new Pool({
    user: "chris",
    host: "localhost",
    database: "elecciones",
    password: "chris1997",
    port: 5432,
});
// Paso 1
const insertar = async (datos) => {
const consulta = {
text: "INSERT INTO candidatos (nombre, foto, color, votos) values($1, $2, $3, 0) RETURNING *",
values: datos,
};
try {
const result = await pool.query(consulta);
return result.rows[0];
} catch (error) {
console.log(error.code);
return error;
}
};

// Paso 2
const consultar = async () => {
    try {
    const result = await pool.query("SELECT * FROM candidatos");
    return result.rows;
    } catch (error) {
    console.log(error.code);
    return error;
    }
    };    

// Paso 3
const eliminar = async (id) => {
    try {
    const result = await pool.query(
    `DELETE FROM candidatos WHERE id = '${id}'`
    );
    return result.rows;
    } catch (error) {
    console.log(error.code);
    return error;
    }
}
    
// Paso 4
const editar = async (datos) => {
    const consulta = {
    text: `UPDATE candidatos SET nombre = $1, foto = $2 WHERE id = $3 RETURNING *`,
    values: datos,
    };
    try {
    const result = await pool.query(consulta);
    return result.rows;
    } catch (error) {
    console.log(error);
    return error;
    }
    };

// Paso 5
const transccion = async (datos) => {
    // pool.connect(async (error_conexion, client, release) => {
    // if (error_conexion) return console.error(error_conexion.code);
    await pool.query("BEGIN");
    try {
    const actualizar ={
    text: "UPDATE candidatos SET votos = votos + $1 WHERE nombre = $2 RETURNING *",
    values: [datos[1],datos[2]],
    }
    const resultadocandidatos = await pool.query(actualizar);
    const insert ={
    text: "INSERT INTO historial (estado, votos, ganador) values ($1, $2, $3) RETURNING *;",
    values: datos,
    }
    const resultadohistorial = await pool.query(insert);
    await pool.query("COMMIT");
    return resultadohistorial.rows[0]
    }
    catch (e) {
        await pool.query("ROLLBACK");
        console.log("Error código: " + e.code);
        console.log("Detalle del error: " + e.detail);
        console.log("Tabla originaria del error: " + e.table);
        console.log("Restricción violada en el campo: " + e.constraint);
    }
}

// Paso 6
const consultarhistorial = async (datos) => {
    try {
    let array =[] 
    const result = await pool.query("SELECT * FROM historial");
    data = result.rows
    data.forEach((e) => {
        let info = [e.estado, e.votos, e.ganador]
        array.push(info)
      });
    return array;
    } catch (error) {
    console.log(error.code);
    return error;
    }
    };

module.exports = { insertar, consultar, editar, eliminar, transccion, consultarhistorial};