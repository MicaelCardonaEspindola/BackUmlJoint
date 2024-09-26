import { Router } from "express";
import routerUser from "../components/user/user.routes.js";
import authRouter from "../services/auth/auth.routes.js";
import routerReports from "../services/reports/reports.routes.js";
import routerSalida from "../components/notaSalida/salida.routes.js";
import routerSala from "../components/sala/sala.routes.js";

const router = Router(); 
router.use('/usuario', routerUser); 
router.use('/sala', routerSala); 
router.use('/auth', authRouter);
router.use('/reportes',routerReports);
router.use('/notaSalida',routerSalida);

export default router ;


