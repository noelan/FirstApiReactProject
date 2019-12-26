import axios from "axios";

function findAll() {
  return axios
    .get("http://localhost:8000/api/factures")
    .then(response => response.data["hydra:member"]);
}

function deleteFacture(id) {
  return axios.delete("http://localhost:8000/api/factures/" + id);
}

export default {
  findAll: findAll,
  delete: deleteFacture
};
