import { Schema, model } from "mongoose";

const facturaSchema = new Schema({
    reservation: {
        type: Schema.Types.ObjectId,
        ref: "Reservacion",
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    hotel: {
        type: Schema.Types.ObjectId,
        ref: "Hotel",
        required: true
    },
    roomCharges: {
        type: Number,
        required: true
    },
    additionalServices: [{
        serviceName: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
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

export default model("Factura", facturaSchema);
