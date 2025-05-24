import { Router } from "express";
import { register, login, forgotPassword, resetPassword  } from "../auth/auth.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { registerValidator, loginValidator } from "../middlewares/validator.js";
import { tieneRole } from "../middlewares/tiene-role.js";

const router = Router();

router.post(
    '/register',
    registerValidator,
    register
)

router.post(
    '/login',
    loginValidator,
    login
)

router.post(
    '/forgot-password', 
    forgotPassword
);
router.post(
    '/reset-password/:token', 
    resetPassword
);

export default router;