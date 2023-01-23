const db = require('../utils/db');

const getAll = async () => {
    const [activites, err] = await db.query("SELECT * FROM avis");
    return activites;
};

// recuperation de tous les avis pour une activité dont l id est fourni en parametre
const getByActiviteId = async (id) => {
    // tous les avis pour une activité
    const [avis, err] = await db.query("SELECT avis.id, avis.etoiles, avis.commentaire, avis.id_Activite, users.email FROM avis, users WHERE avis.id_User = users.id AND id_Activite = ?", [id]);
    if (!avis) {
        return null;
    }
    return avis;
};

// récupération d'un avis dont l id est en parametre
const getById = async (id) => {
    const [avis, err] = await db.query("SELECT * FROM avis WHERE id = ?", [id]);
    if (!avis) {
        return null;
    }
    return avis[0];
};

// ajout d'un avis en parametres on a les données 
const add = async (data) => {
    const [req, err] = await db.query("INSERT INTO avis (etoiles,commentaire,id_Activite,id_User) VALUES (?,?,?,?)", [data.etoiles,data.commentaire,data.id_Activite,data.id_User]);
    if (!req) {
        return null;
    }
    return getById(req.insertId);

};
// modification d'un avis dont l id est fourni en parametre si une des données n'est pas présente alors on conserve l'ancienne
const update = async (id, data) => {
    const avis = await getById(id);
    if (!avis) {
        return null;
    } else {
        const [req, err] = await db.query("UPDATE avis SET etoiles = ?, commentaire = ?, id_Activite = ? , id_User = ? WHERE id = ? LIMIT 1", 
        [
            data.etoiles || avis.etoiles, 
            data.commentaire || avis.commentaire,
            data.id_Activite || avis.id_Activite,
            data.id_User || avis.id_User,
            id
        ]);
        if (!req) {
            return null;
        }
        return getById(id);
    } 
};
// suppression de l'avis dont l'id est fourni en parametre 
const remove = async (id) => {
    const [req, err] = await db.query("DELETE FROM avis WHERE id = ? LIMIT 1", [id]);
    if (!req) {
        return false;
    }
    return true;
};

// suppression des avis pour l'acivité dont l'id est fourni en parametre 
const removebyActivite = async (id_Activite) => {
    const [req, err] = await db.query("DELETE FROM avis WHERE id_Activite = ? LIMIT 1", [id_Activite]);
    if (!req) {
        return false;
    }
    return true;
};

// on rend toutes les fonctions utilisables à l'extérieure
module.exports = {
    getAll,
    getByActiviteId,
    getById,
    add,
    update,
    remove,
    removebyActivite
};