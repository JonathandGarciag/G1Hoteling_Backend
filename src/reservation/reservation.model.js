import { Schema, model } from 'mongoose';

const reservationSchema = Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El ID del usuario es obligatorio']
    },
    hotelId: {
      type: Schema.Types.ObjectId,
      ref: 'Hotel',
      required: [true, 'El ID del hotel es obligatorio']
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'El ID de la habitación es obligatorio']
    },
    startDate: {
      type: Date,
      required: [true, 'La fecha de inicio es obligatoria']
    },
    endDate: {
      type: Date,
      required: [true, 'La fecha de fin es obligatoria']
    },
    totalPrice: {
      type: Number,
      required: [true, 'El precio total es obligatorio'],
      min: [0, 'El precio debe ser positivo']
    },
    status: {
      type: String,
      enum: ['confirmada', 'cancelada', 'finalizada'],
      default: 'confirmada'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

export default model('Reservation', reservationSchema);
