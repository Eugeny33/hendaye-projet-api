const Joi = require('joi');

// type des donnnées d'un activité et les regles de gestion de base
const schema = Joi.object().keys({
    id: Joi.string(),
    nom: Joi.string().required(),
    date: Joi.date().required(),
    resume: Joi.string(),
    type: Joi.number().required(),
    lieu: Joi.number().required()
});

module.exports = schema;