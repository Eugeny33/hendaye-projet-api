const db = require('../utils/db');

//recupere toutes les activités
const getAll = async () => {
    const [activites, err] = await db.query("SELECT * FROM activites");
    return activites;
};

// recupération d'une activité
const getById = async (id) => {
    const [activite, err] = await db.query("SELECT activites.id, activites.date,activites.nom,activites.resume,activites.type, activites.lieu  FROM activites WHERE id = ?", [id]);
    if (!activite) {
        return null;
    }
    return activite[0];
};

// récupération de toutes les activités d'un certain type
const getByType = async (id) => {
    const [activite, err] = await db.query("SELECT * FROM activites WHERE type = ?", [id]);
    if (!activite) {
        return null;
    }
    return activite;
};

// ajout d'une activité en parametres on a les données 
const add = async (data) => {
    console.log(data.imageActivite);
    const [req, err] = await db.query("INSERT INTO activites (nom,date,resume,type,lieu) VALUES (?,?,?,?,?)", [data.nom,data.date,data.resume,data.type,data.lieu]);
    if (!req) {
        return null;
    }
    return getById(req.insertId);

};

// modification d'une activité si une des données n'est pas présente alors on conserve l'ancienne
const update = async (id, data) => {
    const activite = await getById(id);
    if (!activite) {
        return null;
    } else {
        const [req, err] = await db.query("UPDATE activites SET nom = ?, date = ?, resume = ? , type = ? , lieu = ?  WHERE id = ? LIMIT 1", 
        [
            data.nom || activite.nom, 
            data.date || activite.date,
            data.resume || activite.resume,
            data.type || activite.type,
            data.lieu || activite.lieu,
            id
        ]);
        if (!req) {
            return null;
        }
        return getById(id);
    } 
};

// suppression de l'acivité dont l'id est fourni en parametre 
const remove = async (id) => {
    const [req, err] = await db.query("DELETE FROM activites WHERE id = ? LIMIT 1", [id]);
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
    remove,
    getByType
};