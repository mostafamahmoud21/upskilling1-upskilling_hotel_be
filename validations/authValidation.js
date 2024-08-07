const Joi = require('joi');

const registrationSchema = Joi.object({
  email: Joi.string().email().required(), 
  name: Joi.string().required(),
  nationality: Joi.string().required(),
  personalId: Joi.string().required(),
  birthDate: Joi.date().iso().required(),
  gender: Joi.string().valid('Male', 'Female').required(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).required() 
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(), 
});

module.exports = {registrationSchema,loginSchema};
