import jwt from 'jsonwebtoken';

export const generarJWT = (uid = '') => {

    return new Promise((resolve, reject)=>{
        
        const payload = { uid };

        jwt.sign(
            payload,
            process.env.SECRETORPRIVATEKEY,
            {
                expiresIn: '4H'
            },
            (err, token) => {
                err ? (console.log(err), reject('No se pudo generar el token')) : resolve(token);
            }
        );

        
    }); 
}

export const generarJWTHotel = (payload = {}) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.SECRETORPRIVATEKEY,
      {}, 
      (err, token) => {
        err ? reject("No se pudo generar el token") : resolve(token);
      }
    );
  });
};
