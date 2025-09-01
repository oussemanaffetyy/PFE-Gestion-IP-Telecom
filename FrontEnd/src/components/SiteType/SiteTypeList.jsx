import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { getSiteTypes, deleteSiteType } from '../../services/authService';
import AddSiteTypeModal from './AddSiteTypeModal';
import EditSiteTypeModal from './EditSiteTypeModal';
import DeleteConfirmationModal from '../Region/DeleteConfirmationModal';

const SiteTypeList = () => {
    // --- State Management ---
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    // --- UI State ---
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // --- Modal State ---
    const [editingSiteType, setEditingSiteType] = useState(null);
    const [deletingSiteTypeId, setDeletingSiteTypeId] = useState(null);

    // --- Data Fetching & Handlers ---
    const fetchSiteTypes = async () => {
        try {
            setLoading(true);
            const response = await getSiteTypes();
            setTypes(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            setError("Failed to load site types.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSiteTypes(); }, []);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const handleDelete = async () => {
        if (!deletingSiteTypeId) return;
        try {
            await deleteSiteType(deletingSiteTypeId);
            setSuccessMessage("Site type deleted successfully!");
            fetchSiteTypes();
        } catch (err) {
            setError(err.response?.data?.msg || "Failed to delete site type.");
        } finally {
            setDeletingSiteTypeId(null);
        }
    };

    const handleAddSuccess = () => {
        setSuccessMessage("Site type added successfully!");
        fetchSiteTypes();
    };

    const handleUpdateSuccess = () => {
        setEditingSiteType(null);
        setSuccessMessage("Site type updated successfully!");
        fetchSiteTypes();
    };

    // --- Filtering & Pagination Logic ---
    const filteredTypes = useMemo(() => {
        let data = [...types];
        if (searchTerm) {
            data = data.filter((type) =>
                type.type_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return data;
    }, [types, searchTerm]);

    const totalPages = Math.ceil(filteredTypes.length / pageSize);
    const currentTypes = filteredTypes.slice((page - 1) * pageSize, page * pageSize);
    const startIndex = (page - 1) * pageSize;

    const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));
    const handleNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));

    return (
        <>
            <div className="card h-100 p-0 radius-12">
                <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                    <div className="d-flex align-items-center flex-wrap gap-3">
                        <select className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                            <option value="10">10</option><option value="15">15</option><option value="20">20</option>
                        </select>
                        <form className="navbar-search">
                            <input type="text" className="bg-base h-40-px w-auto" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <Icon icon="ion:search-outline" className="icon" />
                        </form>
                    </div>
                    <button type="button" className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#addSiteTypeModal">
                        <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" /> Add New Type
                    </button>
                </div>
                <div className="card-body p-24">
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="table-responsive">
                        <table className="table bordered-table sm-table mb-0">
                            <thead>
                                <tr><th>#</th><th>Type Name</th><th className="text-center">Actions</th></tr>
                            </thead>
                            <tbody>
                                {loading ? (<tr><td colSpan="3" className="text-center">Loading...</td></tr>)
                                : currentTypes.map((type, index) => (
                                    <tr key={type.id}>
                                        <td>{startIndex + index + 1}</td>
                                        <td>{type.type_name}</td>
                                        <td className="text-center">
                                            <button type="button" onClick={() => setEditingSiteType(type)} className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle d-inline-flex">
                                                <Icon icon="lucide:edit" />
                                            </button>
                                            <button type="button" onClick={() => setDeletingSiteTypeId(type.id)} className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle d-inline-flex ms-2">
                                                <Icon icon="fluent:delete-24-regular" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
                        <span>Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredTypes.length)} of {filteredTypes.length} entries</span>
                        <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
                            <li className="page-item"><button className="page-link" onClick={handlePrevPage} disabled={page === 1}><Icon icon="ep:d-arrow-left" /></button></li>
                            {[...Array(totalPages)].map((_, i) => (
                                <li key={i} className="page-item"><button className={`page-link ${page === i + 1 ? "bg-primary-600 text-white" : "bg-primary-50 text-secondary-light"}`} onClick={() => setPage(i + 1)}>{i + 1}</button></li>
                            ))}
                            <li className="page-item"><button className="page-link" onClick={handleNextPage} disabled={page >= totalPages}><Icon icon="ep:d-arrow-right" /></button></li>
                        </ul>
                    </div>
                </div>
            </div>
            {/* All Modals are now ready */}
            <AddSiteTypeModal onSuccess={handleAddSuccess} />
            {editingSiteType && <EditSiteTypeModal siteType={editingSiteType} onSuccess={handleUpdateSuccess} onClose={() => setEditingSiteType(null)} />}
            {deletingSiteTypeId && <DeleteConfirmationModal onClose={() => setDeletingSiteTypeId(null)} onConfirm={handleDelete} />}
        </>
    );
};
export default SiteTypeList;