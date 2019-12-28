import axios from "axios";
import cache from "./cache";
import { CUSTOMERS_API } from "../config";

async function findAll() {
  const cachedCustomers = await cache.get("customers");

  if (cachedCustomers) return cachedCustomers;

  return axios.get(CUSTOMERS_API).then(response => {
    const customers = response.data["hydra:member"];
    cache.set("customers", customers);
    return customers;
  });
}

function deleteCustomer(id) {
  return axios.delete(CUSTOMERS_API + "/" + id).then(async response => {
    const cachedCustomers = await cache.get("customers");
    if (cachedCustomers) {
      cache.set(
        "customers",
        cachedCustomers.filter(c => c.id !== id)
      );
    }

    return response;
  });
}

function findById(id) {
  return axios.get(CUSTOMERS_API + "/" + id).then(response => response.data);
}

function edit(id, customer) {
  return axios.put(CUSTOMERS_API + "/" + id, customer).then(response => {
    cache.invalidate("customers");
  });
}

function create(customer) {
  return axios.post(CUSTOMERS_API, customer).then(async response => {
    const cachedCustomers = await cache.get("customers");
    if (cachedCustomers) {
      cache.set("customers", [...cachedCustomers, response.data]);
    }

    return response;
  });
}

export default {
  findAll: findAll,
  delete: deleteCustomer,
  findById,
  edit,
  create
};
