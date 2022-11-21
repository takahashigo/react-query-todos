import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainTask } from '../components/MainTask';
import { MainTag } from '../components/MainTag';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainTask />} />
        <Route path="/tags" element={<MainTag />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
