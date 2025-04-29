import argon2 from "argon2";
import Admin from "../user/user.model.js";

const createAdmin = async () => {
    try {
        const aEmail = "jgarciadmin@gmail.com";
        const aPassword = "12345678";

        const existingAdmin = await Admin.findOne({ email: aEmail });

        if (!existingAdmin) {
            const encryptedPassword = await argon2.hash(aPassword);

            const aUser = new Admin({
                name: "Jonathan Gutierrez",
                username: "AdminJhonny",
                email: aEmail,
                password: encryptedPassword,
                role: "ADMIN_ROLE",
                status: true
            });

            await aUser.save();
            console.log("--> Usuario ADMIN creado correctamente.");
        } else {
            console.log("--> Ya existe un usuario ADMIN.");
        }
    } catch (err) {
        console.error("--> Error al crear el ADMIN por defecto:", err);
    }
};

export default createAdmin;