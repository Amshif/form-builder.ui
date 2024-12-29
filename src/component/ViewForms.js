import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../utils/constants";

const ViewForm = () => {
  const { id } = useParams(); 
  const [form, setForm] = useState(null);
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(true); 

  

  useEffect(() => {
    const fetchForm = async () => {
      try {
          const token = localStorage.getItem("token");
          const endpoint = `/forms/${id}`;
        
          const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch form data");
        }
  
        const data = await response.json();
        setForm(data); 
      } catch (err) {
        setError(err.message); 
      } finally {
        setLoading(false); 
      }
    };
    fetchForm();
  }, [id]);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <h2 className="text-danger">Error</h2>
        <p className="text-muted">{error}</p>
      </div>
    );
  }

  if (!form || !form.fields) {
    return (
      <div className="container mt-5 text-center">
        <h2 className="text-danger">Form Not Found</h2>
        <p className="text-muted">It seems the form you're looking for doesn't exist or has no fields.</p>
      </div>
    );
  }

  return (
    <div className="container mt-2" style={{ maxWidth: "600px" }}>
      <div className="card shadow p-4">
        <h1 className="card-title text-center mb-4">{form.title}</h1>
        <hr />

        {form.fields.map((field, index) => (
          <div key={index} className="mb-4">
            <div className="card bg-light border-0 shadow-sm">
              <div className="card-body">
                <label className="form-label fw-bold">{field.label}</label>
                <input
                  type={field.type}
                  className="form-control"
                  placeholder={`Enter ${field.label}`}
                  disabled
                />
              </div>
            </div>
          </div>
        ))}

        <div className="text-center mt-4">
          <button
            onClick={() => window.history.back()}
            className="btn btn-secondary"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewForm;
