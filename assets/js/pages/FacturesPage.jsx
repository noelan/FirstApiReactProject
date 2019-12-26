import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import axios from "axios";
import moment from "moment";
import facturesAPI from "../services/facturesAPI";

const STATUS_CLASSES = {
  réglé: "success",
  Envoyé: "primary",
  Annuler: "danger"
};

const InvoicesPage = props => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchInvoices = async () => {
    try {
      const data = await facturesAPI.findAll();
      setInvoices(data);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const handleSearch = event => {
    const value = event.currentTarget.value;
    setSearch(value);
    setCurrentPage(1);
  };

  const handleDelete = async id => {
    const originalInvoices = [...invoices];

    setInvoices(invoices.filter(invoice => invoice.id !== id));

    try {
      await facturesAPI.delete(id);
    } catch (error) {
      console.log(error.reponse);
      setInvoices(originalInvoices);
    }
  };

  const itemsPerPage = 10;

  const formatDate = str => {
    return moment(str).format("DD/MM/YYYY");
  };

  const filteredInvoices = invoices.filter(
    invoice =>
      invoice.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      invoice.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
      invoice.customer.email.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedInvoices = Pagination.getData(
    filteredInvoices,
    currentPage,
    itemsPerPage
  );

  return (
    <>
      <h1>Liste des factures</h1>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Recherche..."
          onChange={handleSearch}
          value={search}
        />
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Client</th>
            <th className="text-center">Date d'envoi</th>
            <th className="text-center">Montant</th>
            <th className="text-center">Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paginatedInvoices.map(invoice => (
            <tr key={invoice.id}>
              <td>
                <a href="#">{invoice.number}</a>
              </td>
              <td>
                {invoice.customer.firstName} {invoice.customer.lastName}
              </td>
              <td className="text-center">{formatDate(invoice.sendAt)}</td>
              <td className="text-center">
                {invoice.amount.toLocaleString()}€
              </td>
              <td className="text-center">
                <span
                  className={
                    "btn btn-sm badge-" + STATUS_CLASSES[invoice.status]
                  }
                >
                  {invoice.status}
                </span>
              </td>
              <td>
                <button className="btn btn-primary btn-sm mr-1">Editer</button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(invoice.id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        lenght={filteredInvoices.length}
        onPageChanged={handlePageChange}
      />
    </>
  );
};

export default InvoicesPage;
