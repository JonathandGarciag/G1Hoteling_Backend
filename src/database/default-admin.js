import argon2 from "argon2";
import Admin from "../user/user.model.js";

const createAdmin = async () => {
    try {
        const aEmail = "hoteleria@gmail.com";
        const aPassword = "12345678";

        const existingAdmin = await Admin.findOne({ email: aEmail });

        if (!existingAdmin) {
            const encryptedPassword = await argon2.hash(aPassword);

            const aUser = new Admin({
                name: "Hoteleria",
                username: "GrupoUno",
                email: aEmail,
                password: encryptedPassword,
                role: "ADMIN_ROLE",
                status: true
            });

            await aUser.save();
            console.log("--> Usuario ADMIN creado correctamente.");
        } 
    } catch (err) {
        console.error("--> Error al crear el ADMIN por defecto:", err);
    }
};

export default createAdmin;