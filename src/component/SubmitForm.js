import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/constants";


const SubmitForm = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch form details by formId
  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
         const token = localStorage.getItem("token");
        const endpoint = `/forms/${formId }`;
                
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch form details.");
        }
        const data = await response.json();
        setForm(data);
        const initialFormData = data.fields.reduce((acc, field) => {
          acc[field.label] = "";
          return acc;
        }, {});
        setFormData(initialFormData);
      } catch (error) {
        console.error("Error fetching form details:", error.message);
      }
    };

    fetchFormDetails();
  }, [formId]);

  const handleChange = (label, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [label]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const endpoint = `/forms/${formId}/submit`;
  
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData), 
      });
  
      if (!response.ok) {
        throw new Error("Failed to submit the form.");
      }
  
      const result = await response.json();
      setMessage(result.message);
      setTimeout(() => navigate("/user/form"), 2000);
    } catch (error) {
      console.error("Error submitting the form:", error.message);
    }
  };
  

  if (!form) {
    return (
      <div className="container mt-5 text-center">
        <h2 className="text-danger">Form Not Found</h2>
        <p className="text-muted">It seems the form you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <div className="card shadow p-4">
        <h1 className="card-title text-center mb-4">{form.title}</h1>
        <form onSubmit={handleSubmit}>
          {form.fields.map((field) => (
            <div key={field._id} className="mb-3">
              <label className="form-label">{field.label}</label>
              <input
                type={field.type}
                className="form-control"
                value={formData[field.label]}
                onChange={(e) => handleChange(field.label, e.target.value)}
                required
              />
            </div>
          ))}
          <div className="text-center mt-4">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
        {message && <div className="alert alert-success mt-3">{message}</div>}
      </div>
    </div>
  );
};

export default SubmitForm;
