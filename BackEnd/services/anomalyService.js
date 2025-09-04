import pool from '../config/db.js';
import { sendAlertEmail } from './emailService.js';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Cette fonction est le cœur du moteur de détection.
 * Elle est conçue pour être appelée automatiquement par une tâche planifiée (cron job).
 */
export const runAnomalyScan = async () => {
    console.log(`[${new Date().toLocaleTimeString('fr-FR')}] Démarrage du scan d'anomalies...`);
    try {
        const newAnomaliesForEmail = [];

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
                    newAnomaliesForEmail.push(anomaly);
                }
            }
        }

        if (newAnomaliesForEmail.length > 0) {
            const [admins] = await pool.query("SELECT email FROM admins");
            if (admins.length === 0) {
                console.log("Anomalies détectées, mais aucun admin à notifier.");
                return;
            }

            const recipientList = admins.map(admin => admin.email).join(', ');
            let emailHtmlBody = `<h1>Alerte de Sécurité</h1><p>De nouvelles menaces ont été détectées automatiquement sur la plateforme :</p>`;
            emailHtmlBody += `<h3>Tentatives de Force Brute Détectées</h3><ul>`;
            newAnomaliesForEmail.forEach(a => {
                emailHtmlBody += `<li>IP: <strong>${a.ip_address}</strong> (${a.country_name || 'Inconnu'}) - <strong>${a.failed_attempts}</strong> tentatives échouées.</li>`;
            });
            emailHtmlBody += `</ul><p>Veuillez consulter le journal de sécurité pour plus de détails.</p>`;

            await sendAlertEmail(recipientList, "⚠️ Alerte de Sécurité : Nouvelles Menaces Détectées !", emailHtmlBody);
        }

        console.log(`[${new Date().toLocaleTimeString('fr-FR')}] Scan terminé. ${newAnomaliesForEmail.length} nouvelle(s) anomalie(s) trouvée(s).`);

    } catch (err) {
        console.error("Erreur durant le scan automatique d'anomalies:", err);
    }
};
