import { Router } from 'express';
import { assignHotelToUser, createHotel, deleteHotel, getHotels, updateHotel, rateHotel } from './hotel.controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { adminOMismoHotel, validarAdminRole, validarAdminOHotelRole } from '../middlewares/validar-roles.js';
import { validAssingHotel, validcreateHotels, validUpdateHotels } from '../middlewares/validator.js';
import { validarTokensHotelUser, validarHotelUnico, validarCalificacion, validarHotelPorId } from '../helpers/db-validator.js';

const router = Router();

router.get(
    '/viewHotel', 
    getHotels
);

router.post(
    '/registerHotel',
    [
        validarJWT,
        validarAdminOHotelRole,
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

router.post(
  '/rateHotel/:id',
  [
    validarJWT,
    validarHotelPorId,
    validarCalificacion 
  ],
  rateHotel
); 

export default router;
