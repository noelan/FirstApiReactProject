import React, { useState, useEffect } from "react";
import Field from "../components/forms/Field";
import { Link } from "react-router-dom";
import axios from "axios";
import CustomersAPI from "../services/customersAPI";

const CustomerPage = ({ match, history }) => {
  const { id = "new" } = match.params;
  const [customer, setCustomer] = useState({
    lastName: "",
    firstName: "",
    email: "",
    company: ""
  });

  const [errors, setErrors] = useState({
    lastName: "",
    firstName: "",
    email: "",
    company: ""
  });

  const [editing, setEditing] = useState(false);

  const fetchCustomer = async id => {
    try {
      const data = await CustomersAPI.findById(id);
      const { firstName, lastName, email, company } = data;

      setCustomer({ firstName, lastName, email, company });
    } catch (error) {
      console.log(error.response);
      history.replace("/customers");
    }
  };

  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchCustomer(id);
    }
  }, [id]);

  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setCustomer({ ...customer, [name]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      if (editing) {
        await CustomersAPI.edit(id, customer);
      } else {
        await CustomersAPI.create(customer);
        history.replace("/customers");
      }

      setErrors("");
    } catch ({ response }) {
      const { violations } = response.data;
      if (violations) {
        const apiErrors = {};
        violations.forEach(violation => {
          apiErrors[violation.propertyPath] = violation.message;
        });
        setErrors(apiErrors);
      }
    }
  };

  return (
    <>
      {(!editing && <h1>Création d'un client</h1>) || (
        <h1>Modification d'un client</h1>
      )}
      <form onSubmit={handleSubmit}>
        <Field
          name="lastName"
          label="Nom de famille"
          value={customer.lastName}
          onChange={handleChange}
          error={errors.lastName}
        />
        <Field
          name="firstName"
          label="Prénom"
          value={customer.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />
        <Field
          name="email"
          label="Email"
          type="email"
          value={customer.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Field
          name="company"
          label="Entreprise"
          value={customer.company}
          onChange={handleChange}
          error={errors.company}
        />
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <Link to="/customers" className="btn btn-link">
            Retour à la liste des clients
          </Link>
        </div>
      </form>
    </>
  );
};

export default CustomerPage;
