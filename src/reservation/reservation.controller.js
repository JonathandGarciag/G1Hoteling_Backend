import Reservation from './reservation.model.js';

export const createReservation = async (req, res) => {
    try {
        const {
            userId,
            hotelId,
            roomId,
            startDate,
            endDate,
            totalPrice
        } = req.body;

        const reservation = await Reservation.create({
            userId,
            hotelId,
            roomId,
            startDate,
            endDate,
            totalPrice
        });

        return res.status(201).json({
            success: true,
            msg: 'Reservación creada correctamente',
            reservation
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: 'Error al crear la reservación',
            error: error.message
        });
    }
};

export const getReservationsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
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

export const getReservationsByHotel = async (req, res) => {
    try {
        const { hotelId } = req.params;

        const reservations = await Reservation.find({ hotelId });

        return res.status(200).json({
            success: true,
            reservations
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al obtener reservaciones por hotel',
            error: error.message
        });
    }
};
