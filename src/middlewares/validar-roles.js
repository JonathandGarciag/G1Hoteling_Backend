
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

export const adminOMismoHotel = (req, res, next) => {
    const { role, hotelId, _id } = req.user;
    const hotelParamId = req.params.id;

    if (role === "ADMIN_ROLE") return next();

    if (role === "HOTEL_ROLE" && hotelId?.toString() === hotelParamId) return next();

    return res.status(403).json({
        success: false,
        msg: "No tienes permiso para modificar este hotel"
    });
};

export const duenioHotel = (req, res, next) => {
    const user = req.user; 
  
    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "Token inválido o no autenticado"
      });
    }
  
    const { role, hotelId: userHotelId } = user;
    const { hotelId } = req.body;
  
    if (
      role !== "HOTEL_ROLE" ||
      !hotelId ||
      userHotelId?.toString() !== hotelId?.toString()
    ) {
      return res.status(403).json({
        success: false,
        msg: "No tienes permiso para registrar habitaciones en este hotel"
      });
    }
  
    next();
};

export const huespedlByRoom = async (req, res, next) => {
    try {
        const { role, hotelId: userHotelId } = req.usuario;
        const roomId = req.params.id;

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ success: false, msg: "Habitación no encontrada" });
        }

        if (role !== "HOTEL_ROLE" || room.hotelId.toString() !== userHotelId.toString()) {
            return res.status(403).json({ success: false, msg: "No eres dueño de esta habitación" });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error en la validación de dueño",
            error: error.message
        });
    }
};
