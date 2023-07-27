const Router = require('express')
const router = new Router()
const {check} = require('express-validator')

const controller = require('../controllers/authController')


router.post('/registration', [
    check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    check('password', 'Пароль должен быть длиной не менее 8 и не более 32 символов').isLength({min: 8, max: 32})

], controller.registration)

router.post('/registration')
router.post('/login', controller.login)
router.get('/users', controller.getUsers)

module.exports = router