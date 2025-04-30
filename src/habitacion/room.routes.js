import { Router } from 'express';
import { createRoom, getRoomsByHotel, updateRoom, deleteRoom } from './room.controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { esAdminOMismoHotel, validarAdminRole } from '../middlewares/validar-roles.js';
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
    validarAdminRole,
    validCreateRoom,
    validarCampos
    ],
    createRoom
);

router.put(
    '/updateRoom/:id',
    [
    validarJWT,
    esAdminOMismoHotel,
    validUpdateRoom,
    validarCampos
    ],
    updateRoom
);

router.delete(
    '/deleteRoom/:id',
    [
    validarJWT,
    validarAdminRole,
    esAdminOMismoHotel,
    validarCampos
    ],
    deleteRoom
);

export default router;
