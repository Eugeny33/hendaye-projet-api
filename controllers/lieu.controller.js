const db = require('../utils/db');

// recuperation de tous les lieux 
const getAll = async () => {
    const [lieux, err] = await db.query("SELECT * FROM lieu");
    return lieux;
};

// recuperation d'un lieu dont l'id est fourni en parametre
const getById = async (id) => {
    const [lieu, err] = await db.query("SELECT * FROM lieu WHERE id_Lieu = ?", [id]);
    if (!lieu) {
        return null;
    }
    return lieu[0];
};

// ajout d'un lieu les données sont fournies en parametre
const add = async (data) => {
    const [req, err] = await db.query("INSERT INTO lieu (nom,numero,rue,codePostal,ville,description) VALUES (?,?,?,?,?,?)", [data.nom,data.numero,data.rue,data.codePostal,data.ville,data.description]);
    if (!req) {
        return null;
    }
    return getById(req.insertId);

};

// modification d'un lieu si une des données n'est pas présente alors on conserve l'ancienne
const update = async (id, data) => {
    const lieu = await getById(id);
    if (!lieu) {
        return null;
    } else {
        const [req, err] = await db.query("UPDATE lieu SET nom = ?, numero = ?, rue = ? , codePostal = ? , ville = ? , description = ? WHERE id_Lieu = ? LIMIT 1", 
        [
            data.nom || lieu.nom, 
            data.numero || lieu.numero,
            data.rue || lieu.rue,
            data.codePostal || lieu.codePostal,
            data.ville || lieu.ville,
            data.description || lieu.description,
            id
        ]);
        if (!req) {
            return null;
        }
        return getById(id);
    } 
};

// Suppression d'un lieu dont l id est en parametre
const remove = async (id) => {
    const [req, err] = await db.query("DELETE FROM lieu WHERE id_Lieu = ? LIMIT 1", [id]);
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