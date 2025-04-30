import { hash, verify } from "argon2";
import User from '../user/user.model.js'
import Hotel from '../hotel/hotel.model.js'; 
import { generarJWT } from "../helpers/generate-jwt.js";

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


export const updateUserRole = async (req, res) => {
    try {

        const { id } = req.params;
        const { role } = req.body;

        const user = await User.findByIdAndUpdate(id, { role: role }, { new: true });

        if (!user) {
            return res.status(404).json({
                msg: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            msg: "Rol actualizado correctamente",
            user
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error al actualizar rol",
            error: error.message,
        });
    }
};