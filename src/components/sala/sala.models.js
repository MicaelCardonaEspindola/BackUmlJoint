import { pool } from "../../config/databaseConnection.js";

// ... otras funciones para usuarios

// Funciones para salas

export const obtenerSalasModel = async () => {
    try {
        const client = await pool.connect();
        const response = await client.query("SELECT * FROM sala");
        client.release();
        return response.rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const obtenerLosUsuariosDeUnaSalaModel = async (id_sala) => {
    try {
        const client = await pool.connect();
        const response = await client.query(
            "select us.*,u.nombre,u.correo,u.telefono from usuario_sala as us join usuario as u on u.ci=us.ci_usuario WHERE  id_sala = $1",
            [ id_sala] 
        );
        client.release();
        return response.rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const obtenerLosUsuariosDeUnaSalaModelByCi = async (ci) => {
    try {
        const client = await pool.connect();
        const response = await client.query(
            "select us.*,u.nombre,u.correo,u.telefono from usuario_sala as us join usuario as u on u.ci=us.ci_usuario WHERE ci_usuario = $1 order by joined_at DESC",
            [ci] 
        );
        client.release();
        return response.rows[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getSalasByIdModel = async (id) => {
    try {
        const client = await pool.connect();
        const response = await client.query("SELECT * FROM sala WHERE id = $1", [id]);
        client.release();
        return response.rows[0];
    } catch (error) {

        console.error(error);
        throw error;
    }
};

export const crearSalaModel = async (nombre, capacidad, descripcion, es_privada,ci_host) => {
    try {
        const client = await pool.connect();
        const res = await client.query(
            "INSERT INTO sala (nombre, capacidad, descripcion, es_privada, ci_host) VALUES ($1, $2, $3, $4,$5) RETURNING *",
            [nombre, capacidad, descripcion, es_privada,ci_host]
        );
        client.release();
        return res.rows[0]; // Retorna la sala recién creada
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const actualizarSalaModel = async (id ,diagrama) => {
  try {
      const client = await pool.connect();
      const res = await client.query(
          "UPDATE sala SET diagrama=$2 WHERE id = $1",
          [id,diagrama]
      );
      client.release();
      return res;
  } catch (error) {
      console.error(error);
      throw error;
  }
};

export const actualizarSalaModel2 = async (id ,nombre,descripcion) => {
    try {
        const client = await pool.connect();
        const res = await client.query(
            "UPDATE sala SET nombre=$2, descripcion=$3 WHERE id = $1",
            [id,nombre,descripcion]
        );
        client.release();
        return res;
    } catch (error) {
        console.error(error);
        throw error;
    }
  };

export const eliminarSalaModel = async (id) => {
  try {
      const client = await pool.connect();
      await client.query("DELETE FROM sala WHERE id = $1", [id]);
      client.release();
  } catch (error) {
      console.error(error);
      throw error;
  }
};

// Funciones para la relación usuario-sala

/*export const agregarUsuarioASalaModel = async (ci_usuario, id_sala, isHost) => {
    try {
        const client = await pool.connect();
        await client.query(
            "INSERT INTO usuario_sala (ci_usuario, id_sala,isHost) VALUES ($1, $2,$3)",
            [ci_usuario, id_sala, isHost]
        );
        client.release();
    } catch (error) {
        console.error(error);
        throw error;
    }
};*/

export const isHostModel = async (ci_usuario, id_sala) => {
    try {
        const client = await pool.connect();
        const response = await client.query(
            "select exists(select ci_host from sala where ci_host=$1 and id=$2 ) as ishost ",
            [ci_usuario, id_sala]
        );
        client.release();
        return response.rows[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
}



export const eliminarUsuarioDeSalaModel = async (ci_usuario, id_sala) => {
  try {
      const client = await pool.connect();
      await client.query(
          "DELETE FROM usuario_sala where ci_usuario= $1 id_sala= $2",
          [ci_usuario, id_sala]
      );
      client.release();
  } catch (error) {
      console.error(error);
      throw error;
  }
};

// ... otras funciones para la relación usuario-sala