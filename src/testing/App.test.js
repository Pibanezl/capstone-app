import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Dropdown from "../components/dropdownMenu"
import DropdownProfile from "../components/dropdownProfile"
describe("dropdown-test", () => {
    it("debería abrirse el menú opciones", async () => {
        render(<Dropdown />);
        const valeButton = screen.getByTestId('mi-boton'); // Asegúrate de que tu botón tenga un testID
        fireEvent.click(valeButton);
        // Agrega aquí las afirmaciones o verificaciones que necesites después de hacer clic en el botón
    });
});

describe("dropdown-test-profile", () => {
    it("debería abrirse el menú del perfil", async () => {
        render(<DropdownProfile />);
        const valeButton = screen.getByTestId('mi-boton-profile'); // Asegúrate de que tu botón tenga un testID
        fireEvent.click(valeButton);
        // Agrega aquí las afirmaciones o verificaciones que necesites después de hacer clic en el botón
    });
});
