import jwt from 'jsonwebtoken';

export const validateJsonWebToken = (token='') => {

 try {

  const {carnet} =jwt.verify(token, process.env.SECRET_KEY_TOKEN);
  return [true,carnet]
 } catch (error) {
  return [false,null]
 }

 }