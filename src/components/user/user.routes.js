import {Router} from "express"
import { getCajeros, postUsuario,patchContrasena, getUsuarios, actualizarUsuario, eliminarUsuario, excelToJson } from "./user.controllers.js";
const routerUser = Router() ;
import multer from "multer";
import { checkAuth } from "../../middlewares/auth.js";
import { authRole } from "../../middlewares/auth_role.js";
const upload = multer({ dest: 'uploads/' }); 


routerUser.get('/admin', (req,res) =>{
    res.send("admin");
});

routerUser.get('/cook', (req,res) =>{
    res.send("cook");
});

routerUser.get('/cajero', getCajeros);


routerUser.get('/',checkAuth,authRole(['estudiante']) ,getUsuarios)
routerUser.put('/',checkAuth,actualizarUsuario)
routerUser.post('/registro',postUsuario)
routerUser.patch('/cambiarClave',patchContrasena)
routerUser.delete('/:ci',checkAuth,eliminarUsuario )
routerUser.post('/multiRegistro',upload.single('excel'),checkAuth,excelToJson)


export default routerUser; 