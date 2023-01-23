// on récupere tout les élémentd nécessaire

const express = require('express');
const jwt = require('jsonwebtoken'); // utilitaire pour coder en JWT
const userController = require('../controllers/user.controller');
const userSchema = require('../models/user'); // donnees pour créer des utilisatreurs
const signSchema = require('../models/sign'); // données pour s authentifier
const validator = require('../utils/validator');
const config = require('../config'); // la configuration initiale pour se connecter à la base de donénes
const loginValidator = require('../utils/auth'); // composant pour valider l authentification


const router = express.Router();

// on s authentifie
router.route('/')
    .post(validator(userSchema), async (req, res) => {
        // Je vérifie si un utilisateur existe en base avec cet emil et mot de passe
        let user = await userController.getByEmailAndPassword(req.body);

        if (!user) {
            res.status(401).json({message: "Combinaison email/password incorrecte"});
        } else {
            // Je créé un JWT qui contient le mail, role, et id du user
            const token = jwt.sign({
                id: user.id,
                email: user.email,
                roles: user.roles
            }, config.jwtPass, { expiresIn: config.jwtExpireLength });
    
            res.json({
                access_token: token
            });
        }
    })
;

// creation d un utilisateur
router.route('/signup')
    .post(validator(signSchema), async (req, res) => { // on vérifie que les données ont correctes
        const user = await userController.getByEmail(req.body); // on vérifie si un utilisateur existe
        if (user) {
            res.status(400).json({message: "Un compte avec cet email existe déjà"});
        } else {
            // on essye de créer l'utilisateur
            const new_user = await userController.add(req.body);
            // on créé le token et on le signe avec JWT. il contient l id, le mail et les roles de l'utilisateur 
            const token = jwt.sign({
                id: new_user.id,
                email: new_user.email,
                roles: new_user.roles
            }, config.jwtPass, { expiresIn: config.jwtExpireLength });
    
            res.json({
                access_token: token
            });
        }
    })
;

// Verification si l'utilisateur conncecté est  administrateur
router.route('/isAdmin')
    .get(loginValidator.isAdmin(), async (req, res) => {
        var admin = true;
        res.status(200).json(admin);
    })
;

module.exports = router;