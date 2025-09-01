import pool from '../config/db.js';
import { sendAlertEmail } from '../services/emailService.js';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const scanAndSaveAnomalies = async (req, res) => {
    try {
        let newAnomaliesForEmail = [];

        const bruteForceSql = `
            SELECT ip_address, COUNT(*) as failed_attempts, country_name, MAX(timestamp) as last_attempt
            FROM ip_check_logs
            WHERE status = 'Rejeté' AND timestamp > NOW() - INTERVAL 24 HOUR
            GROUP BY ip_address, country_name HAVING COUNT(*) >= 10;
        `;
        const [bruteForceAnomalies] = await pool.query(bruteForceSql);
        
        if (bruteForceAnomalies.length > 0) {
            for (const anomaly of bruteForceAnomalies) {
                const insertSql = `
                    INSERT INTO anomalies (anomaly_type, details, status)
                    SELECT 'BRUTE_FORCE', ?, 'NEW'
                    WHERE NOT EXISTS (
                        SELECT 1 FROM anomalies 
                        WHERE details->>'$.ip_address' = ? 
                        AND timestamp > NOW() - INTERVAL 1 DAY
                    );
                `;
                const [result] = await pool.query(insertSql, [JSON.stringify(anomaly), anomaly.ip_address]);
                
                if (result.affectedRows > 0) {
                    newAnomaliesForEmail.push(anomaly);
                }
            }
        }
        
        if (newAnomaliesForEmail.length > 0) {
            let emailHtmlBody = `<h1>Alerte de Sécurité</h1><p>De nouvelles menaces ont été détectées :</p><h3>Tentatives de Force Brute</h3><ul>`;
            newAnomaliesForEmail.forEach(a => {
                emailHtmlBody += `<li>IP: <strong>${a.ip_address}</strong> (${a.country_name || 'Inconnu'}) - ${a.failed_attempts} tentatives.</li>`;
            });
            emailHtmlBody += `</ul>`;
            await sendAlertEmail("⚠️ Alerte de Sécurité : Nouvelles Menaces Détectées !", emailHtmlBody);
        }

        res.status(200).json({ msg: "Scan terminé." });

    } catch (err) {
        console.error("Erreur Serveur durant le scan d'anomalies:", err);
        res.status(500).json({ msg: "Erreur Serveur." });
    }
};

export const getAnomalies = async (req, res) => {
    try {
        const sql = "SELECT * FROM anomalies ORDER BY timestamp DESC";
        const [anomalies] = await pool.query(sql);
        res.json(anomalies);
    } catch (err) {
        res.status(500).json({ msg: "Erreur Serveur." });
    }
};

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