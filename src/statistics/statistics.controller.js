import Reservation from "../reservation/reservation.model.js";
import Hotel from "../hotel/hotel.model.js";
import Room from "../habitacion/room.model.js";
import User from "../user/user.model.js";
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';

export const obtenerTopHoteles = async (req, res) => {
  try {
    const result = await Reservation.aggregate([
      {
        $match: {
          status: { $nin: ["cancelada"] } 
        }
      },
      {
        $group: {
          _id: "$hotelId",
          totalReservas: { $sum: 1 }
        }
      },
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
      { $unwind: { path: "$hotel", preserveNullAndEmptyArrays: false } },
      {
        $project: {
          _id: 0,
          nombre: "$hotel.name",
          totalReservas: 1
        }
      }
    ]);

    res.json(result);
  } catch (err) {
    console.error("Error en /top-hoteles:", err);
    res.status(500).json({ msg: "Error al generar estadísticas", err });
  }
};


const width = 800;
const height = 600;
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

