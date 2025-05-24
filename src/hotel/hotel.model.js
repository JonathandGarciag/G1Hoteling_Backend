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
        type: Number,
        default: 0
    },
    votes: {
        type: [Number], 
        validate: {
            validator: (arr) => arr.every(v => ['1','2','3','4','5'].includes(v.toString())),
            message: 'Las calificaciones deben estar entre 1 y 5'
        },
        default: []
    },
    amenities: {
        type: [String],
        default: []
    },
    image: {
        type: String,
        default: ""
    },
    accessToken: {
        type: String,
        required: true,
        unique: true
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
