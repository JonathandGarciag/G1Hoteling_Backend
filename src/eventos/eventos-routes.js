import { Router } from 'express';
import {
  editarEvento,
  cancelarEvento,
  obtenerEventosPorHotel,
  createEvento
} from "../eventos/eventos-controller.js";
import { validarJWT } from '../middlewares/validar-jwt.js';
import { duenioEvento, duenioHotel } from '../middlewares/validar-roles.js';

const router = Router();

router.post(
  "/", 
  [
    validarJWT,
    duenioHotel
  ],  
  createEvento
);

router.put(
  "/:id", 
  [
    validarJWT,
    duenioEvento
  ],
  editarEvento
);

router.patch(
  "/cancelar/:id", 
  [
    validarJWT,
    duenioEvento
  ],
  cancelarEvento
);

router.get(
  "/hotel/:hotelId", 
  [
    validarJWT,
    duenioHotel
  ],
  obtenerEventosPorHotel
);


export default router;
