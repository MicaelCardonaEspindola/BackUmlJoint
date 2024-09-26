import {Router} from "express"
import {  postSala, getSalas, actualizarSala, eliminarSala,eliminarUsuarioDeSala,agregarUsuarioASala,getSalaById, obtenerLosUsuariosDeUnaSalas,obtenerLosUsuariosDeUnaSalaByCi} from "./sala.controllers.js";
const routerSala = Router() ;
import { checkAuth } from "../../middlewares/auth.js";

routerSala.get('/' ,getSalas)
routerSala.put('/:id',actualizarSala)
routerSala.post('/',postSala)
routerSala.delete('/:id',eliminarSala )
routerSala.delete('/usuario-sala/:ci_usuario/:id_sala',eliminarUsuarioDeSala )
routerSala.post('/usuario-sala',agregarUsuarioASala )
routerSala.get('/usuario-sala/:id_sala',obtenerLosUsuariosDeUnaSalas)
routerSala.get('/usuario-salaByCi/:ci',obtenerLosUsuariosDeUnaSalaByCi)
routerSala.get('/:id',getSalaById)


export default routerSala; 