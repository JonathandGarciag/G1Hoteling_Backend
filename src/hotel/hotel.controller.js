import Hotel from './hotel.model.js';
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
        const { name, address, qualification, amenities } = req.body;

        const tokenPayload = { name, createdAt: new Date() };
        const accessToken = await generarJWT(tokenPayload);

        const hotel = await Hotel.create({
            name,
            address,
            qualification,
            amenities,
            accessToken
        });

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
        console.log(error);
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
        const { name, address, qualification, amenities } = req.body;

        const updated = await Hotel.findByIdAndUpdate(id, { name, address, qualification, amenities }, { new: true });

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
