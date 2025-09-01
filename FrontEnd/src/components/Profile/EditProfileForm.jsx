import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { updateMyProfile } from '../../services/authService';

const EditProfileForm = ({ profileData, onProfileUpdate }) => {
    const [formData, setFormData] = useState({ prenom: '', nom: '', email: '', login: '' });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('/assets/images/user-grid/user-grid-img13.png');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (profileData) {
            setFormData({
                prenom: profileData.prenom,
                nom: profileData.nom,
                email: profileData.email,
                login: profileData.login,
            });
            if (profileData.avatar_url) {
                setAvatarPreview(`http://localhost:3001${profileData.avatar_url}`);
            }
        }
    }, [profileData]);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setAvatarFile(e.target.files[0]);
            setAvatarPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const data = new FormData();
        data.append('prenom', formData.prenom);
        data.append('nom', formData.nom);
        data.append('email', formData.email);
        data.append('login', formData.login);
        if (avatarFile) {
            data.append('avatar', avatarFile);
        }
        
        try {
            await updateMyProfile(data);
            setSuccess('Profil mis à jour avec succès !');
            onProfileUpdate(); // Rafraîchir les données dans la page parente
        } catch (err) {
            setError(err.response?.data?.msg || 'Une erreur est survenue.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h6 className="text-md text-primary-light mb-16">Image de Profil</h6>
            <div className="mb-24 mt-16">
                <div className="avatar-upload"><div className="avatar-edit position-absolute bottom-0 end-0 me-24 mt-16 z-1 cursor-pointer"><input type="file" id="imageUpload" accept=".png, .jpg, .jpeg" hidden onChange={handleImageChange} />
                <label htmlFor="imageUpload" className="w-32-px h-32-px d-flex justify-content-center align-items-center bg-primary-50 text-primary-600 border border-primary-600 bg-hover-primary-100 text-lg rounded-circle"><Icon icon="solar:camera-outline" className="icon"></Icon></label></div><div className="avatar-preview"><div id="imagePreview" style={{ backgroundImage: `url(${avatarPreview})` }}></div></div></div>
            </div>
            <div className="row">
                <div className="col-sm-6"><div className="mb-20"><label className="form-label">Prénom</label><input type="text" name="prenom" className="form-control" value={formData.prenom} onChange={handleChange} /></div></div>
                <div className="col-sm-6"><div className="mb-20"><label className="form-label">Nom</label><input type="text" name="nom" className="form-control" value={formData.nom} onChange={handleChange} /></div></div>
                <div className="col-sm-6"><div className="mb-20"><label className="form-label">Email</label><input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} /></div></div>
                <div className="col-sm-6"><div className="mb-20"><label className="form-label">Login</label><input type="text" name="login" className="form-control" value={formData.login} onChange={handleChange} /></div></div>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <div className="d-flex justify-content-end gap-3 mt-3">
                <button type="submit" className="btn btn-primary">Sauvegarder</button>
            </div>
        </form>
    );
};

export default EditProfileForm;