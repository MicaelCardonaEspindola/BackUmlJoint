import {Router} from "express"
import { getCajeros, postUsuario,patchContrasena, getUsuarios, actualizarUsuario, eliminarUsuario,renovarToken,getUsuariosById} from "./user.controllers.js";
const routerUser = Router() ;
import { checkAuth } from "../../middlewares/auth.js";
import { authRole } from "../../middlewares/auth_role.js";
import { validateCreate } from "../../validators/user.js";


routerUser.get('/',[checkAuth] ,getUsuarios)
routerUser.get('/:ci',checkAuth,getUsuariosById)
routerUser.put('/',checkAuth,actualizarUsuario)
routerUser.post('/registro',validateCreate,postUsuario)
routerUser.patch('/cambiarClave',patchContrasena)
routerUser.delete('/:ci',checkAuth,eliminarUsuario )
routerUser.get('/renew',checkAuth, renovarToken);


export default routerUser; 