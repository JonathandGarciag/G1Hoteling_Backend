import { Schema, model, Types  } from "mongoose";

const userSchema = Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        maxlength : [25, "Max is 25 characters"]
    },
    username: {
        type: String,
        required: [true, "Name is required"],
        maxlength: [25, "Cannot exceed 25 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {  
        type: String,
        required: [true, "Password is required"],
        minLength: 8
    },
    hotelId: {
        type: Types.ObjectId,
        ref: 'Hotel',
        default: null
    },
    role: {
        type: String,
        required: true,
        enum: ["ADMIN_ROLE", "CLIENT_ROLE", "HOTEL_ROLE"], 
        default: "CLIENT_ROLE"
    },
    status: {
        type: Boolean,
        default: true,
    },
},
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('User', userSchema);