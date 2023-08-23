import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App from './App';

test('clicking "Mostrar Usuarios" button toggles user section', () => {
  const { getByTestId, queryByText } = render(<App />);
  const button = getByTestId('mostrarUsuarios');

  fireEvent.click(button);

  expect(queryByText('Administración de Usuarios')).toBeInTheDocument();
});

test('clicking "Mostrar Ciudades" button toggles city section', () => {
  const { getByTestId, queryByText } = render(<App />);
  const button = getByTestId('mostrarCiudades');

  fireEvent.click(button);

  expect(queryByText('Lista de Ciudades')).toBeInTheDocument();
});