import { Router } from 'express';
import { confirmPurchase } from "../factura/factura-controller.js";
import { validarJWT } from '../middlewares/validar-jwt.js';
import { duenioFactura } from '../middlewares/validar-roles.js';

const router = Router();

router.post(
    "/generate", 
    [
        validarJWT,
        duenioFactura
    ],
    confirmPurchase
);

export default router;