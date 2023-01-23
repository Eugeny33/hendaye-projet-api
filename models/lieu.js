const Joi = require('joi');

// type des donnnées d'un lieu et les regles de gestion de base
const schema = Joi.object().keys({
    id_Lieu: Joi.number(),
    nom: Joi.string().required(),
    numero: Joi.number(),
    rue: Joi.string(),
    codePostal: Joi.number(),
    ville: Joi.string().required(),
    description: Joi.string().required()
});

module.exports = schema;