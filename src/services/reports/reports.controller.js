import { reportsModel } from "./reports.model.js";

const IngresoPorVentas = async (req, res) => {
  try {
    const response = await reportsModel.getIngresoPorVentas();
    res.status(200).json(response);
  } catch (error) {
    console.log("error en ingreso por ventas ");
    res.status(404).send("error en controlador 'ingreso por ventas' ");
  }
};
const ventasSemanales = async (req, res) => {
  try {
    const response = await reportsModel.getVentasDeLaSemana();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(404).send("error en controlador ingreso por ventas ");
  }
};

const cantProductosSalida = async (req, res) => {
  try {
    const response = await reportsModel.getCantidadProductosSalida();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(404).send("error en controlador ingreso por ventas ");
  }
};


const productoSalidaSemanal = async (req, res) => {
    try {
      const response = await reportsModel.cantidadProductosSalidaSemanal();
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      res.status(404).send("error en controlador ingreso por ventas ");
    }
  };

export const reportsController = {
  IngresoPorVentas,
  ventasSemanales,
  cantProductosSalida,
  productoSalidaSemanal
};
