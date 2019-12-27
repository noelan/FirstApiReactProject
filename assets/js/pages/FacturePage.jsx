import React, { useState, useEffect } from "react";
import Field from "../components/forms/Field";
import Select from "../components/forms/select";
import { Link } from "react-router-dom";
import customersAPI from "../services/customersAPI";
import Axios from "axios";
import facturesAPI from "../services/facturesAPI";

const FacturePage = ({ history, match }) => {
  const { id = "new" } = match.params;

  const [invoice, setInvoice] = useState({
    amount: "",
    customer: "",
    status: "Envoyé"
  });

  const [errors, setErrors] = useState({
    amount: "",
    customer: "",
    status: ""
  });

  const [customers, setCustomers] = useState([]);
  const [editing, setEditing] = useState(false);

  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setInvoice({ ...invoice, [name]: value });
  };

  const fetchCustomers = async () => {
    try {
      const data = await customersAPI.findAll();
      setCustomers(data);

      if (!invoice.customer) setInvoice({ ...invoice, customer: data[0].id });
    } catch (error) {
      console.log(error.response);
      history.replace("/factures");
    }
  };

  const fetchInvoice = async id => {
    try {
      const data = await facturesAPI.findById(id);
      const { amount, status, customer } = data;
      setInvoice({ amount, status, customer: customer.id });
      console.log(data);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // récupération de la bonne facture quand l'identifiant de l'url change
  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchInvoice(id);
    }
  }, [id]);

  // Gestion de la soumision du formulaire
  const handleSubmit = async event => {
    event.preventDefault();
    try {
      if (editing) {
        await facturesAPI.edit(id, invoice);
      } else {
        await facturesAPI.create(invoice);
      }
      history.replace("/factures");
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
      <h1>
        {(editing && "Modification d'une facture") || "Création d'une facture "}
      </h1>
      <form onSubmit={handleSubmit}>
        <Field
          name="amount"
          type="number"
          placeholder="Montant de la facture"
          label="Montant"
          onChange={handleChange}
          value={invoice.amount}
          error={errors.amount}
        />

        <Select
          name="customer"
          label="Client"
          value={invoice.customer}
          errors={errors.customer}
          onChange={handleChange}
        >
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {" "}
              {customer.firstName} {customer.lastName}{" "}
            </option>
          ))}
        </Select>

        <Select
          name="status"
          label="Status"
          value={invoice.status}
          error={errors.status}
          onChange={handleChange}
        >
          <option value="Envoyé">Envoyée</option>
          <option value="réglé">Réglé</option>
          <option value="Annuler">Annuler</option>
        </Select>

        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <Link to="/factures" className="btn btn-link">
            Retour aux factures
          </Link>
        </div>
      </form>
    </>
  );
};

export default FacturePage;
