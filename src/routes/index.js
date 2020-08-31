import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { Main } from '~/containers';
import CalculateShipping from '~/pages/CalculateShipping';
import Configuration from '~/pages/Configuration';
import HistoryCalculateShipping from '~/pages/HistoryCalculateShipping';
import Packaging from '~/pages/Packaging';
import SearchZipCode from '~/pages/SearchZipCode';

function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Main />}>
        <Route path="/" element={<CalculateShipping />} />

        <Route path="/cep" element={<SearchZipCode />} />

        <Route path="/embalagens" element={<Packaging />} />

        <Route path="/configuracoes" element={<Configuration />} />

        <Route path="/historico" element={<HistoryCalculateShipping />} />
      </Route>

      <Route path="*" element={<h1>Not found</h1>} />
    </Routes>
  );
}

export default MainRoutes;
