import { pedidoModels } from "./salida.model.js";

const getDatosSalida = async (req, res) => {
  try {
    const response = await pedidoModels.getDatosSalida();
    res.status(200).json(response);
  } catch (error) {
    res.status(400).send(error);
  }
};
const getDetalleSalida = async (req, res) => {
  const { idSalida } = req.params;
  try {
    const response = await pedidoModels.getDetalleSalida(idSalida);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).send(error);
  }
};
const createSalida = async (req, res) => {
  const salidaBody=req.body;
  try {
    const response = await pedidoModels.createSalida(salidaBody);
    res.status(201).json(response);
  } catch (error) {
    console.log(error);
    res.json(404).json(error);
  }
};

const updateSalida = async (req, res) => {
  const { idSalida } = req.params;
  try {
    const response = await pedidoModels.updateSalida(idSalida,req.body);
    console.log(response);
    res.status(202).json(response);
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
};


const deleteSalida = async (req, res) => {
  const { idSalida } = req.params;
  try {
    const response = await pedidoModels.deleteSalida(idSalida);
    console.log(response);
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json(error);
  }
};

export const SalidaController = {
  getDatosSalida,
  getDetalleSalida,
  updateSalida,
  createSalida,
  deleteSalida
};
