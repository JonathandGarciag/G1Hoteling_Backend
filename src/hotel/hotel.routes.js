import { Router } from 'express';
import { assignHotelToUser, createHotel, deleteHotel, getHotels, updateHotel } from './hotel.controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { adminOMismoHotel, validarAdminRole } from '../middlewares/validar-roles.js';
import { validAssingHotel, validcreateHotels, validUpdateHotels } from '../middlewares/validator.js';
import { validarTokensHotelUser } from '../helpers/db-validator.js';

const router = Router();

router.get(
    '/viewHotel', 
    getHotels
);

router.post(
    '/registerHotel',
    [
        validarJWT,
        validarAdminRole,
        validcreateHotels
    ],
    createHotel
);

router.put(
    '/updateHotel/:id',
    [
        validarJWT,
        adminOMismoHotel,
        validUpdateHotels
    ],
    updateHotel
);

router.delete(
    '/deleteHt/:id',
    [
        validarJWT,
        validarAdminRole,
        adminOMismoHotel,
        validarCampos
    ],
    deleteHotel
);

router.post(
    "/assignHotelToUser",
    [
      validarJWT,
      validarAdminRole,
      validAssingHotel,
      validarTokensHotelUser
    ],
    assignHotelToUser
  );

export default router;
