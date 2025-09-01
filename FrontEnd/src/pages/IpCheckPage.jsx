import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { checkIpAddress } from '../services/authService';
import { Link } from 'react-router-dom';

const IpCheckPage = () => {
    const [ip, setIp] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const validateIpAddress = (ipToValidate) => {
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return ipRegex.test(ipToValidate);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResult(null);
        if (!validateIpAddress(ip)) {
            setValidationError('Please enter a valid IPv4 address format (e.g., 192.168.1.1).');
            return;
        }
        setValidationError('');
        setLoading(true);
        try {
            const response = await checkIpAddress(ip);
            setResult({ status: response.data.status, message: response.data.message, isError: false });
        } catch (error) {
            setResult({
                status: error.response?.data?.status || 'Erreur',
                message: error.response?.data?.message || 'Une erreur est survenue.',
                isError: true
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='d-flex align-items-center justify-content-center vh-100 bg-light'>
            <div className='card shadow-sm' style={{ width: '100%', maxWidth: '500px', borderRadius: '0.75rem' }}>
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <img src="assets/images/logintt.svg" alt="Logo" style={{ height: '50px' }} />
                        <h4 className='mt-3 mb-2'>Vérification d'Adresse IP</h4>
                        <p className='text-muted'>Entrez une adresse IP pour vérifier son statut.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group mb-1">
                            <span className="input-group-text"><Icon icon="lucide:network" /></span>
                            <input
                                type="text"
                                className={`form-control form-control-lg ${validationError ? 'is-invalid' : ''}`}
                                placeholder="ex: 172.17.94.72"
                                value={ip}
                                onChange={(e) => setIp(e.target.value)}
                                required
                            />
                        </div>
                        
                        {validationError && (<div className="text-danger small mb-3 ms-2">{validationError}</div>)}

                        <div className="d-grid mt-3">
                            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                {loading ? 'Vérification...' : 'Vérifier'}
                            </button>
                        </div>
                    </form>

                    {/* This is the new, styled alert section */}
                    {result && (
                        <div
                            className={`alert ${result.isError ? 'bg-danger-100 text-danger-600 border-danger-100' : 'bg-success-50 text-success-600 border-success-50'} px-24 py-11 mt-4 fw-semibold text-lg radius-8 d-flex align-items-center justify-content-between`}
                            role="alert"
                        >
                            <div className="d-flex align-items-center gap-3">
                                <Icon icon={result.isError ? 'lucide:shield-off' : 'lucide:shield-check'} className="text-xl" />
                                <div>
                                    <h6 className="mb-0">{result.status}</h6>
                                    <small>{result.message}</small>
                                </div>
                            </div>
                            <button onClick={() => setResult(null)} className={`remove-button ${result.isError ? 'text-danger-600' : 'text-success-600'} text-xxl line-height-1`}>
                                <Icon icon="iconamoon:sign-times-light" className="icon" />
                            </button>
                        </div>
                    )}
                </div>
                 <div className="card-footer bg-light border-0">
                    <div className="d-flex justify-content-between align-items-center text-muted small">
                        <span>{currentTime.toLocaleTimeString('fr-FR')}</span>
                        <Link to="/sign-in" className="btn btn-sm btn-outline-secondary">Accès Administrateur</Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default IpCheckPage;