"use strict";

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validar-cant-peticiones.js'

import createAdmin from '../src/database/default-admin.js'
import createRoles from '../src/database/default-role.js'

import userRoutes from '../src/user/user.routes.js';
import authRoutes from '../src/auth/auth.routes.js';
import hotelRoutes from '../src/hotel/hotel.routes.js'

import roomRoutes from '../src/habitacion/room.routes.js';
import reservationRoutes from '../src/reservation/reservation.routes.js';

const middlewares = (app) => {
    app.use(express.urlencoded({extended: false}))
    app.use(cors())
    app.use(express.json())
    app.use(helmet())
    app.use(morgan('dev'))
    app.use(limiter)
} 

const routes = (app) => {
    app.use("/hoteling/vht/user", userRoutes)
    app.use("/hoteling/vht/auth", authRoutes)
    app.use("/hoteling/vht/hotel", hotelRoutes)
    app.use("/hoteling/vht/room", roomRoutes)
    app.use("/hoteling/vht/reservation", reservationRoutes)
}

const conectarDB = async () =>{
    try {
        await dbConnection();
        console.log("Conexion a la base de datos exitosa");
    } catch (error) {
        console.error('Error conectado ala base de datos', error);
        process.exit(1);
    }
}

export const initServer = async () =>{
    const app = express();
    const port = process.env.PORT || 3000;

    try {
        middlewares(app);
        conectarDB();
        routes(app);
        await createAdmin();  
        await createRoles(); 
        app.listen(port);
        console.log(`Server running on port ${port}`)
    } catch (err) {
        console.log(`Server init failed ${err}`);
    }
}