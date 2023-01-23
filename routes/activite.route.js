const express = require('express');

const activiteController = require('../controllers/activite.controller');

// element pour la validation de l'authtentification
const authValidator = require('../utils/auth');
// element pour validation du format des données 
const validator = require('../utils/validator');
const activiteSchema = require('../models/activite');

// router pour gérer les routes ( point d access ) de l'application
const router = express.Router();

// route par défaut
router.route('/')
    .get(async (req, res) => { // protocole http get
        const activites = await activiteController.getAll(); // on recupere toutes les activités
        if (!activites) {
            res.status(404).json(); // il n'y en a pas alors on renvoi un 404
        }
        res.status(200).json(activites); // on renvoi la liste et un code http 200
    })
    // on est sur la méthode http PUT
    .put(authValidator.isAdmin()&&validator(activiteSchema), async (req, res) => {   // on vérifise si l'utilisatuer est un admin et si les données sont correctes
        // on ajoute l'activié
        const new_activite = await activiteController.add(req.body);

        if (!new_activite) { // il y eu une erreur l activité n existe donc pas 
            res.status(404).json(); // on renvoi un 404 http
        }
        res.status(201).json(new_activite); // tout s est bien passé on renvoi un code 201
    })
;

// on un id d activité dans l'url
router.route('/:id')
// sur la méthode get on renvoir les informations de l'activité spécifiée par son id
    .get(async (req, res) => {
        const activite = await activiteController.getById(req.params.id);
        if (!activite) { // pas d activité avec son id
            res.status(404).json(); // on renvoie un http 404
        }
        res.status(200).json(activite); // tout est ok on renvoie l activité et un code http 200
    })
    .patch(authValidator.isAdmin()&&validator(activiteSchema), async (req, res) => {
        // on est sur la méthode http PATCH on vérifie si l'utilisateur est un admin et si les données sont correctes
        const activite = await activiteController.update(req.params.id, req.body); // on essaye de faire la modification
        if (!activite) { // pas d activite donc la modification a échouée 
            res.status(404).json(); // on renvoi un 404 http
        }
        res.status(202).json(activite); // on renvoie un 202 HTTP et l activité modifiée
    })
    .delete(authValidator.isAdmin(), async (req, res) => { // on est sur la méthode DELETE et on est admin
        const activite = await activiteController.remove(req.params.id); // on essaye de supprimer l'activité
        if (!activite) { // si rien de renvoyé alors elle n exsite pas/plus
            res.status(404).json();
        }
        res.status(202).json();
    })
;
// on recupere les activité d'un types particuliers
router.route('/type/:id')
    .get(async (req, res) => {
        const activite = await activiteController.getByType(req.params.id);  // on recupere la liste des activité du type sélectionné
        if (!activite) { // elle est vide
            res.status(404).json(); // code retour http 404
        }
        res.status(200).json(activite); // il ya des données on les renvoie avec un code 200
    })

module.exports = router;