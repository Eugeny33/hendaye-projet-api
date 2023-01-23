const Joi = require('joi');
// type des donnnées d'un type d'activité et les regles de gestion de base
const schema = Joi.object().keys({
    id_Activite: Joi.number(),
    nom: Joi.string().required()
});

module.exports = schema;