import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/constants";
import Header from "./Header";

const UserDashboard = () => {
  const userName = localStorage.getItem("username");
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Unauthorized. Please log in first.");
        }

        const response = await fetch(`${API_BASE_URL}/forms/user/submissions`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch submissions.");
        }

        const data = await response.json();
        setSubmissions(data);
      } catch (err) {
        console.error("Error fetching submissions:", err.message);
        setError(err.message);
      }
    };

    fetchSubmissions();
  }, []);


  return (
    <div className="container mt-5">
      <Header title={`Hello, ${userName}`}/>
      <h1 className="text-center mb-4">Submitted Forms</h1>

      {error ? (
        <div className="alert alert-danger">{error}</div>
      ) : submissions.length > 0 ? (
        <div className="list-group mt-4">
          {submissions.map((submission) => (
            <div key={submission._id} className="list-group-item">
              <h5>{submission.formId?.title || "Untitled Form"}</h5>
              <p>
                <strong>Submitted At:</strong>{" "}
                {new Date(submission.submittedAt).toLocaleString()}
              </p>
              {/* <ul>
                {Object.entries(submission.submittedData).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul> */}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted text-center">No submissions found.</p>
      )}
    </div>
  );
};

export default UserDashboard;
