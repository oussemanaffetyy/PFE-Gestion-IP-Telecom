import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/authService';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';

const DashboardLayer = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await getDashboardStats();
                setStats(response.data);
            } catch (error) {
                console.error("Error loading dashboard statistics:", error);
                setError('Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // A new StatCard sub-component inspired by your "Metrics" template
    const StatCard = ({ title, value = 0, icon, iconBgClass, link }) => (
        <div className="col">
            <Link to={link} className="text-decoration-none">
                <div className="card shadow-none border bg-gradient-start-1 h-100">
                    <div className="card-body p-20">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <p className="fw-medium text-primary-light mb-1">{title}</p>
                                <h4 className="mb-0">{value}</h4>
                            </div>
                            <div className={`w-50-px h-50-px ${iconBgClass} rounded-circle d-flex justify-content-center align-items-center`}>
                                <Icon icon={icon} className="text-white text-2xl mb-0" />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );

    if (loading) {
        return <div className="text-center p-5"><span className="spinner-border"></span><p className="mt-2">Chargement...</p></div>;
    }

    if (error) {
        return <div className="alert alert-danger mx-4">{error}</div>;
    }
    
    if (!stats) {
        return <p className="text-center p-5">Les données du tableau de bord n'ont pas pu être chargées.</p>;
    }

    return (
        <div className='container-fluid py-4'>
            {/* --- New "Metrics" Style Stat Cards --- */}
            <div className="row row-cols-xxl-5 row-cols-lg-3 row-cols-md-2 row-cols-1 gy-4 mb-4">
                <StatCard title="Régions" value={stats.totalRegions} icon="solar:map-bold-duotone" iconBgClass="bg-primary" link="/regions" />
                <StatCard title="Sites" value={stats.totalSites} icon="solar:server-bold-duotone" iconBgClass="bg-success" link="/sites" />
                <StatCard title="Adresses IP" value={stats.totalIpAddresses} icon="solar:route-bold-duotone" iconBgClass="bg-info" link="/ip-addresses" />
                <StatCard title="VLANs" value={stats.totalVlans} icon="solar:link-round-angle-bold-duotone" iconBgClass="bg-warning" link="/vlans" />
                <StatCard title="Alertes" value={stats.newAnomalies} icon="solar:shield-warning-bold-duotone" iconBgClass="bg-danger" link="/anomalies" />
            </div>

           
        </div>
    );
};

export default DashboardLayer;