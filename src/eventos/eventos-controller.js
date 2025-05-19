import Evento from "../eventos/eventos-model.js";
import Hotel from "../hotel/hotel.model.js";

export const createEvento = async (req, res) => {
  try {
    const { hotelId, titulo, descripcion, fecha, serviciosIncluidos } = req.body;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ success: false, message: "Hotel no encontrado." });
    }

    if (!Array.isArray(serviciosIncluidos)) {
      return res.status(400).json({ success: false, message: "serviciosIncluidos debe ser un arreglo." });
    }

    const nuevoEvento = new Evento({
      hotelId,
      titulo,
      descripcion,
      fecha,
      serviciosIncluidos
    });

    await nuevoEvento.save();

    res.status(201).json({
      success: true,
      message: "Evento creado correctamente.",
      evento: nuevoEvento
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al crear el evento.", error: error.message });
  }
};

export const editarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizados = req.body;

    if (datosActualizados.serviciosIncluidos && !Array.isArray(datosActualizados.serviciosIncluidos)) {
      return res.status(400).json({ success: false, message: "serviciosIncluidos debe ser un arreglo." });
    }

    const eventoActualizado = await Evento.findByIdAndUpdate(id, datosActualizados, { new: true });

    if (!eventoActualizado) {
      return res.status(404).json({ success: false, message: "Evento no encontrado." });
    }

    res.status(200).json({
      success: true,
      message: "Evento actualizado correctamente.",
      evento: eventoActualizado
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al actualizar el evento.", error: error.message });
  }
};

export const cancelarEvento = async (req, res) => {
  try {
    const { id } = req.params;

    const evento = await Evento.findById(id);
    if (!evento) {
      return res.status(404).json({ success: false, message: "Evento no encontrado." });
    }

    evento.estado = "cancelado";
    await evento.save();

    res.status(200).json({
      success: true,
      message: "Evento cancelado correctamente.",
      evento
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al cancelar el evento.", error: error.message });
  }
};


export const obtenerEventosPorHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const eventos = await Evento.find({ hotelId });

    res.status(200).json({
      success: true,
      eventos
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener eventos.", error: error.message });
  }
};
