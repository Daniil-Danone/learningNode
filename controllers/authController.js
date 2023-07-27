const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')

const User = require('../models/User')
const Role = require('../models/Role')
const { secret } = require('../configs/config')


const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json({message: 'Ошибки при валидации', errors})
            }
            const {username, password} = req.body
            const candidate = await User.findOne({username})
            if (candidate) {
                return res.status(400).json({message: 'Пользователь с такими именем уже существует'})
            }

            const hashPassword = bcrypt.hashSync(password, 7)

            const userRole = await Role.findOne({value: "USER"})
            const user = new User({username, password: hashPassword, roles: [userRole.value]})
            
            await user.save()
            return res.json({message: 'Пользователь успешно зарегистрирован'})

        } catch (error) {
            console.log(error)
            res.status(400).json({message: 'Registrarion Error'})
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body
            const user = await User.findOne({username})
            if (!user) {
                res.status(400).json({message: 'Пользователь не найден!'})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                res.status(400).json({message: 'Пароль не верен!'})
            }

            const token = generateAccessToken(user._id, user.roles)
            return res.json({token})

        } catch (error) {
            console.log(error)
            res.status(400).json({message: 'Login Error'}) 
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find()
            return res.json({users})
        } catch (error) {
            console.log(error)
            res.status(400).json({message: 'GetUsers Error'})
        }
    }
}

module.exports = new authController