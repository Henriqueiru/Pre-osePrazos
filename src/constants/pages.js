import React from 'react';

import {
  faCalculator,
  faArchive,
  faSearch,
  faCogs,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Pages = [
  {
    id: 1,
    title: 'Calcular',
    href: '/',
    icon: <FontAwesomeIcon icon={faCalculator} />,
  },
  {
    id: 2,
    title: 'CEP',
    href: '/cep',
    icon: <FontAwesomeIcon icon={faSearch} />,
  },
  {
    id: 3,
    title: 'Embal',
    href: '/embalagens',
    icon: <FontAwesomeIcon icon={faArchive} />,
  },
  {
    id: 4,
    title: 'Config',
    href: '/configuracoes',
    icon: <FontAwesomeIcon icon={faCogs} />,
  },
];

export default Pages;
