import { Router } from 'express';
import { createReservation, getReservationsByUser, updateReservation, getReservationsByHotel, deleteReservation } from './reservation.controller.js';

import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { esAdminOMismoHotel, validarAdminRole } from '../middlewares/validar-roles.js';
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
    validarJWT
    ],
    getReservationsByUser
);

router.get(
    '/viewReservationsByHotel/:hotelId',
    [validarJWT],
    getReservationsByHotel
);

router.put(
    '/updateReservation/:id',
    [
    validarJWT,
    validUpdateReservation
    ],
    updateReservation
);

router.delete(
    '/deleteReservation/:id',
    [
    validarJWT,
    validarAdminRole,
    esAdminOMismoHotel,
    validarCampos
    ],
    deleteReservation
);

export default router;
