import {

  actualizarSalaModel,
  crearSalaModel,
  eliminarSalaModel,
  eliminarUsuarioDeSalaModel,
  getSalasByIdModel,
  isHostModel,
  obtenerLosUsuariosDeUnaSalaModel,
  obtenerLosUsuariosDeUnaSalaModelByCi,
  obtenerSalasModel,
} from "./sala.models.js";

// ... otras funciones
export const getSalas = async (req, res) => {
  try {
    const response = await obtenerSalasModel();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const obtenerLosUsuariosDeUnaSalas = async (req, res) => {
  try { 
    const { id_sala } = req.params;
    const response = await obtenerLosUsuariosDeUnaSalaModel( id_sala);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const obtenerLosUsuariosDeUnaSalaByCi = async (req, res) => {
  try {
    const { ci } = req.params;
    console.log(ci)
    const response = await obtenerLosUsuariosDeUnaSalaModelByCi(ci);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getSalaById= async (req, res) => {
  try {
    const { id } = req.params;
    const response = await getSalasByIdModel(id);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return error;
  }
}

export const postSala = async (req, res) => {
  try {
    const { nombre, capacidad, descripcion, es_privada, ci_host } = req.body;

    // Crear la sala
    const nuevaSala = await crearSalaModel(nombre, capacidad, descripcion, es_privada, ci_host);

    res.json({ message: "Sala registrada con éxito!", sala: nuevaSala });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};


export const actualizarSala = async (req, res) => {
  try {
    const {id}= req.params;
    const {
       diagrama
    } = req.body;


    await actualizarSalaModel(
      id,
      diagrama
      )

      res.status(201).send("Usuario actualizado con exito!");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

/*export const agregarUsuarioASala = async (req, res) => {
  try {
      const { ci_usuario, id_sala, isHost } = req.body;
      await agregarUsuarioASalaModel(ci_usuario, id_sala,isHost);
      res.json({ message: "Usuario agregado a la sala con éxito" });
  } catch (error) {
      console.error(error);
      res.status(500).send(error);
  }
};*/

export const isHost = async (req, res) => {
  const { ci_usuario, id_sala } = req.params;
  try {
    const response = await isHostModel(ci_usuario, id_sala);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return error;
  }

}

export const eliminarSala = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await eliminarSalaModel(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json(error);
  }
};

export const eliminarUsuarioDeSala = async (req, res) => {
  try {
      const { ci_usuario, id_sala } = req.params;
      await eliminarUsuarioDeSalaModel(ci_usuario, id_sala);
      res.json({ message: "Usuario eliminado de la sala" });
  } catch (error) {
      console.error(error);
      res.status(500).send(error);
  }
};