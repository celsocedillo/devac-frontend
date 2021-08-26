
import './App.css';
import React from 'react';
import {  BrowserRouter as Router} from "react-router-dom";
import { Layout } from 'antd';
import {UserProvider}  from './contexts/userContext';
import  Contenedor from "./components/contenedor";

function App() {
  
  return (
      <UserProvider>
        <Router>
        <Contenedor>
        </Contenedor>
        </Router>
      </UserProvider>
        
  );
}

export default App;
