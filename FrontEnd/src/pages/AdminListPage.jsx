import React from 'react';
import AdminListLayer from '../components/Admin/AdminListLayer';
import Breadcrumb from '../components/Breadcrumb';

const AdminListPage = () => {
    return (
        <>
            <Breadcrumb title="Liste des Administrateurs" />
            <AdminListLayer />
        </>
    );
};

export default AdminListPage;