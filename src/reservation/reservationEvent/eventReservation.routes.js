import { Router } from 'express';
import {
  createEventReservation,
  getEventReservationsByUser,
  deleteEventReservation
} from './eventReservation.controller.js';
import { validarJWT } from '../../middlewares/validar-jwt.js';
import { esMismoUsuario, validarAdminRole } from '../../middlewares/validar-roles.js';
import { validCreateEventReservation } from '../../middlewares/validator.js';

const router = Router();

router.post(
  '/registerEventReservation',
  [
    validarJWT, 
    validCreateEventReservation
  ],
  createEventReservation
);

router.get(
  '/viewEventReservations/:userId',
  [
    validarJWT, 
    esMismoUsuario
  ],
  getEventReservationsByUser
);

router.delete(
  '/deleteEventReservation/:id',
  [
    validarJWT, 
    validarAdminRole
  ],
  deleteEventReservation
);

export default router;
