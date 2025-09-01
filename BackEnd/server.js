 const express = require('express');
const cors = require('cors');
require('dotenv').config();

 const { loginController } = require('./controllers/authController');
 const { connectBD } = require('./config/db');
const routerAuth = require('./routes/auth');

const app = express();
app.use(cors());
 app.use(express.json());

// // Connexion à la base de données
// connectBD();

 const PORT = process.env.PORT || 3001;

// app.get('/', (req, res) => {
//   res.json({ msg: 'Backend fonctionne !' });
// });

// // Route principale d'authentification
// app.use("/auth", routerAuth);

 //✅ BONUS : accès direct au contrôleur si tu veux testver sans routeur
 app.post("/auth/login", loginController)

app.listen(3001, () => {
 console.log(`✅ Serveur lancé sur le port ${PORT}`);
 });
