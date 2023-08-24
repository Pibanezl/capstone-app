import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App from './App';

test('click en "Mostrar Usuarios" despliega la vista de la sección', () => {
  const { getByTestId, queryByText } = render(<App />);
  const button = getByTestId('mostrarUsuarios');

  fireEvent.click(button);

  expect(queryByText('Administración de Usuarios')).toBeInTheDocument();
});

test('click en "Mostrar Ciudades" despliega la vista de la sección', () => {
  const { getByTestId, queryByText } = render(<App />);
  const button = getByTestId('mostrarCiudades');

  fireEvent.click(button);

  expect(queryByText('Lista de Ciudades')).toBeInTheDocument();
});