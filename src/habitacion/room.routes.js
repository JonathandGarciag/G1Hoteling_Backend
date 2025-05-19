import { Router } from 'express';
import { createRoom, getRoomsByHotel, updateRoom, deleteRoom } from './room.controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { adminOMismoHotel, validarAdminRole, duenioHotel, huespedlByRoom } from '../middlewares/validar-roles.js';
import { validCreateRoom, validUpdateRoom } from '../middlewares/validator.js';

const router = Router();

router.get(
    '/viewRooms/:hotelId',
    [
        validarJWT,
        duenioHotel
    ],
    getRoomsByHotel
);

router.post(
    '/registerRoom',
    [
        validarJWT,
        validCreateRoom,
    ],
    createRoom
);

router.put(
    '/updateRoom/:id',
    [
        validarJWT,
        huespedlByRoom,
        validUpdateRoom,
    ],
    updateRoom
);

router.delete(
    '/deleteRoom/:id',
    [
        validarJWT,
        huespedlByRoom,
        adminOMismoHotel,
        validarCampos
    ],
    deleteRoom
);

export default router;
