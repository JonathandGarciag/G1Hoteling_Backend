import { hash, verify } from "argon2";
import User from '../user/user.model.js'
import Hotel from '../hotel/hotel.model.js'; 
import { generarJWT } from "../helpers/generate-jwt.js";
import crypto from "node:crypto";

export const register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        const encryptedPassword = await hash(password);

        const user = await User.create({
            name,
            username,
            email,
            password: encryptedPassword,
            role: "CLIENT_ROLE" 
        });

        return res.status(200).json({
            msg: "Usuario registrado correctamente",
            userDetails: {
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Registro de usuario fallido",
            error: error.message,
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const lowerEmail = email?.toLowerCase();
        const user = await User.findOne({ email: lowerEmail }).populate("hotelId");

        if (!user || !user.status) {
            const reason = !user ? "Correo no existe" : "Usuario deshabilitado";
            return res.status(400).json({ msg: `Credenciales inválidas: ${reason}` });
        }

        const validPassword = await verify(user.password, password);
        if (!validPassword) {
            return res.status(400).json({ msg: "Contraseña incorrecta" });
        }

        const token = await generarJWT(user.id);

        return res.status(200).json({
            msg: "Inicio de sesión exitoso!!",
            userDetails: {
                username: user.username,
                email: user.email,
                role: user.role,
                hotel: user.hotelId ?? null,
                token: token,
            }
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            msg: 'Error en el servidor',
            error: e.message
        });
    }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user)
    return res.status(404).json({ msg: "Correo no registrado" });

  const token = crypto.randomBytes(20).toString('hex');
  user.resetToken = token;
  user.resetTokenExpires = Date.now() + 1000 * 60 * 60; 
  await user.save();

  console.log(`Enlace: http://localhost:3000/reset-password/${token}`);

  return res.json({ msg: "Correo enviado (simulado)", token });
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: Date.now() }
  });

  if (!user)
    return res.status(400).json({ msg: "Token inválido o expirado" });

  user.password = await hash(newPassword);
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();

  return res.json({ msg: "Contraseña actualizada con éxito" });
};