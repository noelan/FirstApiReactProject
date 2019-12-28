import moment from "moment";
import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import facturesAPI from "../services/facturesAPI";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/table.loader";

const STATUS_CLASSES = {
  réglé: "success",
  Envoyé: "primary",
  Annuler: "danger"
};

const InvoicesPage = props => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      const data = await facturesAPI.findAll();
      setInvoices(data);
      setLoading(false);
    } catch (error) {
      toast.error("Erreur lors du chargement des factures !");
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
      toast.success("La facture a bien été supprimée");
    } catch (error) {
      toast.error("Une erreur est survenue");
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
      <div className="d-flex justify-content-between align-items-center">
        <h1>Liste des factures</h1>
        <Link className="btn btn-primary" to="/factures/new">
          Créer une facture
        </Link>
      </div>

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

        {!loading && (
          <tbody>
            {paginatedInvoices.map(invoice => (
              <tr key={invoice.id}>
                <td></td>
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
                  <Link
                    to={"/factures/" + invoice.id}
                    className="btn btn-primary btn-sm mr-1"
                  >
                    Editer
                  </Link>
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
        )}
      </table>

      {loading && <TableLoader />}

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
