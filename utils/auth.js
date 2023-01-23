const config = require('../config');
const jwt = require('jsonwebtoken');

// méthode permettant de savoir si un utilisateur est authentifié
// elle se base sur le header authorisation en validant le token jwt qu'il contient
const isAuth = () => {
    return (req, res, next) => {
        // Je lis les headers
        const header = req.headers.authorization;
        
        if (!header) {
            res.status(401).json({message: "Vous devez être connecté"});
        }
        else {
            const access_token = header.split(" ")[1];

            // Le header doit être de la forme :
            // "Authorization: Bearer {token}"

            // Je vérifie si le token est toujours valide, et si c'est mon serveur qui l'a 
            // signé (grace au mot de passe jwt dans le config.json)
            jwt.verify(access_token, config.jwtPass, (err, decodedToken) => {
                if (err) {
                    res.status(401).json({message: "JWT invalide"});
                } else {
                    // Je rajoute le token décodé (i.e. les données de l'utilisateur) dans la requete
                    req.auth = decodedToken;
    
                    // next = je permet de passer a la suite de la requete
                    next();
                }
            });            
        }

    }
};

// méthode permettant de savoir si un utilisateur est un administraeur
// pour cela on vérifie s'il est authentifé ET s'il a le role admin
// elle se base sur le header authorisation en validant le token jwt qu'il contient
const isAdmin = () => {
    return (req, res, next) => {
        const header = req.headers.authorization;
        if (!header) {
            res.status(401).json({message: "Vous devez être connecté"});
        }
        else {
            const access_token = header.split(" ")[1];

            jwt.verify(access_token, config.jwtPass, (err, decodedToken) => {
                if (err) {
                    res.status(401).json({message: "JWT invalide"});
                } else if (decodedToken.roles == 'admin') {
                    // Je rajoute le token décodé (i.e. les données de l'utilisateur) dans la requete
                    req.auth = decodedToken;
                    // Je valide que si le user a le role "admin" dans son token
                    next();
                } else {
                    res.status(401).json({message: "Vous devez être administrateur"});
                }
            });
        }

    }
};

// on rend toutes les fonctions utilisables à l'extérieure
module.exports = {
    isAuth,
    isAdmin
};