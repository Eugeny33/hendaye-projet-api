const Joi = require('joi');

// type des donnnées d'un avis et les regles de gestion de base
const schema = Joi.object().keys({
    etoiles: Joi.number().required(),
    commentaire: Joi.string(),
    id_User: Joi.number(),
    id_Activite: Joi.number(),
});

module.exports = schema;