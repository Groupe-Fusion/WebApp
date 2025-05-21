import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  acceptConditions: boolean;
  isAuthenticated: boolean;
  reservations: any[];
  // Autres champs d'utilisateur si nécessaire
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (userData: any) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// Valeurs par défaut du contexte
const defaultContext: UserContextType = {
  user: null,
  isAuthenticated: false,
  loading: true,
  login: () => {},
  logout: () => {},
  updateUser: () => {}
};

// Création du contexte
const UserContext = createContext<UserContextType>(defaultContext);

// Provider
export const UserProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Charger les données utilisateur depuis le localStorage au démarrage
  useEffect(() => {
    const loadUserData = () => {
      try {
        const userData = localStorage.getItem('user');
        const authToken = localStorage.getItem('authToken');
        
        if (userData && authToken) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur :', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Connexion utilisateur
  const login = (userData: any) => {
    // Crée un objet utilisateur sans le mot de passe
    const userToStore = {
      ...userData,
      isAuthenticated: true
    };
    
    // Suppression du mot de passe pour la sécurité
    if (userToStore.password) {
      delete userToStore.password;
    }
    
    // Mise à jour du state
    setUser(userToStore);
    
    // Stockage dans le localStorage
    localStorage.setItem('user', JSON.stringify(userToStore));
    localStorage.setItem('authToken', `simulated-jwt-token-${userData.id}`);
  };

  // Déconnexion utilisateur
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  // Mise à jour des informations utilisateur
  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        updateUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useUser = () => useContext(UserContext);