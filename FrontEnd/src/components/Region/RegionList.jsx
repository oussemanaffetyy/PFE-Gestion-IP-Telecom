import React, { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { getRegions, deleteRegion } from "../../services/authService";
import AddRegionModal from "./AddRegionModal";
import EditRegionModal from "./EditRegionModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const RegionList = () => {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // State for modals
  const [editingRegion, setEditingRegion] = useState(null);
  const [deletingRegionId, setDeletingRegionId] = useState(null);

  // State for UI controls
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  // Effect to make the success alert disappear after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchRegions = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getRegions();
      const data = Array.isArray(res?.data) ? res.data : [];
      // Sort the data alphabetically by region name
      data.sort((a, b) => a.nom_region.localeCompare(b.nom_region));
      setRegions(data);
    } catch (e) {
      console.error("Error loading regions:", e);
      setError("Failed to load regions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  const handleDelete = async () => {
    if (!deletingRegionId) return;
    try {
      await deleteRegion(deletingRegionId);
      setRegions(regions.filter((region) => region.id !== deletingRegionId));
      setSuccessMessage("Region deleted successfully!");
    } catch (error) {
      console.error("Error deleting region:", error);
      setError("Failed to delete region.");
    } finally {
      setDeletingRegionId(null); // Close the confirmation modal
    }
  };

  const handleAddSuccess = () => {
    setSuccessMessage("Region added successfully!");
    fetchRegions();
  };

  const handleUpdateSuccess = () => {
    setEditingRegion(null); // Close the edit modal
    setSuccessMessage("Region updated successfully!");
    fetchRegions();
  };

  // Memoized filtering for performance
  const filteredRegions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return regions;
    return regions.filter((region) =>
      region.nom_region.toLowerCase().includes(term)
    );
  }, [regions, searchTerm]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredRegions.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const currentRows = filteredRegions.slice(startIndex, startIndex + pageSize);

  // UI Event Handlers
  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1));
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };
  const handleResetFilters = () => {
    setSearchTerm("");
    setPage(1);
    setPageSize(10);
  };

  return (
    <>
      <div className="card">
        <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex flex-wrap align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <span>Show</span>
              <select className="form-select form-select-sm w-auto" value={pageSize} onChange={handlePageSizeChange}>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
            </div>
            <div className="icon-field">
              <input type="text" className="form-control form-control-sm w-auto" placeholder="Search..." value={searchTerm} onChange={handleSearchChange}/>
              <span className="icon"><Icon icon="ion:search-outline" /></span>
            </div>
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handleResetFilters}>
              <Icon icon="material-symbols:refresh" className="me-6" />Reset
            </button>
          </div>
          <button className="btn btn-sm btn-primary-600" type="button" data-bs-toggle="modal" data-bs-target="#addRegionModal">
            <i className="ri-add-line" /> Add Region
          </button>
        </div>
        <div className="card-body">
          {successMessage && (
            <div className="alert alert-success bg-success-50 text-success-600 border-success-50 px-24 py-11 mb-16 fw-semibold text-lg radius-8 d-flex align-items-center justify-content-between" role="alert">
              {successMessage}
              <button onClick={() => setSuccessMessage("")} className="remove-button text-success-600 text-xxl line-height-1">
                <Icon icon="iconamoon:sign-times-light" className="icon" />
              </button>
            </div>
          )}
          {error && (<div className="alert alert-danger" role="alert">{error}</div>)}
          <div className="table-responsive">
            <table className="table bordered-table mb-0">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Region Name</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="3" className="text-center">Loading...</td></tr>
                ) : currentRows.length === 0 ? (
                  <tr><td colSpan="3" className="text-center">No regions found.</td></tr>
                ) : (
                  currentRows.map((region, index) => (
                    <tr key={region.id}>
                      <td>{startIndex + index + 1}</td>
                      <td>{region.nom_region}</td>
                      <td>
                        <button onClick={() => setEditingRegion(region)} className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center" title="Edit" type="button">
                          <Icon icon="lucide:edit" />
                        </button>
                        <button onClick={() => setDeletingRegionId(region.id)} className="w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center" title="Delete" type="button">
                          <Icon icon="mingcute:delete-2-line" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-24">
            <span>
              Showing {filteredRegions.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + pageSize, filteredRegions.length)} of {filteredRegions.length} entries
            </span>
            <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
              <li className="page-item"><button className="page-link" onClick={handlePrevPage} disabled={currentPage === 1} type="button"><Icon icon="ep:d-arrow-left" /></button></li>
              <li className="page-item"><button className="page-link" onClick={handleNextPage} disabled={currentPage === totalPages} type="button"><Icon icon="ep:d-arrow-right" /></button></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddRegionModal onSuccess={handleAddSuccess} />
      {editingRegion && (
        <EditRegionModal 
            region={editingRegion}
            onClose={() => setEditingRegion(null)}
            onSuccess={handleUpdateSuccess}
        />
      )}
      {deletingRegionId && (
        <DeleteConfirmationModal
            onClose={() => setDeletingRegionId(null)}
            onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default RegionList;