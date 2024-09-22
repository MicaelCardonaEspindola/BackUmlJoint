import { pool } from "../../config/databaseConnection.js";


async function getIngresoPorVentas() {
    const client = await pool.connect();
    try {
      const res = await pool.query("SELECT public.ingreso_por_ventas()");
      client.release();
      return res.rows;
    } catch (error) {
      client.release();
      return error;
    }
  }

async function getVentasDeLaSemana(){ 
    const client = await pool.connect() ; 
    try {
        const res = await pool.query("SELECT * from obtenercantidaddeventassemanales() "); 
        client.release(); 
        return res.rows; 

    } catch (error) {
        client.release() ; 
        return error ; 
    }
}

async function getCantidadProductosSalida(){ 
  const client = await pool.connect() ; 
  try {
      const res = await pool.query("SELECT sum(total_pedido) from obtenercantidaddeproductosdesalidasemanales()"); 
      client.release(); 
      return res.rows; 

  } catch (error) {
      client.release() ; 
      return error ; 
  }
}


async function cantidadProductosSalidaSemanal(){ 
  const client = await pool.connect() ; 
  try {
      const res = await pool.query("SELECT * from obtenercantidaddeproductosdesalidasemanales()"); 
      client.release(); 
      return res.rows; 

  } catch (error) {
      client.release() ; 
      return error ; 
  }
}



export const reportsModel = {
    getIngresoPorVentas,
    getVentasDeLaSemana,
    getCantidadProductosSalida,
    cantidadProductosSalidaSemanal
}