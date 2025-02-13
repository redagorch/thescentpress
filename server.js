const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const FILE_PATH = "data.csv";

// Vérifier si le fichier CSV existe, sinon le créer avec des en-têtes
if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, "Nom,Prénom,Email,Adresse,Téléphone\n");
}

// Route pour recevoir les données du formulaire
app.post("/save", (req, res) => {
    const { nom, prenom, email, adresse, telephone } = req.body;
    if (!nom || !prenom || !email || !adresse || !telephone) {
        return res.status(400).send("Tous les champs sont requis.");
    }

    const csvLine = `${nom},${prenom},${email},${adresse},${telephone}\n`;

    // Ajouter les données au fichier CSV
    fs.appendFile(FILE_PATH, csvLine, (err) => {
        if (err) {
            return res.status(500).send("Erreur lors de l'enregistrement.");
        }
        res.send("Données enregistrées !");
    });
});

// Lancer le serveur sur le port 3000
app.listen(3000, () => console.log("Serveur lancé sur http://localhost:3000"));
