import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../services/authService';
import { Icon } from '@iconify/react/dist/iconify.js';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('Les mots de passe ne correspondent pas.');
        }
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const response = await resetPassword(token, password);
            setMessage(response.data.msg + " Vous allez être redirigé...");
            setTimeout(() => navigate('/sign-in'), 3000);
        } catch (err) {
            setError(err.response?.data?.msg || 'Une erreur est survenue.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="auth forgot-password-page bg-base d-flex flex-wrap">
            <div className="auth-left d-lg-block d-none">
                <div className="d-flex align-items-center flex-column h-100 justify-content-center">
                    <img src="/assets/images/reset-p.png" alt="Reset Password" />
                </div>
            </div>
            <div className="auth-right py-32 px-24 d-flex flex-column justify-content-center">
                <div className="max-w-464-px mx-auto w-100">
                    <div>
                        <Link to='/' className='mb-40 max-w-290-px d-inline-block'>
                            <img src='/assets/images/logintt.svg' alt='Logo' />
                        </Link>
                        <h4 className="mb-12">Réinitialiser le mot de passe</h4>
                        <p className="mb-32 text-secondary-light text-lg">
                           Veuillez entrer votre nouveau mot de passe sécurisé.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="icon-field mb-16">
                            <span className="icon top-50 translate-middle-y"><Icon icon="solar:lock-password-outline" /></span>
                            <input
                                type="password"
                                className="form-control h-56-px bg-neutral-50 radius-12"
                                placeholder="Nouveau mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                         <div className="icon-field mb-20">
                            <span className="icon top-50 translate-middle-y"><Icon icon="solar:lock-password-outline" /></span>
                            <input
                                type="password"
                                className="form-control h-56-px bg-neutral-50 radius-12"
                                placeholder="Confirmer le mot de passe"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <div className="alert alert-danger mt-3">{error}</div>}
                        {message && <div className="alert alert-success mt-3">{message}</div>}

                        <button type="submit" className="btn btn-primary w-100 radius-12 mt-32" disabled={loading}>
                            {loading ? 'Sauvegarde...' : 'Réinitialiser le mot de passe'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ResetPasswordPage;