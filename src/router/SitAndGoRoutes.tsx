
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SitAndGoLobby from '@/pages/SitAndGo/SitAndGoLobby';

export const SitAndGoRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SitAndGoLobby />} />
    </Routes>
  );
};

export default SitAndGoRoutes;
