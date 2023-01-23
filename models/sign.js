const Joi = require('joi');

// type des donnnées nécessire à la création d'un utilisateur et les regles de gestion de base
const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    repassword: Joi.string().required().valid(Joi.ref('password')),
    prenom: Joi.string().required(),
    nom: Joi.string().required(),
});

module.exports = schema;