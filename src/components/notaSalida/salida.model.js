import { pool } from "../../config/databaseConnection.js";

async function getDatosSalida() {
  const client = await pool.connect();
  try {
    const res = await pool.query("SELECT * FROM obtener_datos_Salida()");
    client.release();
    return res.rows;
  } catch (error) {
    client.release();
    return error;
  }
}

async function getDetalleSalida(idSalida) {
  const client = await pool.connect();
  try {
    const res = await pool.query("SELECT * FROM obtenerDetallesDelaNotaDeSalida($1)", [
      idSalida,
    ]);
    client.release();
    return res.rows;
  } catch (error) {
    client.release();
    return error;
  }
}

async function createSalida(salidasBody) {
  const {id_salida,descripcion_nota,total_salida,ci_usuario,cantidad_detalleSalida,arreglo_de_detalles_de_salidas}=salidasBody;
  const client = await pool.connect();
  try {
    const res = await pool.query(
      "SELECT * FROM crearsalidaydetalle($1,$2,$3,$4,$5,$6)",[ id_salida,descripcion_nota,total_salida,ci_usuario,cantidad_detalleSalida,JSON.stringify(arreglo_de_detalles_de_salidas)]
    );
    client.release();
    return res;
  } catch (error) {
    client.release();
    return error;
  }
}

async function updateSalida(idSalida,salidasBody) {
  const {descripcion,total, fecha}=salidasBody;
  const client = await pool.connect();
  try {
    const res = pool.query(
      "UPDATE notaDeSalida SET descripcion = $1, total=$2, fecha=$3 where id = $4",
      [descripcion,total,fecha,idSalida]
    );
    client.release();
    return res;
  } catch (error) {
    client.release();
    return error;
  }
}



async function deleteSalida(idSalida) {
  const client = await pool.connect();
  try {
    const res = pool.query("DELETE FROM notaDeSalida WHERE id = $1", [idSalida]);
    client.release();
    return res;
  } catch (error) {
    client.release();
    return error;
  }
}

export const pedidoModels = {
  getDatosSalida,
  getDetalleSalida,
  updateSalida,
  createSalida,
  deleteSalida,
  //changeSalida,
};
