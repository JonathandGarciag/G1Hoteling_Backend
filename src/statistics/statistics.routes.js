import { Router } from "express";
import {
  obtenerTopHoteles,
} from "./statistics.controller.js";
import { verEstadisticas } from "../middlewares/validar-roles.js";

const router = Router();

router.get("/top-hoteles", obtenerTopHoteles);

export default router;
