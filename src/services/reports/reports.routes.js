import { Router } from "express";
import {reportsController} from "./reports.controller.js";

const routerReports = Router() ; 


routerReports.get('/ingresoporventas', reportsController.IngresoPorVentas);
routerReports.get('/ventasSemanales',reportsController.ventasSemanales);
routerReports.get('/cantidadProductosSalida',reportsController.cantProductosSalida);
routerReports.get('/productosSalidaSemana',reportsController.productoSalidaSemanal);


export default routerReports ;