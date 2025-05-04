import { Router } from 'express';
import {
  editarEvento,
  cancelarEvento,
  obtenerEventosPorHotel,
  createEvento
} from "../eventos/eventos-controller.js";

const router = Router();

router.post("/", createEvento);
router.put("/:id", editarEvento);
router.patch("/cancelar/:id", cancelarEvento);
router.get("/hotel/:hotelId", obtenerEventosPorHotel);

export default router;
