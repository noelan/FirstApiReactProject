import axios from "axios";
import Axios from "axios";

function findAll() {
  return axios
    .get("http://localhost:8000/api/factures")
    .then(response => response.data["hydra:member"]);
}

function deleteFacture(id) {
  return axios.delete("http://localhost:8000/api/factures/" + id);
}

function findById(id) {
  return Axios.get("http://localhost:8000/api/factures/" + id).then(
    response => response.data
  );
}

function edit(id, invoice) {
  return Axios.put("http://localhost:8000/api/factures/" + id, {
    ...invoice,
    customer: `/api/customers/${invoice.customer}`
  });
}

function create(invoice) {
  return Axios.post("http://localhost:8000/api/factures", {
    ...invoice,
    customer: `/api/customers/${invoice.customer}`
  });
}

export default {
  findAll: findAll,
  delete: deleteFacture,
  findById,
  edit,
  create
};
