const { register,login ,changePassword} = require('../controllers/authController.js')
const validation = require('../middlewares/validations.js')
const {registrationSchema,loginSchema} = require('../validations/authValidation.js')

const authRouter=require('express').Router()

authRouter.post('/register',validation(registrationSchema),register)
authRouter.post('/login',validation(loginSchema),login)
authRouter.put('/change-Password',changePassword)

module.exports=authRouter