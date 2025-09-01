import React, { useState } from 'react';
import { changeMyPassword } from '../../services/authService';

const ChangePasswordForm = () => {
    const [formData, setFormData] = useState({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
    const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (formData.newPassword !== formData.confirmNewPassword) return setError("Les nouveaux mots de passe ne correspondent pas.");
        if (formData.newPassword.length < 6) return setError("Le nouveau mot de passe doit contenir au moins 6 caractères.");
        try {
            await changeMyPassword({ oldPassword: formData.oldPassword, newPassword: formData.newPassword });
            setSuccess("Mot de passe changé avec succès !");
            setFormData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
        } catch (err) {
            setError(err.response?.data?.msg || 'Une erreur est survenue.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-20"><label className="form-label">Ancien Mot de Passe</label><input type="password" name="oldPassword" className="form-control" value={formData.oldPassword} onChange={handleChange} required /></div>
            <div className="mb-20">
                <label className="form-label">Nouveau Mot de Passe</label>
                <div className="position-relative">
                    <input type={passwordVisible ? "text" : "password"} name="newPassword" className="form-control" value={formData.newPassword} onChange={handleChange} required />
                    <span className={`toggle-password ri-eye-${passwordVisible ? "off-" : ""}line cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`} onClick={togglePasswordVisibility}></span>
                </div>
            </div>
            <div className="mb-20">
                <label className="form-label">Confirmer Nouveau Mot de Passe</label>
                <div className="position-relative">
                    <input type={confirmPasswordVisible ? "text" : "password"} name="confirmNewPassword" className="form-control" value={formData.confirmNewPassword} onChange={handleChange} required />
                    <span className={`toggle-password ri-eye-${confirmPasswordVisible ? "off-" : ""}line cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`} onClick={toggleConfirmPasswordVisibility}></span>
                </div>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <div className="d-flex justify-content-end gap-3 mt-3">
                <button type="submit" className="btn btn-primary">Changer le mot de passe</button>
            </div>
        </form>
    );
};
export default ChangePasswordForm;