import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/constants";
import Header from "./Header";

const AdminDashboard = () => {
  const [forms, setForms] = useState([]); 
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
      console.log("API Response:", data); 

     
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

  const handleCopyLink = (formId) => {
    const link = `https://form-builder-ui-sigma.vercel.app/form/${formId}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Error copying link:", err.message);
      });
  };

  const userName = localStorage.getItem("username");

  return (
    <div className="container mt-5">
     <Header title={`Hello, ${userName}`} />
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
              <div className="ms-auto">
                <button
                  onClick={() => handleViewForm(form._id)}
                  className="btn btn-sm btn-outline-primary me-2"
                >
                  View
                </button>
                <button
                  onClick={() => handleCopyLink(form._id)}
                  className="btn btn-sm btn-outline-secondary"
                >
                  Copy Link
                </button>
              </div>
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
