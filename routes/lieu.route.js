const express = require('express');

const lieuController = require('../controllers/lieu.controller');

// element pour validation de l'authentification
const authValidator = require('../utils/auth');
// element pour validation du format des données 
const validator = require('../utils/validator');
const lieuSchema = require('../models/lieu');

const router = express.Router();

// route par défaut
router.route('/')
    .get(async (req, res) => { // méthode http GET 
        const lieux = await lieuController.getAll(); // on récupere la liste de tous les lieux
        if (!lieux) { // liste vide
            res.status(404).json(); // code retour http 404
        }
        res.status(200).json(lieux); // on a des valeurs on les renvoie avec un code http 200
    })
    .put(authValidator.isAdmin()&&validator(lieuSchema), async (req, res) => { // méthoe http PUT
        // si l utilisateur est admin et que les donneés sont correctes
        const new_lieu = await lieuController.add(req.body); // on essaye de créér un lieu

        if (!new_lieu) { // creation impossible
            res.status(404).json(); // code retour 404
        }
        res.status(201).json(new_lieu); // tout est OK On renvoi le nouveau lieu au format JSON et un code retour http 201
    })
;

// on est sur un id particuliers
router.route('/:id')
    .get(async (req, res) => { // méthode GET http
        const lieu = await lieuController.getById(req.params.id); // on recupere le lieu dont l id est en parametre
        if (!lieu) { // pas de lieu id incorrect ou erreur en base de donneés
            res.status(404).json(); // code retour http 404
        }
        res.status(200).json(lieu); // si OK on renvoi le lieu en JSON et un code http 200
    })
    .patch(authValidator.isAdmin()&&validator(lieuSchema), async (req, res) => { // methode http PATCH
        // si on est administrateur et que les donénes sont correctes 
        const lieu = await lieuController.update(req.params.id, req.body);  // on essaye de mettre à jour
        if (!lieu) { // si on obtient mise à jour impossible
            res.status(404).json(); // code retour 404
        }
        res.status(202).json(lieu); // si OK on renvoi le lieu en JSON et un code http 202
    })
    .delete(authValidator.isAdmin(), async (req, res) => { // methode http DELETE 
        // si on est admin alors on efface
        const lieu = await lieuController.remove(req.params.id);
        if (!lieu) {
            res.status(404).json();
        }
        res.status(202).json();
    })
;

module.exports = router;