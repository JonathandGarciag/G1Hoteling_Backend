import { Router } from 'express';
import { createReservation, getReservationsByUser, updateReservation, getReservationsByHotel, deleteReservation } from './reservation.controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { adminOMismoHotel, duenioHotel, esMismoUsuario, validarAdminRole } from '../middlewares/validar-roles.js';
import { validCreateReservation, validUpdateReservation } from '../middlewares/validator.js';

const router = Router();

router.post(
    '/registerReservation',
    [
        validarJWT,
        validCreateReservation
    ],
    createReservation
);

router.get(
    '/viewReservations/:userId',
    [
        validarJWT,
        esMismoUsuario
    ],
    getReservationsByUser
);

router.get(
    '/viewReservationsByHotel/:hotelId',
    [
        validarJWT
    ],
    getReservationsByHotel
);

router.put(
    '/updateReservation/:id',
    [
        validarJWT,
        duenioHotel,
        validUpdateReservation
    ],
    updateReservation
);

router.delete(
    '/deleteReservation/:id',
    [
        validarJWT,
        validarAdminRole,
        adminOMismoHotel,
        validarCampos
    ],
    deleteReservation
);

export default router;
