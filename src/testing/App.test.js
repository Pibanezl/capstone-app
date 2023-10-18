import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Login from "../screens/Login"
import App from '../App';
import firebaseApp from '../firebase_setup/firebase'; 
