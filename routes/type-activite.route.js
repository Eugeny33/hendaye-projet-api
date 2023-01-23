const express = require('express');

const type_ActiviteController = require('../controllers/type-activite.controller');

// validation de l'authtentification
const authValidator = require('../utils/auth');
// validation du format des données 
const validator = require('../utils/validator');
const typeActiviteSchema = require('../models/type-activite');

const router = express.Router();

// route par défaut
router.route('/')
    .get(async (req, res) => { // methode http GET
        const type_activites = await type_ActiviteController.getAll(); // on recupere toutes les valeurs
        if (!type_activites) {
            res.status(404).json(); // on a rien trouvé donc code http 404
        }
        res.status(200).json(type_activites); // si OK on renvoi la liste des types d activités JSON et un code http 200
    })
    .put(authValidator.isAdmin()&&validator(typeActiviteSchema), async (req, res) => { // methode http PUT
        // si on est admin et si les données sont correctes
        const new_type_Activite = await type_ActiviteController.add(req.body); // ajout type activité

        if (!new_type_Activite) {
            res.status(404).json(); // KO code retour 404
        }
        res.status(201).json(new_type_Activite);// si OK on renvoi le type d activité en JSON et un code http 201
    }) 
;

// on un id on travaille sur un type d activité particuliers
router.route('/:id')
    .get(async (req, res) => { // methode http GET
        const type_Activite = await type_ActiviteController.getById(req.params.id); // on recupere un type d activité
        if (!type_Activite) {
            res.status(404).json(); // vide donc code retour 404
        }
        res.status(200).json(type_Activite); // si OK on renvoi le type d activité en JSON et un code http 200
    })
    .patch(authValidator.isAdmin()&&validator(typeActiviteSchema), async (req, res) => { // methode http PATCH
        // si admin et données OK
        const type_Activite = await type_ActiviteController.update(req.params.id, req.body); // on modifie e type activité
        if (!type_Activite) { // pas de type 
            res.status(404).json(); // code retour 404
        }
        res.status(202).json(type_Activite); // si OK on renvoi le type activité en JSON et un code http 202
    })
    .delete(authValidator.isAdmin(), async (req, res) => { // methode http DELETE
        const type_Activite = await type_ActiviteController.remove(req.params.id); // on supprime le type d activité dont l id est fourni
        if (!type_Activite) {
            res.status(404).json();
        }
        res.status(202).json();
    })
;

module.exports = router;