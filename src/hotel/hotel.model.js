import { Schema, model } from 'mongoose';

const hotelSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        maxLength: [25, 'Max is 25 characters']
    },
    address: {
        type: String,
        required: [true, 'Address is required']
    },
    qualification: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['1', '2', '3', '4', '5']
    },
    amenities: {
        type: [String],
        default: []
    },
    roomPrice: {
        type: Number,
        required: [true, 'Room price is required'],
        min: [0, 'Price cannot be negative']
    },
    status: {
        type: Boolean,
        default: true,
    }
}, {
  timestamps: true,
  versionKey: false
});

export default model('Hotel', hotelSchema);
