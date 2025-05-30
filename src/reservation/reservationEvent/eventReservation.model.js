import { Schema, model } from 'mongoose';

const eventReservationSchema = Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventoId: {
    type: Schema.Types.ObjectId,
    ref: 'Evento',
    required: true
  },
  cantidadPersonas: {
    type: Number,
    required: true,
    min: 1
  },
  serviciosAdicionales: {
    type: [String],
    default: []
  },
  precioTotal: {
    type: Number,
    required: true,
    min: 0
  },
  estado: {
    type: String,
    enum: ['confirmada', 'cancelada'],
    default: 'confirmada'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false,
  timestamps: true
});

export default model('EventReservation', eventReservationSchema);
