import { Router } from "express";
import { check } from "express-validator";
import { deleteUser, getUserAll, getUserById, getMyUser, updateCredentials, updateProfile, updateUserRole } from "./user.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { updateCredentialsUser, updateProfileUser, updateUserRoleValidator } from "../middlewares/validator.js";
import { esMismoUsuario, validarAdminRole } from "../middlewares/validar-roles.js";
import { tieneRole } from "../middlewares/tiene-role.js";

const router = Router();

router.get(
     '/viewUser', 
     [
        validarJWT,
        validarAdminRole,
     ],
     getUserAll
 );

router.get(
    "/:id",
    [
        validarJWT, 
        validarAdminRole, 
    ],
    getUserById
);


router.put(
    '/updProfile/:id', 
    [
        validarJWT, 
        esMismoUsuario
    ],
    updateProfileUser,
    updateProfile
);

router.put(
    '/updCredentials/:id', 
    [
        validarJWT, 
        esMismoUsuario
    ],
    updateCredentialsUser,
    updateCredentials
);

router.delete(
    "/deleteUser/:id",
    [
        validarJWT,
        esMismoUsuario,
        check("password", "La contraseña es obligatoria").not().isEmpty(),
        validarCampos
    ],
    deleteUser
);


router.put(
    '/updateRole/:id', 
    [
        validarJWT,
        tieneRole("ADMIN_ROLE")
    ],
    updateUserRoleValidator, 
    updateUserRole 
);

router.get(
    "/myUser/:id",
    [
        validarJWT,
    ],
    getMyUser
);


export default router;