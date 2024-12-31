import { useState, useRef } from "react";
import { API_BASE_URL } from "../utils/constants";
import {  useNavigate } from "react-router-dom";

const Login = () => {
  const [isSigninForm, setisSigninForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const email = useRef(null);
  const password = useRef(null);
  const name = useRef(null);

  const navigate = useNavigate();



  function toggleForm() {
    setisSigninForm(!isSigninForm);
    setErrorMessage("");
    setSuccessMessage("");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const emailValue = email.current.value;
    const passwordValue = password.current.value;
    const nameValue = name?.current?.value; // Only for SignUp

    const endpoint = isSigninForm ? "/auth/login" : "/auth/register";
    const payload = isSigninForm
      ? { username: emailValue, password: passwordValue }
      : { username: emailValue, password: passwordValue, name: nameValue };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong");

      if (isSigninForm) {
        const { token, user } = data;
        localStorage.setItem("token", token);
        localStorage.setItem("userid", user.id );
        localStorage.setItem("username", user.name );
        setSuccessMessage(`Welcome back, ${user.name}!`);
        console.log("Token stored:", token);

        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          const redirectTo = localStorage.getItem("redirectTo");

          if (redirectTo) {
            
            localStorage.removeItem("redirectTo");
            navigate(redirectTo);
          } else {
            navigate("/user/form");
          }
        }

      } else {
        setSuccessMessage("Account created successfully! Please log in.");
        toggleForm();
      }
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="login-page">
      <div
        className="form-container p-4 rounded shadow"
        style={{ background: "#fff", maxWidth: "400px", width: "100%" }}
      >
        <h2
          className="text-center fw-bold"
          style={{ color: "#4A00E0", position: "relative" }}
        >
          {isSigninForm ? "Sign In" : "Sign Up"}
        </h2>
        <div
          className="mx-auto"
          style={{
            width: "50px",
            height: "2px",
            background: "#4A00E0",
            marginBottom: "1rem",
          }}
        ></div>
        <form onSubmit={handleSubmit}>
          {!isSigninForm && (
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-person"></i>
                </span>
                <input
                  ref={name}
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Name"
                />
              </div>
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                ref={email}
                type="email"
                className="form-control"
                id="email"
                placeholder="Email"
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-lock"></i>
              </span>
              <input
                ref={password}
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                required
              />
            </div>
          </div>
          <div className="d-flex justify-content-center mt-4">
            <button type="submit" className="btn btn-primary w-50">
              {isSigninForm ? "Login" : "Sign Up"}
            </button>
          </div>
        </form>

        {errorMessage && (
          <p className="text-danger text-center mt-3">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-success text-center mt-3">{successMessage}</p>
        )}

        <p
          className="p-2 my-2 text-center cursor-pointer text-primary text-decoration-underline fw-bold"
          style={{ cursor: "pointer" }}
          onClick={toggleForm}
        >
          {isSigninForm
            ? "New to forms? Sign up now."
            : "Already have an account? Sign In."}
        </p>
      </div>
    </div>
  );
};

export default Login;
