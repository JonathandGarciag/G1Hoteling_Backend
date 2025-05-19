import { Router } from "express";
import {
  obtenerTopHoteles,
  obtenerOcupacionHabitaciones,
  obtenerResumenGeneral
} from "./statistics.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { verEstadisticas } from "../middlewares/validar-roles.js";

const router = Router();


router.get("/top-hoteles", validarJWT, verEstadisticas, obtenerTopHoteles);
router.get("/ocupacion", validarJWT, verEstadisticas, obtenerOcupacionHabitaciones);
router.get("/resumen", validarJWT, verEstadisticas, obtenerResumenGeneral);

export default router;
