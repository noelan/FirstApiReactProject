import React, { useContext, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import authAPI from "../services/authAPI";
import Field from "../components/forms/Field.jsx";

const LoginPage = ({ history }) => {
  const { setIsAuthenticated } = useContext(AuthContext);

  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = event => {
    const value = event.currentTarget.value;
    const name = event.currentTarget.name;

    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      await authAPI.authenticate(credentials);
      setError("");
      setIsAuthenticated(true);
      history.replace("/customers");
    } catch (error) {
      setError("Les information ne corespondent pas !");
    }
  };

  return (
    <>
      <h1>mdp@mdp.mdp</h1>
      <form onSubmit={handleSubmit}>
        <Field
          label="Adresse Email"
          name="username"
          value={credentials.username}
          onChange={handleChange}
          error={error}
        />
        <Field
          name="password"
          label="Mot de passe"
          value={credentials.password}
          onChange={handleChange}
          type="password"
          error=""
        />
        <div className="form-group">
          <button type="submit" className="btn btn-info">
            Je me connecte !
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginPage;
