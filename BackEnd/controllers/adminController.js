import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendAlertEmail } from '../services/emailService.js';

// --- Gestion des profils ---
export const getMyProfile = async (req, res) => {
    try {
        const [admins] = await pool.query("SELECT id, login, prenom, nom, email, avatar_url FROM admins WHERE id = ?", [req.admin.id]);
        if (admins.length === 0) {
            return res.status(404).json({ msg: "Administrateur non trouvé." });
        }
        res.json(admins[0]);
    } catch (err) { res.status(500).json({ msg: "Erreur Serveur." }); }
};

export const updateMyProfile = async (req, res) => {
    const { prenom, nom, email, login } = req.body;
    let avatar_url = req.body.avatar_url; 

    if (req.file) {
        avatar_url = `/uploads/${req.file.filename}`;
    }

    try {
        const sql = "UPDATE admins SET prenom = ?, nom = ?, email = ?, login = ?, avatar_url = ? WHERE id = ?";
        await pool.query(sql, [prenom, nom, email, login, avatar_url, req.admin.id]);
        res.json({ msg: "Profil mis à jour avec succès." });
    } catch (err) { res.status(500).json({ msg: "Erreur Serveur." }); }
};

export const changeMyPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const [admins] = await pool.query("SELECT password FROM admins WHERE id = ?", [req.admin.id]);
        const admin = admins[0];

        const isMatch = await bcrypt.compare(oldPassword, admin.password);
        if (!isMatch) {
            return res.status(401).json({ msg: "L'ancien mot de passe est incorrect." });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await pool.query("UPDATE admins SET password = ? WHERE id = ?", [hashedNewPassword, req.admin.id]);
        
        res.json({ msg: "Mot de passe changé avec succès." });
    } catch (err) { res.status(500).json({ msg: "Erreur Serveur." }); }
};
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const [admins] = await pool.query("SELECT * FROM admins WHERE email = ?", [email]);
        if (admins.length === 0) {
            return res.json({ msg: "Si un compte est associé à cet e-mail, un lien de réinitialisation a été envoyé." });
        }
        const admin = admins[0];

        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 3600000); // Valid for 1 hour

        await pool.query("UPDATE admins SET reset_token = ?, reset_token_expires = ? WHERE id = ?", [resetToken, resetTokenExpires, admin.id]);
        
        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
        const emailSubject = "Réinitialisation de votre mot de passe";
        const emailHtml = `<p>Vous recevez cet e-mail car une demande de réinitialisation de mot de passe a été effectuée pour votre compte.</p>
                         <p>Veuillez cliquer sur le lien suivant pour choisir un nouveau mot de passe :</p>
                         <p><a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Réinitialiser le mot de passe</a></p>
                         <p>Ce lien expirera dans une heure.</p>
                         <p>Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer cet e-mail.</p>`;
        
        await sendAlertEmail(admin.email, emailSubject, emailHtml);
        
        res.json({ msg: "Si un compte est associé à cet e-mail, un lien de réinitialisation a été envoyé." });

    } catch (err) { 
        console.error("Forgot Password Error:", err);
        res.status(500).json({ msg: "Erreur Serveur." }); 
    }
};


export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const [admins] = await pool.query("SELECT * FROM admins WHERE reset_token = ? AND reset_token_expires > NOW()", [token]);
        if (admins.length === 0) {
            return res.status(400).json({ msg: "Le jeton de réinitialisation est invalide ou a expiré." });
        }
        const admin = admins[0];

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query("UPDATE admins SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?", [hashedPassword, admin.id]);

        res.json({ msg: "Le mot de passe a été réinitialisé avec succès." });

    } catch (err) { res.status(500).json({ msg: "Erreur Serveur." }); }
};

export const getAllAdmins = async (req, res) => {
    try {
        const [admins] = await pool.query("SELECT id, login, prenom, nom, email, avatar_url FROM admins ORDER BY nom ASC");
        res.json(admins);
    } catch (err) { res.status(500).json({ msg: "Erreur Serveur." }); }
};

export const createAdmin = async (req, res) => {
    const { login, prenom, nom, email } = req.body;
    let avatar_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!login || !prenom || !nom || !email) {
        return res.status(400).json({ msg: "Veuillez fournir tous les champs requis." });
    }
    try {
        const tempPassword = crypto.randomBytes(8).toString('hex');
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        const sql = "INSERT INTO admins (login, password, prenom, nom, email, avatar_url) VALUES (?, ?, ?, ?, ?, ?)";
        const [result] = await pool.query(sql, [login, hashedPassword, prenom, nom, email, avatar_url]);
        
        const emailSubject = "Votre compte administrateur a été créé";
        const emailHtml = `<h1>Bienvenue, ${prenom} !</h1><p>Votre compte administrateur a été créé.</p><p>Identifiants :</p><ul><li><strong>Login :</strong> ${login}</li><li><strong>Mot de passe :</strong> ${tempPassword}</li></ul>`;
        await sendAlertEmail(email, emailSubject, emailHtml);

        res.status(201).json({ msg: "Administrateur créé avec succès.", id: result.insertId });
    } catch (err) {
        res.status(500).json({ msg: "Erreur Serveur." });
    }
};

export const updateAdmin = async (req, res) => {
    const { id } = req.params;
    const { login, prenom, nom, email } = req.body;
 
    try {
        const sql = "UPDATE admins SET login = ?, prenom = ?, nom = ?, email = ? WHERE id = ?";
        await pool.query(sql, [login, prenom, nom, email, id]);
        res.json({ msg: "Administrateur mis à jour." });
    } catch(err) {
        res.status(500).json({ msg: "Erreur Serveur." });
    }
};

export const deleteAdmin = async (req, res) => {
    const { id } = req.params;
    if (req.admin.id == id) {
        return res.status(400).json({ msg: "Vous ne pouvez pas supprimer votre propre compte." });
    }
    try {
        await pool.query("DELETE FROM admins WHERE id = ?", [id]);
        res.json({ msg: "Administrateur supprimé." });
    } catch(err) {
        res.status(500).json({ msg: "Erreur Serveur." });
    }
};