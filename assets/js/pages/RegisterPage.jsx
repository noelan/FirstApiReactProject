import React, { useState } from "react";
import Field from "../components/forms/Field";
import { Link } from "react-router-dom";
import usersAPI from "../services/usersAPI";
import { toast } from "react-toastify";

const RegisterPage = ({ history }) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });

  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const apiErrors = {};
    if (user.password !== user.passwordConfirm) {
      apiErrors.passwordConfirm =
        "Votre mot de passe est différent du mot de passe de confirmation";
      setErrors(apiErrors);
      return;
    }

    try {
      await usersAPI.register(user);
      setErrors("");
      toast.success("Vous êtes bien inscrit !");
      history.replace("/login");
    } catch (error) {
      const { violations } = error.response.data;

      if (violations) {
        violations.forEach(violation => {
          apiErrors[violation.propertyPath] = violation.message;
        });
        setErrors(apiErrors);
      }
      toast.error("Il y a des erreurs dans votre formulaire");
    }
  };

  return (
    <>
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <Field
          name="firstName"
          label="Prénom"
          placeholder="Votre prénom"
          error={errors.firstName}
          value={user.firstName}
          onChange={handleChange}
        ></Field>
        <Field
          name="lastName"
          label="Nom de famille"
          placeholder="Votre nom de famille"
          error={errors.lastName}
          value={user.lastName}
          onChange={handleChange}
        ></Field>
        <Field
          name="email"
          label="Adresse email"
          placeholder="Votre adresse email"
          error={errors.email}
          value={user.email}
          type="email"
          onChange={handleChange}
        ></Field>
        <Field
          name="password"
          label="Mot de passe"
          placeholder="Votre mot de passe"
          error={errors.password}
          value={user.password}
          onChange={handleChange}
          type="password"
        ></Field>
        <Field
          name="passwordConfirm"
          label="Confirmation du mot de passe"
          placeholder="Confirmer votre mot de passe"
          error={errors.passwordConfirm}
          value={user.passwordConfirm}
          onChange={handleChange}
          type="password"
        ></Field>
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Confirmation
          </button>
          <Link to="/login" className="btn btn-link">
            J'ai déja un compte
          </Link>
        </div>
      </form>
    </>
  );
};

export default RegisterPage;
