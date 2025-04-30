import { hash, verify  } from "argon2";
import { validarUsuarioYPassword } from "../helpers/db-validator.js";
import User from "./user.model.js";

export const getUser = async (req, res) => {
    try {
        const users = await User.find({ status: true })

        return res.status(200).json({ success: true, users });
    } catch (e) {
        return res.status(500).json({
            success: false,
            msg: 'Error al obtener usuarios',
            e
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, username, password } = req.body;

        if (!password) return res.status(400).json({ success: false, msg: "Contraseña requerida" });

        await validarUsuarioYPassword(id, password);
        const updatedUser = await User.findByIdAndUpdate(id, { name, username }, { new: true });

        return res.status(200).json({
            success: true,
            msg: "Perfil actualizado correctamente",
            user: updatedUser,
        });
    } catch (error) {
        return res.status(error.code || 500).json({
            success: false,
            msg: error.msg || "Error al actualizar perfil",
            error: error.message || undefined,
        });
    }
};

export const updateCredentials = async (req, res) => {
    try {
        const { id } = req.params;
        const { password, oldPassword } = req.body;

        if (!oldPassword)
            return res.status(400).json({ success: false, msg: "Contraseña actual requerida" });

        await validarUsuarioYPassword(id, oldPassword);
        const hashedPassword = await hash(password);

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { password: hashedPassword }, 
            { new: true }
        );

        return res.status(200).json({
            success: true,
            msg: "Contraseña actualizada correctamente",
            user: updatedUser,
        });
    } catch (error) {
        return res.status(error.code || 500).json({
            success: false,
            msg: error.msg || "Error al actualizar contraseña",
            error: error.message || undefined,
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        await validarUsuarioYPassword(id, password);
        await User.findByIdAndUpdate(id, { status: false });

        return res.status(200).json({
            success: true,
            msg: "Usuario deshabilitado correctamente",
        });
    } catch (error) {
        return res.status(error.code || 500).json({
            success: false,
            msg: error.msg || "Error al deshabilitar usuario",
            error: error.message || undefined,
        });
    }
};