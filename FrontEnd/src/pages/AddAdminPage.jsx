import React from 'react';
import AddAdminLayer from '../components/Admin/AddAdminLayer'; 
import Breadcrumb from '../components/Breadcrumb';

const AddAdminPage = () => {
    return (
        <>
            <Breadcrumb title="Ajouter un Administrateur" />
            <AddAdminLayer />
        </>
    );
};

export default AddAdminPage;