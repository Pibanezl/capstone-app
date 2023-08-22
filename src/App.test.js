import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import React from 'react';

test('debería cambiar el color del botón al hacer clic', () => {
  // Arrange: Renderiza el componente
  const { getByTestId } = render(<App />);

  // Act: Simula un clic en el botón
  const colorButton = getByTestId('cambioColor');
  fireEvent.click(colorButton);

  // Assert: Verifica que el color de fondo haya cambiado a 'red'
  expect(colorButton).toHaveStyle('background-color: red');

  // Act: Simula otro clic en el botón
  fireEvent.click(colorButton);

  // Assert: Verifica que el color de fondo haya cambiado nuevamente a 'blue'
  expect(colorButton).toHaveStyle('background-color: blue');
});

test('debería cambiar la fuente del botón al hacer clic', () => {
  // Arrange: Renderiza el componente
  const { getByTestId } = render(<App />);

  // Act: Simula un clic en el botón
  const fontButton = getByTestId('cambioFuente');
  fireEvent.click(fontButton);

  // Assert: Verifica que la fuente haya cambiado a 'arial'
  expect(fontButton).toHaveStyle('font-family: arial;');

  // Act: Simula otro clic en el botón
  fireEvent.click(fontButton);

  // Assert: Verifica que la fuente haya cambiado nuevamente a 'roboto'
  expect(fontButton).toHaveStyle('font-family: roboto;');
});