import { validationResult } from "express-validator";
import {
  obtenerCajeros,
  registrarUsuarios,
  validarCorreosUnicos,
  cambiarcontrasena,
  constraseñaActual,
  validarUsuariosExistentes,
  obtenerUsuarios,
  updateUsuario,
  deleteUser,
 
} from "./user.models.js";
import bcrypt from "bcrypt";



export const getUsuarios = async (req, res) => {
  try {
    const response = await obtenerUsuarios();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getCajeros = async (req, res) => {
  try {
    const cajeros = await obtenerCajeros();
    console.log(cajeros);
    res.send(cajeros);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const postUsuario = async (req, res) => {
  try {
    const {
      ci,
      apellidos,
      correo,
      sexo,
      contrasena,
      telefono,
      id_rol
    } = req.body;
    let nombre = req.body.nombre;

    const errores=validationResult(req);
    if (!errores.isEmpty()) {
      res.status(400).json({ ok:false ,errores: errores.array() });
      return;
    } 

    nombre = nombre?.toLowerCase().trim();
    if (await validarCorreosUnicos(correo)) {
      console.log(validarCorreosUnicos(correo));
      res.status(403).send("Correo ya existe");
      return;
    }

    await registrarUsuarios(
      ci,
      nombre,
      apellidos,
      correo,
      sexo,
      await encryptarContrasena(contrasena),
      telefono,
      id_rol
    ).then(() => res.json({
      message: "Usuario registrado con exito!",
      ci: ci,
      nombre: nombre,
      apellidos: apellidos,
      correo: correo,
      sexo: sexo,
      telefono: telefono,
      id_rol: id_rol
    }));
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const actualizarUsuario = async (req, res) => {
  try {
    const {
      ci,
      nombre,
      apellidos,
      correo,
      sexo,
      imagen,
      telefono
    } = req.body;

    let name = nombre?.toLowerCase().trim();

    await updateUsuario({
      ci,
      nombre:name,
      apellidos,
      correo,
      sexo,
      imagen,
      telefono
      })

      res.status(201).send("Usuario actualizado con exito!");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const eliminarUsuario = async (req, res) => {
    const { ci } = req.params;
    try {
      const response = await deleteUser(ci);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json(error);
    }
  };



export const patchContrasena = async (req, res) => {
  try {
    const { ci, antiguacontrasena, nuevacontrasena } = req.body;

    if (!(await validarUsuariosExistentes(ci))) {
      res.status(403).send(`El usuario con el ci : ${ci} no existe  `);
      return;
    }
    const match = await bcrypt.compare(
      antiguacontrasena,
      await constraseñaActual(ci)
    );
    if (match) {
      await cambiarcontrasena(ci, await encryptarContrasena(nuevacontrasena));
      res.status(200).send("La contrasena ha sido actualizada");
    } else {
      res.status(403).send("Las contrasenas no coinciden");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const encryptarContrasena = async (contrasena) => {
  const salt = await bcrypt.genSalt(5);
  const newHash = await bcrypt.hash(contrasena, salt);
  return newHash;
};

export const renovarToken = async (req, res) => {
  return res.status(200).json({ message: "Token renovado con exito!" });
};

