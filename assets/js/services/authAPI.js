import axios from "axios";
import JwtDecode from "jwt-decode";

/**
 * Requête http d'authentification et stockage du token dans le storage et sur axios
 * @param {object} credentials
 */
function authenticate(credentials) {
  return axios
    .post("http://localhost:8000/api/login_check", credentials)
    .then(response => response.data.token)
    .then(token => {
      // je stock le token dans mon local storage
      window.localStorage.setItem("authToken", token);
      // On prévient Axios qu'on a maintenant un header par défaut sur toutes nos futures requetes http
      setAxiosToken(token);
    });
}

/**
 * Déconnexion (suppression du token du localStorage et sur axios)
 */
function logout() {
  window.localStorage.removeItem("authToken");
  delete axios.defaults.headers["Authorization"];
}

/**
 * Positionne le token JWT sur axios
 * @param {strubg} token Le token JWT
 */
function setAxiosToken(token) {
  axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * Mise en place lors du chargement de l'application
 */
function setup() {
  //Voir si on a un token
  const token = window.localStorage.getItem("authToken");
  //Voir il il est valide
  if (token) {
    const { exp: expiration } = JwtDecode(token);

    if (expiration * 1000 > new Date().getTime()) {
      setAxiosToken(token);
    }
  }
}

/**
 * Permet de savoir si on est authentifié ou non
 * @return Boolean
 */
function isAuthenticated() {
  const token = window.localStorage.getItem("authToken");
  if (token) {
    const { exp: expiration } = JwtDecode(token);

    if (expiration * 1000 > new Date().getTime()) {
      return true;
    }
    return false;
  }
  return false;
}

export default {
  authenticate,
  logout,
  setup,
  isAuthenticated
};
