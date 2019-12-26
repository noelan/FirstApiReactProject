import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navvar";
import CustomersPage from "./pages/CustomersPage";
import FacturesPage from "./pages/FacturesPage";
import HomePage from "./pages/HomePage";
// any CSS you require will output into a single css file (app.css in this case)
require("../css/app.css");

// Need jQuery? Install it with "yarn add jquery", then uncomment to require it.
// const $ = require('jquery');

console.log("Hello Webpack Encore! Edit me in assets/js/app.js");

const App = () => {
  return (
    <HashRouter>
      <Navbar />

      <main className="container pt-5">
        <Switch>
          <Route path="/customers" component={CustomersPage} />
          <Route path="/factures" component={FacturesPage} />
          <Route path="/" component={HomePage} />
        </Switch>
      </main>
    </HashRouter>
  );
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);
