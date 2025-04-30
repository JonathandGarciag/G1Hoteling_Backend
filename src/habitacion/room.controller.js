import Room from './room.model.js';

export const createRoom = async (req, res) => {
    try {
    const { hotelId, roomType, capacity, pricePerNight, availability, status, amenities } = req.body;

    const room = await Room.create({
      hotelId,
      roomType,
      capacity,
      pricePerNight,
      availability,
      status,
      amenities
    });

    return res.status(201).json({
      success: true,
      msg: 'Habitación creada correctamente',
      room
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: 'Error al crear habitación',
      error: error.message
    });
  }
};

export const getRoomsByHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;

    const rooms = await Room.find({ hotelId });

    return res.status(200).json({
      success: true,
      rooms
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Error al obtener habitaciones',
      error: error.message
    });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { roomType, capacity, pricePerNight, availability, status, amenities } = req.body;

    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      { roomType, capacity, pricePerNight, availability, status, amenities },
      { new: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({
        success: false,
        msg: 'Habitación no encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      msg: 'Habitación actualizada',
      room: updatedRoom
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Error al actualizar habitación',
      error: error.message
    });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRoom = await Room.findByIdAndDelete(id);

    if (!deletedRoom) {
      return res.status(404).json({
        success: false,
        msg: 'Habitación no encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      msg: 'Habitación eliminada correctamente'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Error al eliminar habitación',
      error: error.message
    });
  }
};
