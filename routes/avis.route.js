const express = require('express');

const avisController = require('../controllers/avis.controller');

const authValidator = require('../utils/auth');
// validation du format des données 
const validator = require('../utils/validator');
const avisSchema = require('../models/avis');

const router = express.Router();

router.route('/')
    .get(async (req, res) => { // méthode GET http on récupere tous les avis
        const avis = await avisController.getAll();
        if (!avis) { // il n'y en a pas 
            res.status(404).json(); // on renvoi une 404 HTTP
        }
        res.status(200).json(avis); // on en trouve on renvoie la liste et un code retour HTTP 200
    })
     .put(validator(avisSchema)&&authValidator.isAuth(), async (req, res) => {
        // on est authentifié on peut saisir un commentaire
        // on va récuperer l identidiant de l'utilisateur connecté et modifier la requete pour que l'avis lui soit associé
        var avis = req.body;

        if ( req.auth) {
            if (req.auth.id) {
                // on recupere l identifiant de l'utilisateur et on le stocke dans l'avis
                avis.id_User = req.auth.id;
            }
        }

        // on essaye de créer l avis
        const new_avis = await avisController.add(avis);


        if (!new_avis) { // si new_avis n existe pas alors la création a échoué
            res.status(404).json(); // on renvoi un http 404
        }
        res.status(201).json(new_avis); // tout est OK on renvoi l avis et un code http 200
    })
;

// on a un id d avis.
router.route('/:id')
    .get(async (req, res) => { // sue la méthode http GET on essaye de récupérer cet avis
        const avis = await avisController.getById(req.params.id); 
        if (!avis) { // pas d avis avec cet id
            res.status(404).json(); // on renvoi un HTTP 404
        }
        res.status(200).json(avis); // tout est OK avis + code HTTP 200
    })
    .patch(authValidator.isAdmin()&&validator(avisSchema), async (req, res) => { // méthode http PATCH
        // modif uniquement par les administrateurs et si les données fournies sont correcte
        const avis = await avisController.update(req.params.id, req.body);
        if (!avis) { // pas d'avis alors l id est incorrect ou la modification a échouée
            res.status(404).json(); // on renvoi une code http 404
        }
        res.status(202).json(avis); // tout est OK avis + code HTTP 200
    })
    .delete(authValidator.isAuth(), async (req, res) => {
        // si on est authentifié on peut supprimer 
        // attention il faudra faire uniquement les siens ....
        // dans l'interface on autorise uniquement les administrateur qui eux peuvent tout supprimer
        const avis = await avisController.remove(req.params.id);
        if (!avis) { // avis inexistant
            res.status(404).json();
        }
        res.status(202).json(); // code HTTP 202
    })
;

router.route('/activite/:id')
    .get(async (req, res) => { // méthode http GET 
        const avis = await avisController.getByActiviteId(req.params.id); // on renvoi la liste des avis d'une activité
        if (!avis) { // pas d'avis 
            res.status(404).json(); // code retour 404
        }
        res.status(200).json(avis); // on a des avis on renvoi la liste et un code http 200
    })
module.exports = router;