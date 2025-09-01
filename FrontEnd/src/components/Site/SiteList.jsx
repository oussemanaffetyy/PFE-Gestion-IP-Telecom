import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { getSites, deleteSite } from '../../services/authService';
import AddSiteModal from './AddSiteModal';
import EditSiteModal from './EditSiteModal';
import DeleteConfirmationModal from '../Region/DeleteConfirmationModal';

const SiteList = () => {
    const [sites, setSites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [regionFilter, setRegionFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [editingSiteId, setEditingSiteId] = useState(null); // Changed to store only the ID
    const [deletingSiteId, setDeletingSiteId] = useState(null);

    const fetchSitesData = async () => {
        try {
            setLoading(true);
            const response = await getSites();
            setSites(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            setError("Failed to load sites.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSitesData();
    }, []);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);
    
    const handleResetFilters = () => {
        setSearchTerm('');
        setRegionFilter('');
        setTypeFilter('');
        setPage(1);
    };

    const handleDelete = async () => {
        if (!deletingSiteId) return;
        try {
            await deleteSite(deletingSiteId);
            setSuccessMessage("Site deleted successfully!");
            fetchSitesData();
        } catch (err) {
            setError("Failed to delete site.");
        } finally {
            setDeletingSiteId(null);
        }
    };
    
    const handleAddSuccess = () => {
        setSuccessMessage("Site added successfully!");
        fetchSitesData();
    };

    const handleUpdateSuccess = () => {
        setEditingSiteId(null);
        setSuccessMessage("Site updated successfully!");
        fetchSitesData();
    };

    const filteredSites = useMemo(() => {
        let data = [...sites];
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            data = data.filter(site =>
                Object.values(site).some(val => String(val).toLowerCase().includes(term))
            );
        }
        if (regionFilter) {
            data = data.filter(site => site.nom_region === regionFilter);
        }
        if (typeFilter) {
            data = data.filter(site => site.type_name === typeFilter);
        }
        return data;
    }, [sites, searchTerm, regionFilter, typeFilter]);

    const totalPages = Math.ceil(filteredSites.length / pageSize);
    const currentSites = filteredSites.slice((page - 1) * pageSize, page * pageSize);
    const startIndex = (page - 1) * pageSize;

    const columns = ["nom_region", "Site_Name", "Site_Code", "type_name"]; 

    return (
        <>
            <div className="card h-100 p-0 radius-12">
                <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                    <div className="d-flex align-items-center flex-wrap gap-3">
                        <select className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px" value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
                            <option value="10">10</option><option value="25">25</option><option value="50">50</option>
                        </select>
                        <form className="navbar-search"><input type="text" className="bg-base h-40-px w-auto" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /><Icon icon="ion:search-outline" className="icon" /></form>
                        <select className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px" value={regionFilter} onChange={e => setRegionFilter(e.target.value)}><option value="">All Regions</option>{[...new Set(sites.map(s => s.nom_region))].sort().map(r => <option key={r} value={r}>{r}</option>)}</select>
                        <select className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}><option value="">All Types</option>{[...new Set(sites.map(s => s.type_name))].sort().map(t => <option key={t} value={t}>{t}</option>)}</select>
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handleResetFilters}><Icon icon="material-symbols:refresh" className="me-1" /> Reset</button>
                    </div>
                    <button type="button" className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#addSiteModal">
                        <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" /> Add New Site
                    </button>
                </div>
                <div className="card-body p-24">
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="table-responsive">
                        <table className="table bordered-table sm-table mb-0">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    {columns.map(col => <th key={col}>{col.replace(/_/g, " ")}</th>)}
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (<tr><td colSpan={columns.length + 2} className="text-center">Loading...</td></tr>)
                                : currentSites.map((site, index) => (
                                    <tr key={site.id}>
                                        <td>{startIndex + index + 1}</td>
                                        {columns.map(col => <td key={col}>{site[col] || "-"}</td>)}
                                        <td className="text-center">
                                            <button type="button" onClick={() => setEditingSiteId(site.id)} className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle d-inline-flex">
                                                <Icon icon="lucide:edit" />
                                            </button>
                                            <button type="button" onClick={() => setDeletingSiteId(site.id)} className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle d-inline-flex ms-2">
                                                <Icon icon="fluent:delete-24-regular" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
                        <span>Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredSites.length)} of {filteredSites.length} entries</span>
                        <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
                            <li className="page-item"><button className="page-link" onClick={() => setPage(p => p - 1)} disabled={page === 1}><Icon icon="ep:d-arrow-left" /></button></li>
                            {[...Array(totalPages)].map((_, i) => (
                                <li key={i} className="page-item"><button className={`page-link ${page === i + 1 ? "bg-primary-600 text-white" : "bg-primary-50 text-secondary-light"}`} onClick={() => setPage(i + 1)}>{i + 1}</button></li>
                            ))}
                            <li className="page-item"><button className="page-link" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}><Icon icon="ep:d-arrow-right" /></button></li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <AddSiteModal onSuccess={handleAddSuccess} />
            {editingSiteId && <EditSiteModal siteId={editingSiteId} onSuccess={handleUpdateSuccess} onClose={() => setEditingSiteId(null)} />}
            {deletingSiteId && <DeleteConfirmationModal onClose={() => setDeletingSiteId(null)} onConfirm={handleDelete} />}
        </>
    );
};
export default SiteList;