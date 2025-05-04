import { Router } from 'express';
import { createRoom, getRoomsByHotel, updateRoom, deleteRoom } from './room.controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { adminOMismoHotel, validarAdminRole, duenioHotel } from '../middlewares/validar-roles.js';
import { validCreateRoom, validUpdateRoom } from '../middlewares/validator.js';

const router = Router();

router.get(
    '/viewRooms/:hotelId',
    [
    validarJWT
    ],
    getRoomsByHotel
);

router.post(
    '/registerRoom',
    [
    validarJWT,
    duenioHotel,
    validCreateRoom
    ],
    createRoom
);

router.put(
    '/updateRoom/:id',
    [
    validarJWT,
    duenioHotel,
    validUpdateRoom
    ],
    updateRoom
);

router.delete(
    '/deleteRoom/:id',
    [
    validarJWT,
    duenioHotel
    ],
    deleteRoom
);

export default router;
