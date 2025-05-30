import EventReservation from './eventReservation.model.js';
import Evento from '../../eventos/eventos-model.js';

export const createEventReservation = async (req, res) => {
  try {
    const { eventoId, cantidadPersonas, serviciosAdicionales, precioTotal } = req.body;

    const evento = await Evento.findById(eventoId);
    if (!evento) {
      return res.status(404).json({
        success: false,
        msg: 'Evento no encontrado'
      });
    }

    const newReservation = new EventReservation({
      userId: req.user._id,
      eventoId,
      cantidadPersonas,
      serviciosAdicionales,
      precioTotal
    });

    await newReservation.save();

    return res.status(201).json({
      success: true,
      reservation: newReservation
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Error al crear la reservación del evento',
      error: error.message
    });
  }
};

export const getEventReservationsByUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const reservations = await EventReservation.find({ userId })
      .populate('eventoId', 'titulo fechaInicio fechaFin');

    return res.status(200).json({
      success: true,
      reservations
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Error al obtener reservaciones de eventos',
      error: error.message
    });
  }
};

export const deleteEventReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await EventReservation.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        msg: 'Reservación de evento no encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      msg: 'Reservación de evento eliminada correctamente'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Error al eliminar reservación de evento',
      error: error.message
    });
  }
};
