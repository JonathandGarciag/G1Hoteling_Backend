import {Schema, model} from 'mongoose';

const eventoSchema = new Schema({
  hotelId: {
    type: Schema.Types.ObjectId,
    ref: "Hotel",
    required: true
  },
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  fecha: {
    type: Date,
    required: true
  },
  serviciosIncluidos: {
    type: String,
    default: 0
  },
  estado: {
    type: String,
    enum: ["programado", "cancelado", "completado"],
    default: "programado"
  }
}, {
  timestamps: true
});

export default model("Evento", eventoSchema);
