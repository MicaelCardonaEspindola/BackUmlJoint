import { verifyToken } from "../services/auth/auth.controllers.js"



 export const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ').pop()
    const tokenData = await verifyToken(token)
    if (tokenData.carnet) {
      next()
    } else {
      res.status(400)
      res.send({ error: 'Acceso restringido para este usuario' })
    }

  } catch (error) {
   console.log(error)
   res.status(400)
   res.send({ error: 'Acceso restringido para este usuario' })
  }

}

