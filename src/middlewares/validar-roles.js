
export const validarAdminRole = (req, res, next) => {
    if (!req.user) {
        return res.status(500).json({
            msg: "Error interno: No se validó el token antes de verificar el rol",
        });
    }

    if (req.user.role !== "ADMIN_ROLE") {
        return res.status(403).json({
            msg: "No tienes permisos para realizar esta acción",
        });
    }

    next();
};

export const esAdminOMismoHotel = (req, res, next) => {
    const { role, hotelId, _id } = req.user;
    const hotelParamId = req.params.id;

    if (role === "ADMIN_ROLE") return next();

    if (role === "HOTEL_ROLE" && hotelId?.toString() === hotelParamId) return next();

    return res.status(403).json({
        success: false,
        msg: "No tienes permiso para modificar este hotel"
    });
};