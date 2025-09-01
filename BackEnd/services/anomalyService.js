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

        // --- Règle 1 : Détection de Tentatives de Force Brute ---
        // On cherche les IP avec 10 tentatives échouées ou plus sur les dernières 24h
        const bruteForceSql = `
            SELECT ip_address, COUNT(*) as failed_attempts, country_name, MAX(timestamp) as last_attempt
            FROM ip_check_logs
            WHERE status = 'Rejeté' AND timestamp > NOW() - INTERVAL 24 HOUR
            GROUP BY ip_address, country_name HAVING COUNT(*) >= 10;
        `;
        const [bruteForceAnomalies] = await pool.query(bruteForceSql);
        
        // Pour chaque anomalie potentielle trouvée, on vérifie si elle est vraiment nouvelle
        if (bruteForceAnomalies.length > 0) {
            for (const anomaly of bruteForceAnomalies) {
                // On insère l'anomalie seulement s'il n'en existe pas déjà une pour cette IP au cours du dernier jour
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
                
                // Si une ligne a été ajoutée, cela signifie que c'est une nouvelle menace à signaler
                if (result.affectedRows > 0) {
                    newAnomaliesForEmail.push(anomaly);
                }
            }
        }
        
        // --- On pourra ajouter d'autres règles de détection ici ---


        // --- Envoi de l'e-mail d'alerte si de nouvelles menaces ont été trouvées ---
        if (newAnomaliesForEmail.length > 0) {
            
            // 1. Récupérer la liste de tous les e-mails des administrateurs
            const [admins] = await pool.query("SELECT email FROM admins");
            if (admins.length === 0) {
                console.log("Anomalies détectées, mais aucun admin à notifier.");
                return;
            }
            const recipientList = admins.map(admin => admin.email).join(', ');

            // 2. Construire le corps de l'e-mail
            let emailHtmlBody = `<h1>Alerte de Sécurité</h1><p>De nouvelles menaces ont été détectées automatiquement sur la plateforme :</p>`;
            
            emailHtmlBody += `<h3>Tentatives de Force Brute Détectées</h3><ul>`;
            newAnomaliesForEmail.forEach(a => {
                emailHtmlBody += `<li>IP: <strong>${a.ip_address}</strong> (${a.country_name || 'Inconnu'}) - <strong>${a.failed_attempts}</strong> tentatives échouées.</li>`;
            });
            emailHtmlBody += `</ul><p>Veuillez consulter le journal de sécurité pour plus de détails.</p>`;

            // 3. Envoyer l'e-mail à tous les administrateurs
            await sendAlertEmail(recipientList, "⚠️ Alerte de Sécurité : Nouvelles Menaces Détectées !", emailHtmlBody);
        }

        console.log(`[${new Date().toLocaleTimeString('fr-FR')}] Scan terminé. ${newAnomaliesForEmail.length} nouvelle(s) anomalie(s) trouvée(s).`);

    } catch (err) {
        console.error("Erreur durant le scan automatique d'anomalies:", err);
    }
};