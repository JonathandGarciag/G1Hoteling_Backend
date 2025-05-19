import Reservation from "../reservation/reservation.model.js";
import Hotel from "../hotel/hotel.model.js";
import Room from "../habitacion/room.model.js";
import User from "../user/user.model.js";

export const obtenerTopHoteles = async (req, res) => {
  try {
    const result = await Reservation.aggregate([
      { $group: { _id: "$hotelId", totalReservas: { $sum: 1 } } },
      { $sort: { totalReservas: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "hotels",
          localField: "_id",
          foreignField: "_id",
          as: "hotel"
        }
      },
      { $unwind: "$hotel" },
      { $project: { _id: 0, nombre: "$hotel.name", totalReservas: 1 } }
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: "Error al generar estadísticas", err });
  }
};

export const obtenerOcupacionHabitaciones = async (req, res) => {
  try {
    const result = await Room.aggregate([
      {
        $group: {
          _id: "$hotelId",
          total: { $sum: 1 },
          ocupadas: {
            $sum: { $cond: [{ $eq: ["$status", "OCUPADO"] }, 1, 0] }
          }
        }
      },
      {
        $lookup: {
          from: "hotels",
          localField: "_id",
          foreignField: "_id",
          as: "hotel"
        }
      },
      { $unwind: "$hotel" },
      {
        $project: {
          nombre: "$hotel.name",
          porcentaje: {
            $multiply: [{ $divide: ["$ocupadas", "$total"] }, 100]
          }
        }
      }
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: "Error al calcular ocupación", err });
  }
};

export const obtenerResumenGeneral = async (req, res) => {
  try {
    const totalUsuarios = await User.countDocuments();
    const totalReservas = await Reservation.countDocuments();
    const habitacionesTotales = await Room.countDocuments();
    const habitacionesOcupadas = await Room.countDocuments({ status: "OCUPADO" });

    res.json({
      totalUsuarios,
      totalReservas,
      habitacionesTotales,
      habitacionesOcupadas
    });
  } catch (err) {
    res.status(500).json({ msg: "Error al obtener resumen", err });
  }
};
