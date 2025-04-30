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

export const validCreateRoom = [
    check('hotelId', 'El ID del hotel es obligatorio').not().isEmpty().isMongoId(),
    check('roomType', 'El tipo de habitación es obligatorio').not().isEmpty(),
    check('capacity', 'La capacidad debe ser un número entero mayor a 0').isInt({ min: 1 }),
    check('pricePerNight', 'El precio debe ser un número mayor o igual a 0').isFloat({ min: 0 }),
    check('availability', 'La disponibilidad debe ser un arreglo válido').isArray(),
    check('status', 'Estado inválido').optional().isIn(['disponible', 'reservada', 'en mantenimiento']),
    validarCampos
];

export const validUpdateRoom = [
    check('roomType', 'El tipo de habitación es obligatorio').optional().not().isEmpty(),
    check('capacity', 'La capacidad debe ser un número entero mayor a 0').optional().isInt({ min: 1 }),
    check('pricePerNight', 'El precio debe ser un número mayor o igual a 0').optional().isFloat({ min: 0 }),
    check('availability', 'La disponibilidad debe ser un arreglo válido').optional().isArray(),
    check('status', 'Estado inválido').optional().isIn(['disponible', 'reservada', 'en mantenimiento']),
    validarCampos
];

export const validCreateReservation = [
    check('userId', 'El ID del usuario es obligatorio').not().isEmpty().isMongoId(),
    check('hotelId', 'El ID del hotel es obligatorio').not().isEmpty().isMongoId(),
    check('roomId', 'El ID de la habitación es obligatorio').not().isEmpty().isMongoId(),
    check('startDate', 'La fecha de inicio es obligatoria').not().isEmpty().isISO8601(),
    check('endDate', 'La fecha de fin es obligatoria').not().isEmpty().isISO8601(),
    check('totalPrice', 'El precio total debe ser un número positivo').isFloat({ min: 0 }),
    validarCampos
];

export const validUpdateReservation = [
    check('startDate', 'La fecha de inicio debe ser válida').optional().isISO8601(),
    check('endDate', 'La fecha de fin debe ser válida').optional().isISO8601(),
    check('totalPrice', 'El precio total debe ser un número positivo').optional().isFloat({ min: 0 }),
    check('status', 'Estado inválido').optional().isIn(['confirmada', 'cancelada', 'finalizada']),
    validarCampos
];

