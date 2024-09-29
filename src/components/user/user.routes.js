import {Router} from "express"
import { getCajeros, postUsuario,patchContrasena, getUsuarios, actualizarUsuario, eliminarUsuario,renovarToken,getUsuariosById} from "./user.controllers.js";
const routerUser = Router() ;
import { checkAuth } from "../../middlewares/auth.js";
import { authRole } from "../../middlewares/auth_role.js";
import { validateCreate } from "../../validators/user.js";



routerUser.get('/admin', (req,res) =>{
    res.send("admin");
});

routerUser.get('/cook', (req,res) =>{
    res.send("cook");
});

routerUser.get('/cajero', getCajeros);


routerUser.get('/',[checkAuth,authRole(['ADMIN'])] ,getUsuarios)
routerUser.get('/:ci',getUsuariosById)
routerUser.put('/',checkAuth,actualizarUsuario)
routerUser.post('/registro',validateCreate,postUsuario)
routerUser.patch('/cambiarClave',patchContrasena)
routerUser.delete('/:ci',checkAuth,eliminarUsuario )
routerUser.get('/renew',checkAuth, renovarToken);


export default routerUser; 