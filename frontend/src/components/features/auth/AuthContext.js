import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Define API base URL - use your computer's IP address that's accessible from your phone
// توفير عنوان URL أساسي للAPI - استخدم عنوان IP للكمبيوتر الذي يمكن الوصول إليه من هاتفك
const API_BASE_URL = "http://192.168.1.6:8080";

// Crée un contexte d'authentification
const AuthContext = createContext(null);

// Fournit le contexte d'authentification aux composants enfants
export const AuthProvider = ({ children }) => {
  // État pour stocker les informations de l'utilisateur connecté
  const [user, setUser] = useState(null);
  // État pour gérer le chargement initial des données utilisateur
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifie s'il y a un token dans le localStorage au chargement de l'application
    const token = localStorage.getItem('token');
    if (token) {
      // Si un token existe, tente de récupérer les informations de l'utilisateur
      axios.get(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` } // Envoie le token dans l'en-tête Authorization
      })
      .then(response => {
        // Si la requête réussit, met à jour l'état de l'utilisateur avec les données reçues
        // Le backend retourne maintenant l'objet utilisateur complet
        setUser(response.data);
      })
      .catch(() => {
        // Si la requête échoue (token invalide, etc.), supprime le token du localStorage
        localStorage.removeItem('token');
      })
      .finally(() => {
        // Dans tous les cas (succès ou échec), indique que le chargement est terminé
        setLoading(false);
      });
    } else {
      // S'il n'y a pas de token, indique que le chargement est terminé
      setLoading(false);
    }
  }, []); // Ce hook s'exécute une seule fois au montage du composant

  // Fonction asynchrone pour gérer la connexion de l'utilisateur
  const login = async (email, password) => {
    try {
      // Envoie une requête POST à l'API de connexion avec l'email et le mot de passe
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password
      });
      // Extrait le token et les informations utilisateur de la réponse
      // Le backend retourne maintenant un objet avec { token: "...", user: { id: ..., nom: ..., email: ... } }
      const { token, user: userData } = response.data;
      // Stocke le token dans le localStorage pour la persistance de la session
      localStorage.setItem('token', token);
      // Met à jour l'état de l'utilisateur avec les informations reçues de l'objet 'user' imbriqué
      setUser(userData);
      // Retourne un objet indiquant le succès de la connexion
      return { success: true };
    } catch (error) {
      // Si une erreur se produit pendant la connexion
      console.error("Login error:", error);
      // Le backend retourne maintenant l'erreur dans { message: "..." }
      return { 
        success: false, 
        error: error.response?.data?.message || 'Une erreur s\'est produite lors de la connexion' 
      };
    }
  };

  // Fonction pour gérer la déconnexion de l'utilisateur
  const logout = () => {
    // Supprime le token du localStorage
    localStorage.removeItem('token');
    // Réinitialise l'état de l'utilisateur à null
    setUser(null);
  };

  // Function to update user data in context after profile update
  const updateUserInContext = (userData) => {
    // Only update if userData is different from current user
    if (JSON.stringify(userData) !== JSON.stringify(user)) {
      setUser(userData);
    }
  };

  // Crée l'objet de valeur à passer au contexte
  const value = {
    user,      // L'utilisateur connecté (ou null)
    loading,   // L'état de chargement initial
    login,     // La fonction de connexion
    logout,    // La fonction de déconnexion
    updateUserInContext // Fonction pour mettre à jour les données utilisateur
  };

  // Retourne le fournisseur de contexte avec la valeur définie
  // N'affiche les enfants que lorsque le chargement initial est terminé
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  // Vérifie si le hook est utilisé à l'intérieur d'un AuthProvider
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  // Retourne le contexte
  return context;
};