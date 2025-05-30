import { hash, verify  } from "argon2";
import { validarUsuarioYPassword } from "../helpers/db-validator.js";
import User from "./user.model.js";

export const getUserAll = async (req, res) => {
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

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id, "-password");

    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ msg: "Error al buscar usuario", error });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const id = req.user._id;
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
    const id = req.user._id;
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
    const id = req.user._id; 
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

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body; 

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    user.role = role;
    await user.save();

    return res.status(200).json({ msg: "Rol actualizado con éxito", user });
  } catch (error) {
    return res.status(500).json({ msg: "Error al cambiar rol", error });
  }
};

export const getMyUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id, "-password");

    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ msg: "Error al buscar usuario", error });
  }
};