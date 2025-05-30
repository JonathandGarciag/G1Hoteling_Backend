import { Schema, model } from 'mongoose';

const facturaEventoSchema = new Schema({
  eventReservation: {
    type: Schema.Types.ObjectId,
    ref: "EventReservation",
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  evento: {
    type: Schema.Types.ObjectId,
    ref: "Evento",
    required: true
  },
  cantidadPersonas: {
    type: Number,
    required: true
  },
  serviciosAdicionales: [{
    serviceName: String,
    price: Number
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  issuedAt: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
});

export default model("FacturaEvento", facturaEventoSchema);
