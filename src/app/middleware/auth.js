import jwt from 'jsonwebtoken'
import auth from '../../config/auth';

function authMiddleware(request, response, next){
 const authToken = request.headers.authorization;
 if(!authToken){
    return response.status(401).json({error:'token não providenciado'})
 }

const token = authToken.split(' ').at(1)
try{
    jwt.verify(token ,auth.secret, (err ,decoded)=>{
        if(err){
            throw new Error()
        }

        request.userId = decoded.id;
        request.userName = decoded.name

       
    })
}
catch(err){
    return response.status(401).json({error: 'Token é invalido'})
}

return next();
 
}

export default authMiddleware;