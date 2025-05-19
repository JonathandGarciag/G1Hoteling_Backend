import PDFDocument from "pdfkit";
import Factura from "../factura/factura-model.js";
import Reservacion from "../reservation/reservation.model.js";
import Hotel from "../hotel/hotel.model.js";
import fs from "fs";
import path from "path";

export const confirmPurchase = async (req, res) => {
  try {
    const usuario = req.user; 
    const { reservationId, additionalServices = [] } = req.body;

    if (!reservationId) {
      return res.status(400).json({ success: false, message: "El ID de la reservación es obligatorio." });
    }

    const reservacion = await Reservacion.findById(reservationId).populate("hotelId");
    if (!reservacion) {
      return res.status(404).json({ success: false, message: "Reservación no encontrada." });
    }

    if (reservacion.status !== "finalizada") {
      return res.status(400).json({ success: false, message: "La reservación debe estar finalizada antes de generar la factura." });
    }

    const roomCharges = reservacion.totalPrice;
    const servicesTotal = additionalServices.reduce((acc, service) => acc + service.price, 0);
    const totalAmount = roomCharges + servicesTotal;

    const factura = new Factura({
      reservation: reservacion._id,
      user: usuario._id,
      hotel: reservacion.hotelId._id,
      roomCharges,
      additionalServices,
      totalAmount,
      issuedAt: new Date()
    });

    await factura.save();

    const facturaNum = factura._id.toString();
    const fileName = `factura-${facturaNum}.pdf`;
    const dir = path.join(path.resolve(), 'public', 'uploads', 'facturas');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const filePath = path.join(dir, fileName);
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    
    doc.fontSize(18).text("Factura de Hotel", { align: "center" }).moveDown();
    doc.fontSize(12)
      .text(`Factura #: ${facturaNum}`)
      .text(`Fecha: ${new Date(factura.issuedAt).toLocaleDateString()}`)
      .text(`Hotel: ${reservacion.hotelId.name}`)
      .text(`Cliente: ${usuario.name}`)
      .text(`Email: ${usuario.email}`)
      .moveDown();


    doc.font("Helvetica-Bold").text("Cargos por Habitación", { underline: true });
    doc.font("Helvetica")
      .text(`Desde: ${new Date(reservacion.startDate).toLocaleDateString()}`)
      .text(`Hasta: ${new Date(reservacion.endDate).toLocaleDateString()}`)
      .text(`Total Habitación: Q${roomCharges.toFixed(2)}`)
      .moveDown();

  
    if (additionalServices.length > 0) {
      doc.font("Helvetica-Bold").text("Servicios Adicionales", { underline: true });
      additionalServices.forEach((service, i) => {
        doc.font("Helvetica").text(`${i + 1}. ${service.serviceName}: Q${service.price.toFixed(2)}`);
      });
      doc.moveDown();
    }


    doc.fontSize(14).text(`Monto Total: Q${totalAmount.toFixed(2)}`, { align: 'right' });

  
    doc.end();

    res.status(200).json({
      success: true,
      message: "Factura generada correctamente",
      factura
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error generando la factura",
      error: err.message
    });
  }
};

export const getPurchases = async (req, res) => {
  try {
    const usuario = req.user; 
    const facturas = await Factura.find({ user: usuario._id });

    if (!facturas || facturas.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No se encontraron compras."
      });
    }

    res.status(200).json({
      success: true,
      facturas
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error obteniendo las compras",
      error: err.message
    });
  }
};
