import { Router } from 'express';
import { confirmEventInvoice } from './facturaEvento-controller.js';
import { validarJWT } from '../../middlewares/validar-jwt.js';
import { duenioFactura } from '../../middlewares/validar-roles.js';

const router = Router();

router.post(
  '/generate-event-invoice',
  [
    validarJWT, 
    duenioFactura
  ],
  confirmEventInvoice
);

export default router;
