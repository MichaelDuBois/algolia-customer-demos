import React from "react";
import "./index.css";
import App from "./App";
import Product from "./Product";
import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";

render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/product" element={<Product />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
