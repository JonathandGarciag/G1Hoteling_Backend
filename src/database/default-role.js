import Role from "../role/role.model.js";  

const createRoles = async () => {
    try {
        const roles = ["ADMIN_ROLE", "CLIENT_ROLE", "HOTEL_ROLE" ];

        for (const role of roles) {
            const existingRole = await Role.findOne({ role });

            if (!existingRole) {
                await Role.create({ role });
                console.log(`--> Rol ${role} creado correctamente.`);
            } 
        }
    } catch (error) {
        console.error("--> Error al crear los roles:", error.message);
    }
};  

export default createRoles;