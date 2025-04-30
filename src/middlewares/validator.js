import  { body, param, check  } from "express-validator";
import { validarCampos  } from "./validar-campos.js";
import { existenteEmail } from "../helpers/db-validator.js";

export const registerValidator = [
    body("name", "The name is required").not().isEmpty(),
    body("username", "The username is required").not().isEmpty(),
    body("email", "You must enter a valid email").isEmail(),
    body("email").custom(existenteEmail),
    body("password", "Password must be at least 8 characters").isLength({ min: 8 }),
    validarCampos
];

export const loginValidator = [
    body("email").isEmail().withMessage("Ingresa una dirección de correo válida"),
    body("password", "La contraseña debe tener mínimo 8 caracteres").isLength({ min: 8 }),
    validarCampos
];

export const updateUserRoleValidator = [
    param("id", "Invalid user ID").isMongoId(), 
    body("role", "Role is required").not().isEmpty(), 
    validarCampos 
];


export const updateProfileUser = [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("username", "El username es obligatorio").not().isEmpty(),
    check("password", "La contraseña actual es obligatoria").not().isEmpty(),
    validarCampos
];

export const updateCredentialsUser = [
    check("password", "La nueva contraseña es obligatoria").not().isEmpty(),
    check("oldPassword", "La contraseña actual es obligatoria").not().isEmpty(),
    validarCampos
];

export const validcreateHotels = [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('address', 'La dirección es obligatoria').not().isEmpty(),
    check('qualification', 'La categoría es obligatoria').isIn(['1', '2', '3', '4', '5']),
    validarCampos
];

export const validUpdateHotels = [
    check('name', 'El nombre es obligatorio').optional().not().isEmpty(),
    validarCampos
];  

export const validAssingHotel = [
    check("userToken", "El token del usuario es obligatorio").not().isEmpty(),
    check("hotelToken", "El token del hotel es obligatorio").not().isEmpty(),
    validarCampos
];  

