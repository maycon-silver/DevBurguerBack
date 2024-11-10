import * as Yup from 'yup'
import User from '../models/User'
import jwt from 'jsonwebtoken'
import auth from '../../config/auth'

class SessionController{
    async store(request, response){
        const schema = Yup.object({
            email: Yup.string().email().required(),
            password: Yup.string().min(6).required()
        })

        const isvalid = await schema.isValid(request.body)

        const emailOrPasswordIncorrect = () => {
            return response.status(401).json({error:'Seu Email ou senha }esta incorreto'})
        }
        
        if(!isvalid){
           return emailOrPasswordIncorrect()
        }


        const {email, password} = request.body

        const user = await User.findOne({
            where:{
                email,
            }
        })

        if(!user){
            return emailOrPasswordIncorrect()
        }

        const isSamePassword = await user.checkPassword(password)

        if(!isSamePassword){
            return emailOrPasswordIncorrect()
        }


        return response.status(201).json({
            id: user.id,
            name: user.name,
            email,
            admin: user.admin,
            token: jwt.sign({id: user.id, name: user.name},auth.secret,{
                expiresIn: auth.expiresIn
            })
        })
    }
}


export default new SessionController();