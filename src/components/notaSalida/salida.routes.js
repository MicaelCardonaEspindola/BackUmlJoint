import { Router } from "express";
import { SalidaController } from "./salida.controller.js";
const routerSalida=Router();

routerSalida.get('/',SalidaController.getDatosSalida);

routerSalida.get('/:idSalida',SalidaController.getDetalleSalida);

routerSalida.post('/',SalidaController.createSalida);

routerSalida.put('/:idSalida',SalidaController.updateSalida);

routerSalida.delete('/:idSalida',SalidaController.deleteSalida);

export default routerSalida;