import mongoose from 'mongoose';

const RoleSchema = mongoose.Schema({
    role: {
        type: String,
        required: [true, 'El rol es obligatorio'],
    }
},
    {
    timestamps: true,
    versionKey: false   
    }
);

export default mongoose.model('Role', RoleSchema);