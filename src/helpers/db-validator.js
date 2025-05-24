import User from '../user/user.model.js';
import Role from '../role/role.model.js';
import Hotel from "../hotel/hotel.model.js";
import jwt from "jsonwebtoken";
import { hash, verify  } from "argon2";

export const esRoleValido = async (role = '') => {
    try {
        const roleExist = await Role.findOne({ role: role });

        if (!roleExist) {

            throw new Error(`El rol ${role} no existe en la base de datos.`);
        }
    } catch (err) {
        throw new Error(`Error al verificar el rol ${role}: ${err.message}`);
    }
};

export const existenteEmail = async (email = '') => {
    
    const existeEmail = await User.findOne({ email });

    if (existeEmail) {
        throw new Error(`El email ${email} ya está registrado`);
    }
};

export const validarUsuarioYPassword = async (id, inputPassword) => {
    const user = await User.findById(id).populate("hotelId");
    if (!user) throw { code: 404, msg: "Usuario no encontrado" };

    const valid = await verify(user.password, inputPassword);
    if (!valid) throw { code: 401, msg: "Contraseña incorrecta" };

    return user;
};

export const validarTokensHotelUser = async (req, res, next) => {
    try {
        const { userToken, hotelToken } = req.body;
        const secret = process.env.SECRETORPRIVATEKEY;

        const decodedUser = jwt.verify(userToken, secret);
        const user = await User.findById(decodedUser.uid);

        if (!user) {
            return res.status(404).json({ success: false, msg: "Usuario no encontrado" });
        }

        if (user.role !== "HOTEL_ROLE") {
            return res.status(403).json({ success: false, msg: "El usuario debe tener el rol HOTEL_ROLE" });
        }

        if (user.hotelId) {
            return res.status(400).json({ success: false, msg: "El usuario ya tiene un hotel asignado" });
        }

        jwt.verify(hotelToken, secret);
        const hotel = await Hotel.findOne({ accessToken: hotelToken });

        if (!hotel) {
            return res.status(404).json({ success: false, msg: "Hotel no encontrado" });
        }

        req.userToAssign = user;
        req.hotelToAssign = hotel;
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            msg: "Tokens inválidos",
            error: error.message
        });
    }
};

export const validarHotelUnico = async (req, res, next) => {
    const { role, _id: userId } = req.user;

    if (role === "HOTEL_ROLE") {
        const user = await User.findById(userId);

        if (!user) {
        return res.status(404).json({
            success: false,
            msg: "Usuario no encontrado"
        });
        }

        if (user.hotelId) {
        return res.status(400).json({
            success: false,
            msg: "Ya tienes un hotel asignado. No puedes crear otro."
        });
        }
    }

    next();
};

export const validarCalificacion = (req, res, next) => {
  const { rating } = req.body;

  if (!['1', '2', '3', '4', '5'].includes(String(rating))) {
    return res.status(400).json({
      success: false,
      msg: "La calificación debe ser un número entre 1 y 5"
    });
  }

  next();
};

export const validarHotelPorId = async (req, res, next) => {
  const { id } = req.params;

  try {
    const hotel = await Hotel.findById(id);

    if (!hotel || hotel.status === false) {
      return res.status(404).json({
        success: false,
        msg: "Hotel no encontrado o deshabilitado"
      });
    }

    req.hotelDB = hotel;
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "ID de hotel inválido",
      error: error.message
    });
  }
};