const db = require('../utils/db');
// recupération de tous les types d'activité
const getAll = async () => {
    const [type_activites, err] = await db.query("SELECT * FROM type_activite");
    return type_activites;
};

// récupération d'un type d'activité dont l id est en parametre
const getById = async (id) => {
    const [type_activite, err] = await db.query("SELECT * FROM type_activite WHERE id_Activite = ?", [id]);
    if (!type_activite) {
        return null;
    }
    return type_activite[0];
};
// ajout d'un type d'activité en parametres on a les données
const add = async (data) => {
    const [req, err] = await db.query("INSERT INTO type_activite (nom) VALUES (?)", [data.nom]);
    if (!req) {
        return null;
    }
    return getById(req.insertId);

};

// modification d'un type d'activité si une des données n'est pas présente alors on conserve l'ancienne
const update = async (id, data) => {
    const type_activite = await getById(id);
    if (!type_activite) {
        return null;
    } else {
        const [req, err] = await db.query("UPDATE type_activite SET nom = ? WHERE id_Activite = ? LIMIT 1", 
        [
            data.nom || type_activite.nom, 
            id
        ]);
        if (!req) {
            return null;
        }
        return getById(id);
    } 
};
// suppression du type d'activité dont l id est fournie en parametre
const remove = async (id) => {
    const [req, err] = await db.query("DELETE FROM type_activite WHERE id_Activite = ? LIMIT 1", [id]);
    if (!req) {
        return false;
    }
    return true;
};

// on rend toutes les fonctions utilisables à l'extérieure
module.exports = {
    getAll,
    getById,
    add,
    update,
    remove
};