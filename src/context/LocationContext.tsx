import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
interface LocationContextType {
  userLocation: string;
  locationError: string | null;
  refreshLocation: () => void;
  coordinates: { latitude: number; longitude: number } | null;
}

// Création du context avec des valeurs par défaut
const LocationContext = createContext<LocationContextType>({
  userLocation: "Chargement...",
  locationError: null,
  refreshLocation: () => {},
  coordinates: null,
});

// Provider
export const LocationProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<string>("Chargement...");
  const [locationError, setLocationError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);

  console.log("userLocation", userLocation);
  console.log("coordinates", coordinates);

  const getLocationData = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            setCoordinates({ latitude, longitude });

            // Utiliser Nominatim (OpenStreetMap) pour le géocodage inverse
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
              {
                headers: {
                  "Accept-Language": "fr",
                },
              }
            );

            if (response.ok) {
              const data = await response.json();
              // Construire une adresse plus courte et lisible
              let address = "";
              if (data.address) {
                const { road, house_number, postcode, city } = data.address;
                address = `${house_number ? house_number + " " : ""}${
                  road || ""
                }, ${postcode || ""}, ${city || ""}`;
              } else {
                address = data.display_name;
              }

              setUserLocation(address);
            } else {
              throw new Error("Erreur lors de la récupération de l'adresse");
            }
          } catch (error) {
            console.error("Erreur de géocodage:", error);
            setLocationError("Adresse non disponible");
          }
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          setLocationError("Localisation non disponible");
        }
      );
    } else {
      setLocationError("Géolocalisation non supportée");
    }
  };

  // Fonction pour actualiser manuellement la localisation
  const refreshLocation = () => {
    setUserLocation("Chargement...");
    setLocationError(null);
    getLocationData();
  };

  // Récupérer la localisation au montage du Provider
  useEffect(() => {
    getLocationData();
  }, []);

  return (
    <LocationContext.Provider 
      value={{
        userLocation,
        locationError,
        refreshLocation,
        coordinates
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

// Hook personnalisé pour utiliser le context
export const useLocation = () => useContext(LocationContext);