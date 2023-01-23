const Joi = require('joi');

// type des donnnées pour la connexion au site et les regles de gestion de base
const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
});

module.exports = schema;