import React, { useState, useEffect } from 'react';
import { getAnomalies, acknowledgeAnomaly } from '../../services/authService';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Icon } from '@iconify/react/dist/iconify.js';

const AnomalyDashboard = () => {
    const [anomalies, setAnomalies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const fetchAnomalies = async () => {
        try {
            setLoading(true);
            const res = await getAnomalies();
            setAnomalies(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            setError("Impossible de charger l'historique des anomalies.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnomalies();
        const interval = setInterval(fetchAnomalies, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleAcknowledge = async (id) => {
        await acknowledgeAnomaly(id);
        fetchAnomalies();
    };
    
    const filteredAnomalies = anomalies.filter(a => !statusFilter || a.status === statusFilter);

    const safeFormatDate = (dateString) => {
        try { return format(parseISO(dateString), 'dd MMMM yyyy, HH:mm:ss', { locale: fr }); } 
        catch (e) { return 'Date invalide'; }
    };

    return (
        <div className="card h-100 p-0">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                <div className="d-flex align-items-center flex-wrap gap-3">
                    <h5 className="mb-0">Journal de Sécurité</h5>
                    <select className="form-select form-select-sm w-auto" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="">Tous les statuts</option>
                        <option value="NEW">Nouveau</option>
                        <option value="ACKNOWLEDGED">Traité</option>
                    </select>
                </div>
                <span className="text-muted text-sm d-flex align-items-center gap-2">
                    <Icon icon="lucide:refresh-cw" className={loading ? 'animate-spin' : ''} />
                    Mise à jour auto.
                </span>
            </div>
            <div className="card-body p-24">
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="table-responsive">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr><th>Détecté le</th><th>Type d'Anomalie</th><th>Détails</th><th>Statut</th><th className="text-center">Action</th></tr>
                        </thead>
                        <tbody>
                            {loading && anomalies.length === 0 ? (<tr><td colSpan="5" className="text-center">Chargement...</td></tr>)
                            : filteredAnomalies.length === 0 ? (<tr><td colSpan="5" className="text-center">Aucune anomalie à afficher.</td></tr>)
                            : filteredAnomalies.map(anomaly => (
                                <tr key={anomaly.id}>
                                    <td>{safeFormatDate(anomaly.timestamp)}</td>
                                    <td>{anomaly.anomaly_type.replace(/_/g, " ")}</td>
                                    <td>
                                        {anomaly.anomaly_type === 'BRUTE_FORCE' && (() => {
                                                        let details = {};
                                                        try {
                                                            details = typeof anomaly.details === 'string' ? JSON.parse(anomaly.details) : anomaly.details;
                                                        } catch (e) {
                                                            return "Détails invalides.";
                                                        }
                                                        return `IP: ${details.ip_address} (${details.country_name || 'Inconnu'}) - ${details.failed_attempts} tentatives.`;
                                                    })()}
                                    </td>
                                    <td>
                                        <span className={`badge ${anomaly.status === 'NEW' ? 'bg-danger-light text-danger' : 'bg-success-light text-success'}`}>
                                            {anomaly.status}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        {anomaly.status === 'NEW' && (
                                            <button onClick={() => handleAcknowledge(anomaly.id)} className="btn btn-sm btn-outline-secondary">
                                                Marquer comme traité
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AnomalyDashboard;