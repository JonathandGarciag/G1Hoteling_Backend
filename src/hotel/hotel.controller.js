import Hotel from './hotel.model.js';
import User from '../user/user.model.js';
import { generarJWT } from "../helpers/generate-jwt.js";

export const getHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find({ status: true });
        return res.status(200).json({ 
            success: true, 
            hotels 
        });
    } catch (error) {
        return res.status(500).json({ success: false, msg: 'Error al obtener hoteles', error: error.message });
    }
};

export const createHotel = async (req, res) => {
    try {
        const { name, address, qualification, amenities, image } = req.body;
        const { role, _id: userId } = req.user;

        const tokenPayload = { name, createdAt: new Date() };
        const accessToken = await generarJWT(tokenPayload);

        const hotel = await Hotel.create({
            name,
            address,
            qualification,
            amenities,
            image,
            accessToken
        });

        if (role === "HOTEL_ROLE") {
            const user = await User.findById(userId);
            user.hotelId = hotel._id;
            await user.save();z
        }

        res.status(201).json({
            success: true,
            msg: "Hotel creado correctamente",
            hotel: {
                name: hotel.name,
                address: hotel.address,
                token: hotel.accessToken
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error al registrar hotel",
            error: error.message
        });
    }
};

export const updateHotel = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, qualification, amenities, image } = req.body;

        const updated = await Hotel.findByIdAndUpdate(id, { name, address, qualification, amenities, image }, { new: true });

        if (!updated) {
            return res.status(404).json({ 
                success: false, 
                msg: 'Hotel no encontrado' 
            });
        }

        return res.status(200).json({ success: true, msg: 'Hotel actualizado', hotel: updated });
    } catch (error) {
        return res.status(500).json({ success: false, msg: 'Error al actualizar hotel', error: error.message });
    }
};

export const deleteHotel = async (req, res) => {
    try {
        const { id } = req.params;

        const hotel = await Hotel.findByIdAndUpdate(id, { status: false }, { new: true });

        if (!hotel) {
            return res.status(404).json({ 
                success: false, 
                msg: 'Hotel no encontrado' 
            });
        }

        return res.status(200).json({ success: true, msg: 'Hotel deshabilitado correctamente' });
    } catch (error) {
        return res.status(500).json({ success: false, msg: 'Error al deshabilitar hotel', error: error.message });
    }
};

export const assignHotelToUser = async (req, res) => {
    try {
        const user = req.userToAssign;
        const hotel = req.hotelToAssign;

        user.hotelId = hotel._id;
        await user.save();

        res.status(200).json({
            success: true,
            msg: "Hotel asignado correctamente",
            user: {
                id: user._id,
                email: user.email,
                hotel: hotel.name
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al asignar hotel",
            error: error.message
        });
    }
};

export const rateHotel = async (req, res) => {
  try {
    const { rating } = req.body;
    const hotel = req.hotelDB;

    hotel.votes.push(Number(rating));

    const total = hotel.votes.reduce((acc, val) => acc + val, 0);
    hotel.qualification = (total / hotel.votes.length).toFixed(2);

    await hotel.save();

    return res.status(200).json({
      success: true,
      msg: "Hotel calificado correctamente",
      qualification: hotel.qualification,
      totalVotes: hotel.votes.length
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Error al calificar",
      error: error.message
    });
  }
};
