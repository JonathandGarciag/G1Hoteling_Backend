import { Schema, model } from 'mongoose';

const availabilitySchema = Schema({
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  }
}, { _id: false });

const roomSchema = Schema({
  hotelId: {
    type: Schema.Types.ObjectId,
    ref: 'Hotel',
    required: [true, 'Hotel ID is required']
  },
  roomType: {
    type: String,
    required: [true, 'Room type is required'],
    enum: ['simple', 'doble', 'suite']
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Minimum capacity is 1']
  },
  pricePerNight: {
    type: Number,
    required: [true, 'Price per night is required'],
    min: [0, 'Price must be at least 0']
  },
  availability: {
    type: [availabilitySchema],
    default: []
  },
  status: {
    type: String,
    enum: ['disponible', 'reservada', 'en mantenimiento'],
    default: 'disponible'
  },
  image: {
    type: String,
    default: ""
  },
  amenities: {
    type: [String],
    default: []
  }
}, {
  timestamps: true,
  versionKey: false
});

export default model('Room', roomSchema);
