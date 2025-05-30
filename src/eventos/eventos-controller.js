import Evento from "../eventos/eventos-model.js";
import Hotel from "../hotel/hotel.model.js";
import User from "../user/user.model.js";

export const createEvento = async (req, res) => {
  try {
    const {
      hotelId,
      usuarioId,
      titulo,
      descripcion,
      fechaInicio,
      fechaFin,
      capacidad,
      recursosAdicionales,
      precio,
      image
    } = req.body;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ success: false, message: "Hotel no encontrado." });
    }

    const usuario = await User.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado." });
    }

    const nuevoEvento = new Evento({
      hotelId,
      usuarioId,
      titulo,
      descripcion,
      fechaInicio,
      fechaFin,
      capacidad,
      recursosAdicionales,
      precio,
      image
    });

    await nuevoEvento.save();

    res.status(201).json({
      success: true,
      message: "Evento creado correctamente.",
      evento: nuevoEvento
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear el evento.",
      error: error.message
    });
  }
};

export const editarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizados = req.body;

    if (datosActualizados.recursosAdicionales && !Array.isArray(datosActualizados.recursosAdicionales)) {
      return res.status(400).json({
        success: false,
        message: "recursosAdicionales debe ser un arreglo."
      });
    }

    const eventoActualizado = await Evento.findByIdAndUpdate(id, datosActualizados, { new: true });

    if (!eventoActualizado) {
      return res.status(404).json({
        success: false,
        message: "Evento no encontrado."
      });
    }

    res.status(200).json({
      success: true,
      message: "Evento actualizado correctamente.",
      evento: eventoActualizado
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar el evento.",
      error: error.message
    });
  }
};

export const cancelarEvento = async (req, res) => {
  try {
    const { id } = req.params;

    const evento = await Evento.findById(id);
    if (!evento) {
      return res.status(404).json({
        success: false,
        message: "Evento no encontrado."
      });
    }

    evento.estado = "cancelado";
    await evento.save();

    res.status(200).json({
      success: true,
      message: "Evento cancelado correctamente.",
      evento
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al cancelar el evento.",
      error: error.message
    });
  }
};

export const obtenerEventosPorHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;

    const eventos = await Evento.find({ hotelId })
      .populate("usuarioId", "name email") 
      .sort({ fechaInicio: 1 });

    res.status(200).json({
      success: true,
      eventos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener eventos.",
      error: error.message
    });
  }
};

export const obtenerTodosLosEventos = async (req, res) => {
  try {
    const eventos = await Evento.find()
      .populate("usuarioId", "name email")
      .populate("hotelId", "name")
      .sort({ fechaInicio: 1 });

    res.status(200).json({
      success: true,
      eventos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener todos los eventos.",
      error: error.message
    });
  }
};

export const getEventoById = async (req, res) => {
  const { id } = req.params;

  try {
    const evento = await Evento.findById(id)
      .populate("hotelId", "nombre direccion") // opcional: poblar datos del hotel
      .populate("usuarioId", "nombre email");  // opcional: poblar datos del usuario

    if (!evento) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    res.status(200).json(evento);
  } catch (error) {
    console.error("Error al obtener el evento por ID:", error);
    res.status(500).json({ message: "Error al obtener el evento" });
  }
};
