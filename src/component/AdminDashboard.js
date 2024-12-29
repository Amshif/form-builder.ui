import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/constants";

const AdminDashboard = () => {
  const [forms, setForms] = useState([]); // Initialize with an empty array
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchForms = async () => {
    try {
     
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: Please log in first.");
      
      const userid = localStorage.getItem("userid");
      const endpoint = `/forms/user/${userid}`;

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch forms.");
      }

      const data = await response.json();
      console.log("API Response:", data); // Debugging

      // Use `data` as is or `data.forms` depending on API response
      setForms(Array.isArray(data) ? data : data.forms || []);
    } catch (err) {
      console.error("Error fetching forms:", err.message);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleCreateForm = () => {
    navigate("/admin/create-form");
  };

  const handleViewForm = (id) => {
    navigate(`/admin/view-form/${id}`);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Admin Dashboard</h1>
      <div className="text-center mb-4">
        <button onClick={handleCreateForm} className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>Create Blank Form
        </button>
      </div>

      <h2>Your Forms</h2>
      {error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : forms && forms.length > 0 ? (
        <div className="list-group mt-3">
          {forms.map((form) => (
            <div
              key={form._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {form.title}
              <button
                onClick={() => handleViewForm(form._id)}
                className="btn btn-sm btn-outline-primary"
              >
                View
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted">No forms created yet.</p>
      )}
    </div>
  );
};

export default AdminDashboard;
