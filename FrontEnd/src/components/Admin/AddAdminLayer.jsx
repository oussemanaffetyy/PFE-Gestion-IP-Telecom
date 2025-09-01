import React, { useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { createAdmin } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const AddAdminLayer = () => {
    const [formData, setFormData] = useState({ prenom: '', nom: '', email: '', login: '' });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setAvatarFile(e.target.files[0]);
            setAvatarPreview(URL.createObjectURL(e.target.files[0]));
        }
    };
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        const data = new FormData();
        data.append('prenom', formData.prenom);
        data.append('nom', formData.nom);
        data.append('email', formData.email);
        data.append('login', formData.login);
        if (avatarFile) data.append('avatar', avatarFile);
        
        try {
            await createAdmin(data);
            setSuccess('Admin créé avec succès ! Redirection...');
            setTimeout(() => navigate('/admins-list'), 2000);
        } catch (err) {
            setError(err.response?.data?.msg || 'Une erreur est survenue.');
        }
    };

    return (
        <div className="card h-100 p-0">
            <div className="card-body p-24"><div className="row justify-content-center"><div className="col-xxl-6 col-xl-8 col-lg-10">
                <div className="card border"><div className="card-body">
                    <h6 className="text-md text-primary-light mb-16">Image de Profil</h6>
                    <div className="mb-24 mt-16"><div className="avatar-upload"><div className="avatar-edit position-absolute bottom-0 end-0 me-24 mt-16 z-1 cursor-pointer"><input type="file" id="imageUpload" accept=".png, .jpg, .jpeg" hidden onChange={handleImageChange} /><label htmlFor="imageUpload" className="w-32-px h-32-px d-flex justify-content-center align-items-center bg-primary-50 text-primary-600 border border-primary-600 bg-hover-primary-100 text-lg rounded-circle"><Icon icon="solar:camera-outline" className="icon"></Icon></label></div><div className="avatar-preview"><div id="imagePreview" style={{ backgroundImage: avatarPreview ? `url(${avatarPreview})` : '' }}></div></div></div></div>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                           <div className="col-sm-6 mb-20"><label className="form-label">Prénom</label><input type="text" name="prenom" className="form-control" value={formData.prenom} onChange={handleChange} required /></div>
                           <div className="col-sm-6 mb-20"><label className="form-label">Nom</label><input type="text" name="nom" className="form-control" value={formData.nom} onChange={handleChange} required /></div>
                           <div className="col-sm-6 mb-20"><label className="form-label">Email</label><input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required /></div>
                           <div className="col-sm-6 mb-20"><label className="form-label">Login</label><input type="text" name="login" className="form-control" value={formData.login} onChange={handleChange} required /></div>
                        </div>
                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}
                        <div className="d-flex justify-content-end gap-3"><button type="submit" className="btn btn-primary">Sauvegarder</button></div>
                    </form>
                </div></div>
            </div></div></div>
        </div>
    );
};
export default AddAdminLayer;