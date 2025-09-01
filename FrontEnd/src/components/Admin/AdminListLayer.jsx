import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';
import { getAllAdmins, deleteAdmin } from '../../services/authService';
import DeleteConfirmationModal from '../Region/DeleteConfirmationModal';
import { useAuth } from '../../context/AuthContext'; // <-- Importez le hook useAuth

const AdminListLayer = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingAdminId, setDeletingAdminId] = useState(null);
    const { userProfile } = useAuth(); // <-- Accédez au profil de l'utilisateur connecté

    const fetchAdmins = async () => {
        try {
            const res = await getAllAdmins();
            setAdmins(res.data);
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchAdmins(); }, []);

    const handleDelete = async () => {
        try {
            await deleteAdmin(deletingAdminId);
            fetchAdmins();
        } finally { setDeletingAdminId(null); }
    };

    return (
        <>
        <div className="card h-100 p-0">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="mb-0">Tous les Administrateurs</h6>
                <Link to="/add-admin" className="btn btn-primary btn-sm">Ajouter un Admin</Link>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table bordered-table">
                        <thead><tr><th>#</th><th>Nom</th><th>Email</th><th>Login</th><th className="text-center">Action</th></tr></thead>
                        <tbody>
                            {loading ? <tr><td colSpan="5">Chargement...</td></tr> 
                            : admins.map((admin, index) => (
                                <tr key={admin.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <img src={admin.avatar_url ? `http://localhost:3001${admin.avatar_url}` : '/assets/images/user.png'} alt="Avatar" className="w-40-px h-40-px rounded-circle me-12" />
                                            {admin.prenom} {admin.nom}
                                        </div>
                                    </td>
                                    <td>{admin.email}</td>
                                    <td>{admin.login}</td>
                                    <td className="text-center">
                                        <button 
                                            type="button" 
                                            onClick={() => setDeletingAdminId(admin.id)} 
                                            className="btn btn-sm btn-outline-danger"
                                            // Désactive le bouton si l'ID de l'admin dans la liste est le même que celui de l'utilisateur connecté
                                            disabled={userProfile?.id === admin.id}
                                            title={userProfile?.id === admin.id ? "Vous ne pouvez pas vous supprimer" : "Supprimer"}
                                        >
                                            <Icon icon="fluent:delete-24-regular" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        {deletingAdminId && <DeleteConfirmationModal onClose={() => setDeletingAdminId(null)} onConfirm={handleDelete} />}
        </>
    );
};
export default AdminListLayer;