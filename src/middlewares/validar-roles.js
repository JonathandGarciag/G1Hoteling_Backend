import Reservation from '../reservation/reservation.model.js';

export const validarAdminRole = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN_ROLE") {
    return res.status(403).json({ msg: "No autorizado: se requiere rol ADMIN_ROLE" });
  }
  next();
};

export const adminOMismoHotel = (req, res, next) => {
  const { role, hotelId } = req.user;
  const hotelParamId = req.params.id;

  if (role === "ADMIN_ROLE" || (role === "HOTEL_ROLE" && hotelId?.toString() === hotelParamId)) {
    return next();
  }

  return res.status(403).json({ msg: "No autorizado: no puedes modificar este hotel" });
};

export const duenioHotel = (req, res, next) => {
  const { role, hotelId: userHotelId } = req.user;

  const hotelId = req.body?.hotelId || req.params?.hotelId || req.query?.hotelId;

  if (!hotelId) {
    return res.status(400).json({ msg: "hotelId no proporcionado" });
  }

  if (role === "HOTEL_ROLE" && userHotelId?.toString() === hotelId?.toString()) {
    return next();
  }

  return res.status(403).json({ msg: "No puedes modificar este hotel" });
};

export const validarAdminOHotelRole = (req, res, next) => {
  const { role } = req.user;

  if (role === "ADMIN_ROLE" || role === "HOTEL_ROLE") {
    return next();
  }

  return res.status(403).json({ msg: "No autorizado: se requiere rol ADMIN o HOTEL" });
};


export const duenioEvento = async (req, res, next) => {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) return res.status(404).json({ msg: "Evento no encontrado" });

    if (req.user.role === "HOTEL_ROLE" && req.user.hotelId.toString() === evento.hotelId.toString()) {
      return next();
    }

    return res.status(403).json({ msg: "No tienes permiso para este evento" });
  } catch (e) {
    return res.status(500).json({ msg: "Error validando dueño de evento", error: e.message });
  }
};

export const huespedlByRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ msg: "Habitación no encontrada" });

    if (req.user.role === "HOTEL_ROLE" && req.user.hotelId.toString() === room.hotelId.toString()) {
      return next();
    }

    return res.status(403).json({ msg: "No eres dueño de esta habitación" });
  } catch (e) {
    return res.status(500).json({ msg: "Error validando habitación", error: e.message });
  }
};

export const duenioFactura = async (req, res, next) => {
  try {
    const { reservationId } = req.body;

    if (!reservationId) {
      return res.status(400).json({ success: false, message: "El ID de la reservación es obligatorio." });
    }

    const reserva = await Reservation.findById(reservationId);
    if (!reserva) {
      return res.status(404).json({ success: false, message: "Reservación no encontrada." });
    }

    if (req.user.role === "HOTEL_ROLE" && req.user.hotelId.toString() === reserva.hotelId.toString()) {
      return next();
    }

    return res.status(403).json({ msg: "No puedes emitir esta factura" });
  } catch (e) {
    return res.status(500).json({ msg: "Error validando factura", error: e.message });
  }
};

export const esMismoUsuario = (req, res, next) => {
  const isAdmin = req.user.role === "ADMIN_ROLE";
  const isSameUser = req.user._id.toString() === req.params.id;

  if (isAdmin || isSameUser) return next();

  return res.status(403).json({ msg: "No tienes acceso a esta cuenta" });
};

export const verEstadisticas = (req, res, next) => {
  if (req.user.role !== 'ADMIN_ROLE') {
    return res.status(403).json({
      msg: "No tiene permiso para acceder a las estadísticas"
    });
  }
  next();
};
