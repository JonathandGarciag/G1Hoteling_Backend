import { Router } from 'express';
import { confirmPurchase } from "../factura/factura-controller.js";

const router = Router();

router.post("/generate", confirmPurchase);

export default router;