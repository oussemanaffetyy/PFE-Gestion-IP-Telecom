import React, { useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/authService';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const response = await forgotPassword(email);
            setMessage(response.data.msg);
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
                    <img src="/assets/images/forgot-pa.png" alt="" />
                </div>
            </div>
            <div className="auth-right py-32 px-24 d-flex flex-column justify-content-center">
                <div className="max-w-464-px mx-auto w-100">
                    <div>
                        <Link to='/' className='mb-40 max-w-290-px d-inline-block'>
                            <img src='/assets/images/logintt.svg' alt='Logo' />
                        </Link>
                        <h4 className="mb-12">Mot de passe oublié</h4>
                        <p className="mb-32 text-secondary-light text-lg">
                            Entrez l'adresse e-mail associée à votre compte et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="icon-field mb-3">
                            <span className="icon top-50 translate-middle-y"><Icon icon="mage:email" /></span>
                            <input
                                type="email"
                                className="form-control h-56-px bg-neutral-50 radius-12"
                                placeholder="Entrez votre e-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {error && <div className="alert alert-danger">{error}</div>}
                        {message && <div className="alert alert-success">{message}</div>}

                        <button type="submit" className="btn btn-primary w-100 radius-12 mt-32" disabled={loading}>
                            {loading ? 'Envoi en cours...' : 'Continuer'}
                        </button>
                        <div className="text-center mt-24">
                            <Link to="/sign-in" className="text-primary-600 fw-bold">
                                Retour à la connexion
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ForgotPasswordPage;