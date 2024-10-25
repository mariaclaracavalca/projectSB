import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from "jwt-decode";  // Import corretto di jwtDecode

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);  // Stato di caricamento

  // Funzione per verificare lo stato di autenticazione
  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    console.log("Token recuperato da localStorage:", token);  // Log per debug

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Token decodificato:", decoded);  // Log per vedere il token decodificato
        const idToSave = decoded.id || decoded.googleId;
        setUserId(idToSave);
        setIsAuthenticated(true);  // Autentica l'utente se il token è valido
      } catch (error) {
        console.error("Token non valido:", error);
        setIsAuthenticated(false);  // Se il token è corrotto, resetta l'autenticazione
      }
    } else {
      console.log("Nessun token trovato in localStorage");
      setIsAuthenticated(false);  // Se non c'è token, non è autenticato
    }

    setLoading(false);  // Fine del caricamento
  };

  // Funzione per recuperare il token dalla query parameter e salvarlo in localStorage
  const handleGoogleCallback = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      console.log("Token trovato nella URL:", token);

      // Salva il token in localStorage
      localStorage.setItem('token', token);
      checkAuthStatus();  // Verifica lo stato di autenticazione dopo aver salvato il token

      // Rimuovi il token dalla URL per sicurezza (facoltativo)
      window.location.href = '/'  // Reindirizza alla rotta protetta o a una pagina di destinazione
    } else {
      console.log("Nessun token trovato nella URL");
    }
  };

  // Verifica lo stato di autenticazione quando il componente viene montato
  useEffect(() => {
    // Recupera il token dalla URL se presente (callback da Google)
    handleGoogleCallback();
    // Verifica lo stato di autenticazione
    checkAuthStatus();
  }, []);  // Viene eseguito solo al montaggio del componente

  // Funzione per eseguire il login (può essere chiamata per altri tipi di autenticazione)
  const login = (token, id) => {
    console.log("Token passato a login:", token);  // Log per vedere il token passato
    console.log("ID passato a login:", id);  // Log per vedere l'ID passato

    localStorage.setItem('token', token);  // Salva il token nel localStorage
    localStorage.setItem('userId', id);  // Salva l'ID

    console.log("Login eseguito. Token e ID salvati.");
    checkAuthStatus();  // Verifica lo stato di autenticazione dopo il login
  };

  // Funzione per eseguire il logout
  const logout = () => {
    localStorage.removeItem('token');  // Rimuovi il token dal localStorage
    localStorage.removeItem('userId');  // Rimuovi l'ID dal localStorage
    setUserId(null);  // Resetta lo stato dell'ID
    setIsAuthenticated(false);  // Resetta lo stato di autenticazione
    console.log("Logout eseguito. Token e ID rimossi.");
  };

  if (loading) {
    return <div>Caricamento...</div>;  // Mostra uno stato di caricamento fino a che il token non viene verificato
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
