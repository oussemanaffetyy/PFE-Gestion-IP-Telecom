import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from '../services/authService';

const SignInPage = () => {
  const [loginField, setLoginField] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await login(loginField, password);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Login ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='auth bg-base d-flex flex-wrap'>
      <div className='auth-left d-lg-block d-none'>
        <div className='d-flex align-items-center flex-column h-100 justify-content-center'>
          <img src='assets/images/tt917.svg' alt='' />
        </div>
      </div>
      <div className='auth-right py-32 px-24 d-flex flex-column justify-content-center'>
        <div className='max-w-464-px mx-auto w-100'>
          <div>
            <Link to='/' className='mb-40 max-w-290-px d-inline-block'>
              <img src='assets/images/logintt.svg' alt='Logo' />
            </Link>
            <h4 className='mb-12'>Connexion Administrateur</h4>
            <p className='mb-32 text-secondary-light text-lg'>
              Bienvenue ! Veuillez entrer vos détails.
            </p>
          </div>
          <form onSubmit={handleLogin}>
            <div className='icon-field mb-16'>
              <span className='icon top-50 translate-middle-y'>
                <Icon icon='mage:email' />
              </span>
              <input
                type='text'
                className='form-control h-56-px bg-neutral-50 radius-12'
                placeholder='Login'
                value={loginField}
                onChange={(e) => setLoginField(e.target.value)}
              />
            </div>
            <div className='position-relative mb-20'>
              <div className='icon-field'>
                <span className='icon top-50 translate-middle-y'>
                  <Icon icon='solar:lock-password-outline' />
                </span>
                <input
                  type='password'
                  className='form-control h-56-px bg-neutral-50 radius-12'
                  id='your-password'
                  placeholder='Mot de passe'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
             <div className="d-flex justify-content-end mb-20">
                <Link to="/forgot-password"className="text-primary-600 fw-medium text-sm">
                    Mot de passe oublié ?
                </Link>
            </div>
            {error && <p className="text-danger text-center">{error}</p>}

            <button
              type='submit'
              className='btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12'
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>

            {/* --- THIS IS THE UPDATED BUTTON --- */}
            <Link
              to="/"
              className="btn btn-outline-secondary radius-8 px-20 py-11 d-flex align-items-center justify-content-center gap-2 w-100 mt-3"
            >
              <Icon icon="mingcute:square-arrow-left-line" className="text-xl" />
              Retour à la vérification IP
            </Link>

          </form>
        </div>
      </div>
    </section>
  );
};

export default SignInPage;