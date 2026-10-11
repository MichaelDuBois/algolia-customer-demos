import React, { Component, useState } from 'react';
import './SkeletonCard.css';

export default function SkeletonCard() {
  return (
    <div className="box">
      <div className="skeleton">
        <div className="skeleton-left">
          <div className="square"></div>
        </div>
        <div className="skeleton-right">
          <div className="line h17 w40 m10"></div>
          <div className="line"></div>
          <div className="line h8 w50"></div>
          <div className="line  w75"></div>
          <div className="line h8 w50"></div>
          <div className="line  w75"></div>
        </div>
      </div>
    </div>
  );
}
