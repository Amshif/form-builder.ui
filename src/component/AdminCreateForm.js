import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/constants";

const CreateForm = () => {
  const [formFields, setFormFields] = useState([]);
  const [formTitle, setFormTitle] = useState("");
  const navigate = useNavigate();

  const handleAddField = () => {
    setFormFields([...formFields, { label: "", type: "text" }]);
  };

  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...formFields];
    updatedFields[index][key] = value;
    setFormFields(updatedFields);
  };

  const handleSaveForm = async () => {
    if (!formTitle || formFields.length === 0) {
      alert("Please provide a form title and at least one field.");
      return;
    }
  
    const newForm = {
      title: formTitle,
      fields: formFields,
    };
  
    try {
      const token = localStorage.getItem("token");
      const endpoint = "/forms/create"
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newForm),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create form.");
      }
  
      const result = await response.json();
      console.log("Form created successfully:", result);
  
      
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error creating form:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Create a New Form</h1>

      <div className="mb-3">
        <label htmlFor="formTitle" className="form-label">
          Form Title
        </label>
        <input
          type="text"
          id="formTitle"
          className="form-control"
          placeholder="Enter form title"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
        />
      </div>

      <h3>Form Fields</h3>
      {formFields.map((field, index) => (
        <div key={index} className="mb-3">
          <div className="row align-items-center">
            <div className="col-6">
              <input
                type="text"
                className="form-control"
                placeholder="Field Label"
                value={field.label}
                onChange={(e) => handleFieldChange(index, "label", e.target.value)}
              />
            </div>
            <div className="col-4">
              <select
                className="form-select"
                value={field.type}
                onChange={(e) => handleFieldChange(index, "type", e.target.value)}
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="number">Number</option>
              </select>
            </div>
          </div>
        </div>
      ))}

      <div className="d-flex justify-content-between">
        <button onClick={handleAddField} className="btn btn-secondary">
          Add Field
        </button>
        <button onClick={handleSaveForm} className="btn btn-primary">
          Save Form
        </button>
      </div>
    </div>
  );
};

export default CreateForm;
