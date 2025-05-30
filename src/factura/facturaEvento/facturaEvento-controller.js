import PDFDocument from "pdfkit";
import FacturaEvento from "./FacturaEvento.model.js";
import EventReservation from "../../reservation/reservationEvent/eventReservation.model.js";
import Evento from "../../eventos/eventos-model.js";
import fs from "fs";
import path from "path";

export const confirmEventInvoice = async (req, res) => {
  try {
    const usuario = req.user;
    const { eventReservationId, serviciosAdicionales = [] } = req.body;

    if (!eventReservationId) {
      return res.status(400).json({ success: false, message: "El ID de la reservación de evento es obligatorio." });
    }

    const reservacion = await EventReservation.findById(eventReservationId);
    if (!reservacion) {
      return res.status(404).json({ success: false, message: "Reservación de evento no encontrada." });
    }

    if (reservacion.estado !== "confirmada") {
      return res.status(400).json({ success: false, message: "La reservación debe estar confirmada para generar factura." });
    }

    const evento = await Evento.findById(reservacion.eventoId);
    if (!evento) {
      return res.status(404).json({ success: false, message: "Evento no encontrado." });
    }

    const serviciosTotal = serviciosAdicionales.reduce((acc, s) => acc + s.price, 0);
    const totalAmount = reservacion.precioTotal + serviciosTotal;

    const factura = new FacturaEvento({
      eventReservation: reservacion._id,
      user: usuario._id,
      evento: evento._id,
      cantidadPersonas: reservacion.cantidadPersonas,
      serviciosAdicionales,
      totalAmount,
      issuedAt: new Date()
    });

    await factura.save();

    const facturaNum = factura._id.toString();
    const fileName = `factura-evento-${facturaNum}.pdf`;
    const dir = path.join(path.resolve(), 'public', 'uploads', 'facturas_eventos');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const filePath = path.join(dir, fileName);
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(18).text("Factura de Evento", { align: "center" }).moveDown();
    doc.fontSize(12)
      .text(`Factura #: ${facturaNum}`)
      .text(`Fecha: ${new Date(factura.issuedAt).toLocaleDateString()}`)
      .text(`Evento: ${evento.titulo}`)
      .text(`Cliente: ${usuario.name}`)
      .text(`Email: ${usuario.email}`)
      .text(`Cantidad de personas: ${reservacion.cantidadPersonas}`)
      .moveDown();

    if (serviciosAdicionales.length > 0) {
      doc.font("Helvetica-Bold").text("Servicios Adicionales", { underline: true });
      serviciosAdicionales.forEach((s, i) => {
        doc.font("Helvetica").text(`${i + 1}. ${s.serviceName}: Q${s.price.toFixed(2)}`);
      });
      doc.moveDown();
    }

    doc.fontSize(14).text(`Monto Total: Q${totalAmount.toFixed(2)}`, { align: 'right' });

    doc.end();

    res.status(200).json({
      success: true,
      message: "Factura de evento generada correctamente",
      factura
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error generando la factura de evento",
      error: err.message
    });
  }
};
