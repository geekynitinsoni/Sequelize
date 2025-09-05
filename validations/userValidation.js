const Joi = require("joi");

const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  createdBy: Joi.string().optional(),
  modifiedBy: Joi.string().optional(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(8).optional(),
  modifiedBy: Joi.string().optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

module.exports = { userSchema, updateUserSchema, loginSchema, registerSchema };
