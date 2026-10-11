import React, { Component, useState } from 'react';
import SkeletonCard from './SkeletonCard';
import './SkeletonCard.css';

export default function SkeletonCardGrid() {
  return (
    <div class="container">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}
