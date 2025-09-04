import pool from '../config/db.js';
import { sendAlertEmail } from '../services/emailService.js';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Cette fonction est utilisée manuellement via une route API (scan manuel)
 */
export const scanAndSaveAnomalies = async (req, res) => {
    try {
        const newAnomaliesForEmail = await detectAndInsertAnomalies();
        if (newAnomaliesForEmail.length > 0) {
            await notifyAdmins(newAnomaliesForEmail);
        }
        res.status(200).json({ msg: "Scan terminé." });
    } catch (err) {
        console.error("Erreur Serveur durant le scan d'anomalies:", err);
        res.status(500).json({ msg: "Erreur Serveur." });
    }
};

/**
 * Cette fonction est utilisée automatiquement par une tâche planifiée (cron)
 */
export const runAnomalyScan = async () => {
    console.log(`[${new Date().toLocaleTimeString('fr-FR')}] Démarrage du scan d'anomalies...`);
    try {
        const newAnomaliesForEmail = await detectAndInsertAnomalies();
        if (newAnomaliesForEmail.length > 0) {
            await notifyAdmins(newAnomaliesForEmail);
        }
        console.log(`[${new Date().toLocaleTimeString('fr-FR')}] Scan terminé. ${newAnomaliesForEmail.length} nouvelle(s) anomalie(s) trouvée(s).`);
    } catch (err) {
        console.error("Erreur durant le scan automatique d'anomalies:", err);
    }
};

/**
 * Détecte les anomalies, les insère en base si elles sont nouvelles
 */
const detectAndInsertAnomalies = async () => {
    let newAnomalies = [];

    const bruteForceSql = `
        SELECT ip_address, COUNT(*) as failed_attempts, country_name, MAX(timestamp) as last_attempt
        FROM ip_check_logs
        WHERE status = 'Rejeté' AND timestamp > NOW() - INTERVAL 24 HOUR
        GROUP BY ip_address, country_name HAVING COUNT(*) >= 10;
    `;
    const [bruteForceAnomalies] = await pool.query(bruteForceSql);

    for (const anomaly of bruteForceAnomalies) {
        const insertSql = `
            INSERT INTO anomalies (
                anomaly_type,
                details,
                status,
                ip_address,
                failed_attempts,
                country_name,
                last_attempt
            )
            SELECT 'BRUTE_FORCE', ?, 'NEW', ?, ?, ?, ?
            WHERE NOT EXISTS (
                SELECT 1 FROM anomalies 
                WHERE ip_address = ? 
                AND timestamp > NOW() - INTERVAL 1 DAY
            );
        `;
        const [result] = await pool.query(insertSql, [
            JSON.stringify(anomaly),                 
            anomaly.ip_address,
            anomaly.failed_attempts,
            anomaly.country_name || 'Unknown',
            anomaly.last_attempt,
            anomaly.ip_address                       
        ]);

        if (result.affectedRows > 0) {
            newAnomalies.push(anomaly);
        }
    }

    return newAnomalies;
};

/**
 * Envoie un e-mail aux administrateurs pour les nouvelles anomalies
 */
const notifyAdmins = async (anomalies) => {
    const [admins] = await pool.query("SELECT email FROM admins");
    if (admins.length === 0) {
        console.log("Anomalies détectées, mais aucun admin à notifier.");
        return;
    }

    const recipientList = admins.map(a => a.email).join(', ');
    let emailHtmlBody = `<h1>Alerte de Sécurité</h1><p>De nouvelles menaces ont été détectées :</p><h3>Tentatives de Force Brute</h3><ul>`;
    anomalies.forEach(a => {
        emailHtmlBody += `<li>IP: <strong>${a.ip_address}</strong> (${a.country_name || 'Inconnu'}) - ${a.failed_attempts} tentatives.</li>`;
    });
    emailHtmlBody += `</ul><p>Consultez le journal des anomalies pour plus de détails.</p>`;

    await sendAlertEmail(recipientList, "⚠️ Alerte de Sécurité : Nouvelles Menaces Détectées !", emailHtmlBody);
};

/**
 * Retourne toutes les anomalies
 */
export const getAnomalies = async (req, res) => {
    try {
        const sql = "SELECT * FROM anomalies ORDER BY timestamp DESC";
        const [anomalies] = await pool.query(sql);
        res.json(anomalies);
    } catch (err) {
        res.status(500).json({ msg: "Erreur Serveur." });
    }
};

/**
 * Marque une anomalie comme traitée
 */
export const acknowledgeAnomaly = async (req, res) => {
    const { id } = req.params;
    try {
        const sql = "UPDATE anomalies SET status = 'ACKNOWLEDGED' WHERE id = ?";
        const [result] = await pool.query(sql, [id]);
        if(result.affectedRows === 0) {
            return res.status(404).json({ msg: "Anomalie non trouvée." });
        }
        res.json({ msg: "Anomalie marquée comme traitée." });
    } catch (err) {
        res.status(500).json({ msg: "Erreur Serveur." });
    }
};
