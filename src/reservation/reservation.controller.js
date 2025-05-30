import Reservation from './reservation.model.js';
import Hotel from '../hotel/hotel.model.js'

export const createReservation = async (req, res) => {
  try {
    const { hotelId, roomId, startDate, endDate, totalPrice } = req.body;

    const newReservation = new Reservation({
      userId: req.user._id,
      hotelId,
      roomId,
      startDate,
      endDate,
      totalPrice
    });

    await newReservation.save();

    await Room.findByIdAndUpdate(roomId, { status: 'reservada' });

    return res.status(201).json({
      success: true,
      reservation: newReservation
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Error al crear la reservación',
      error: error.message
    });
  }
};

export const getReservationsByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const reservations = await Reservation.find({ userId });

    return res.status(200).json({
      success: true,
      reservations
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Error al obtener reservaciones',
      error: error.message
    });
  }
};

export const getReservationsByUserMe = async (req, res) => {
  try {
    const userId = req.user._id;

    const reservations = await Reservation.find({ userId })
      .populate("hotelId") 
      .exec();

    return res.status(200).json({
      success: true,
      reservations
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Error al obtener reservaciones',
      error: error.message
    });
  }
};


export const getReservationsByHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        msg: 'Hotel no encontrado',
      });
    }

    const reservations = await Reservation.find({ hotelId })
      .populate('userId', 'name email')
      .populate({
        path: 'roomId',
        select: 'roomType capacity pricePerNight'
       })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      msg: 'Reservaciones del hotel obtenidas correctamente',
      reservations,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Error al obtener reservaciones del hotel',
      error: error.message,
    });
  }
};

export const updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const update = req.body;

        const updated = await Reservation.findByIdAndUpdate(id, update, { new: true });

        if (!updated) {
            return res.status(404).json({
                success: false,
                msg: 'Reservación no encontrada'
            });
        }

        return res.status(200).json({
            success: true,
            msg: 'Reservación actualizada',
            reservation: updated
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al actualizar reservación',
            error: error.message
        });
    }
};

export const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Reservation.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                msg: 'Reservación no encontrada'
            });
        }

        return res.status(200).json({
            success: true,
            msg: 'Reservación eliminada correctamente'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al eliminar reservación',
            error: error.message
        });
    }
};

