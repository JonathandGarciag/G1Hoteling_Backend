import { Schema, model } from "mongoose";

const eventoSchema = new Schema(
  {
    hotelId: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    usuarioId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    fechaInicio: {
      type: Date,
      required: true,
    },
    fechaFin: {
      type: Date,
      required: true,
    },
    capacidad: {
      type: Number,
      required: true,
    },
    recursosAdicionales: {
      type: [String],
      default: [],
    },
    estado: {
      type: String,
      enum: ["programado", "cancelado", "completado"],
      default: "programado",
    },
    image: {
      type: String,
      default: "",
    },
    precio: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Evento", eventoSchema);
