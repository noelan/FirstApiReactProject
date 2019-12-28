import axios from "axios";
import Axios from "axios";
import { FACTURES_API } from "../config";

function findAll() {
  return axios
    .get(FACTURES_API)
    .then(response => response.data["hydra:member"]);
}

function deleteFacture(id) {
  return axios.delete(FACTURES_API + "/" + id);
}

function findById(id) {
  return Axios.get(FACTURES_API + "/" + id).then(response => response.data);
}

function edit(id, invoice) {
  return Axios.put(FACTURES_API + "/" + id, {
    ...invoice,
    customer: `/api/customers/${invoice.customer}`
  });
}

function create(invoice) {
  return Axios.post(FACTURES_API, {
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
