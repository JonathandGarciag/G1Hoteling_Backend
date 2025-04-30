import { Router } from "express";
import { check } from "express-validator";
import { deleteUser, getUser, updateCredentials, updateProfile } from "./user.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { updateCredentialsUser, updateProfileUser } from "../middlewares/validator.js";

const router = Router();

 router.get(
     '/viewUser', 
     getUser  
 );

router.put(
    '/updProfile/:id', 
    [
        validarJWT, 
    ],
    updateProfileUser,
    updateProfile
);

router.put(
    '/updCredentials/:id', 
    [
        validarJWT, 
    ],
    updateCredentialsUser,
    updateCredentials
);

router.delete(
    "/deleteUser/:id",
    [
        validarJWT,
        check("password", "La contraseña es obligatoria").not().isEmpty(),
        validarCampos
    ],
    deleteUser
);


export default router;