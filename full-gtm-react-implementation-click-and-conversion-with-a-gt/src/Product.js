import React from "react";
import "./App.css";
import { useLocation } from "react-router-dom";

function Product(props) {
  const location = useLocation();
  const { title, img, description, objectId, queryId, index } = location.state;
  return (
    <div>
      <img src={img} align="left" height={400} alt={img} />
      <div className="hit-name">{title}</div>
      <div className="hit-description">{description}</div>
      <div
        data-insights-object-id={objectId}
        data-insights-index={index}
        data-insights-query-id={queryId}
      >
        <button className="btn-addToCart">Add to cart</button>
      </div>
    </div>
  );
}

export default Product;
