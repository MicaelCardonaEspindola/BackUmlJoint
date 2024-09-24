import bcrypt from "bcrypt"; 
import jwt from "jsonwebtoken"; 
import {obtenerUsuarioPorSuCarnet} from "../../components/user/user.models.js";

export const verifyToken = async (token) => {
  try {
    return jwt.verify(token, process.env.SECRET_KEY_TOKEN)
  } catch (error) {
    return null
  }

}
export const loginUser = async (req, res) => {
    let { ci, contrasena } = req.body;
    ci = ci?.toLowerCase().trim() ; 
    const result = await obtenerUsuarioPorSuCarnet(ci);
    if (!!!result) {
      return res.status(404).json({ message: "El usuario no se encontro!" , success:false}); // Not Found
    }
    try {
      const checkPassword = await bcrypt.compare(contrasena, result.contrasena);

      if (!checkPassword) {
        return res.status(401).json({ message: "contrasena incorrecta!" ,  success:false}); // Unauthorized
      }

      const token = jwt.sign(
        { carnet: result.ci,
          cargo: result.cargo },
        process.env.SECRET_KEY_TOKEN,
        {
          expiresIn: "48h",
        }
      );
      return res.status(200).json({
             message: "inicio de sesión con éxito!", 
             token ,
             success:true , 
             data: {
                ci: result.ci,
                nombre:result.nombre,
                telefono:result.telefono, 
                id_rol : result.id_rol, 
                cargo: result.cargo,
                } 
            });

    } catch (error) {
      return res.status(500).json({ message: error.message ,success:false}); // Internal Server Error
    }
  };
  