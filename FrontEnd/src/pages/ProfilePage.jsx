import React, { useState, useEffect } from 'react';
import { getMyProfile } from '../services/authService';
import EditProfileForm from '../components/Profile/EditProfileForm';
import ChangePasswordForm from '../components/Profile/ChangePasswordForm';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const res = await getMyProfile();
            setProfile(res.data);
        } catch (error) {
            console.error("Impossible de charger le profil", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading || !profile) return <p>Chargement du profil...</p>;

    return (
        <div className="row gy-4">
            {/* Colonne de gauche : Informations du profil */}
            <div className="col-lg-4">
                <div className="user-grid-card position-relative border radius-16 overflow-hidden bg-base h-100">
                    <img src="/assets/images/PFE2.png" alt="" className="w-100 object-fit-cover" />
                    <div className="pb-24 ms-16 mb-24 me-16 mt--100">
                        <div className="text-center border-bottom pb-24">
                            <img
                                src={profile.avatar_url ? `http://localhost:3001${profile.avatar_url}` : '/assets/images/user-grid/user-grid-img14.png'}
                                alt="Avatar"
                                className="border br-white border-width-2-px w-200-px h-200-px rounded-circle object-fit-cover"
                            />
                            <h6 className="mb-0 mt-16">{profile.prenom} {profile.nom}</h6>
                            <span className="text-secondary-light mb-16">{profile.email}</span>
                        </div>
                        <div className="mt-24">
                            <h6 className="text-xl mb-16">Informations Personnelles</h6>
                            <ul>
                                <li className="d-flex align-items-center gap-1 mb-12"><span className="w-30 text-md fw-semibold">Login</span><span className="w-70 text-secondary-light fw-medium"> {profile.login}</span></li>
                                <li className="d-flex align-items-center gap-1 mb-12"><span className="w-30 text-md fw-semibold">Nom Complet</span><span className="w-70 text-secondary-light fw-medium"> {profile.prenom} {profile.nom}</span></li>
                                <li className="d-flex align-items-center gap-1 mb-12"><span className="w-30 text-md fw-semibold">Email</span><span className="w-70 text-secondary-light fw-medium"> {profile.email}</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {/* Colonne de droite : Formulaires à onglets */}
            <div className="col-lg-8">
                <div className="card h-100">
                    <div className="card-body p-24">
                        <ul className="nav border-gradient-tab nav-pills mb-20 d-inline-flex" id="pills-tab" role="tablist">
                            <li className="nav-item" role="presentation"><button className="nav-link d-flex align-items-center px-24 active" id="pills-edit-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-edit-profile" type="button">Modifier le Profil</button></li>
                            <li className="nav-item" role="presentation"><button className="nav-link d-flex align-items-center px-24" id="pills-change-password-tab" data-bs-toggle="pill" data-bs-target="#pills-change-password" type="button">Changer le mot de passe</button></li>
                        </ul>
                        <div className="tab-content" id="pills-tabContent">
                            <div className="tab-pane fade show active" id="pills-edit-profile" role="tabpanel">
                                <EditProfileForm profileData={profile} onProfileUpdate={fetchProfile} />
                            </div>
                            <div className="tab-pane fade" id="pills-change-password" role="tabpanel">
                                <ChangePasswordForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ProfilePage;