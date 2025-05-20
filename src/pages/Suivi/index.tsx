import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  PackageIcon,
  MapPinIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
} from "lucide-react";

// Correction pour les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Icônes personnalisées
const deliveryIcon = new L.Icon({
  iconUrl: "/icons/truck.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

const pickupIcon = new L.Icon({
  iconUrl: "/icons/warehouse.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const dropoffIcon = new L.Icon({
  iconUrl: "/icons/location-pin.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Interface pour la livraison
interface DeliveryTracking {
  id: string;
  reference: string;
  status: "pickup" | "in_transit" | "out_for_delivery" | "delivered";
  estimatedDeliveryTime: Date;
  currentLocation: {
    lat: number;
    lng: number;
  };
  pickupLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  dropoffLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  route: Array<{
    lat: number;
    lng: number;
  }>;
  courier: {
    name: string;
    phone: string;
    photoUrl?: string;
  };
  recipient: {
    name: string;
    phone: string;
    address: string;
  };
  statusUpdates: Array<{
    status: string;
    timestamp: Date;
    description: string;
  }>;
}

export default function Suivi() {
  const { id } = useParams<{ id: string }>();
  const [tracking, setTracking] = useState<DeliveryTracking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simuler la mise à jour de la position en temps réel
  useEffect(() => {
    if (!tracking) return;

    const interval = setInterval(() => {
      setTracking((prev) => {
        if (!prev) return prev;

        // Simulation de déplacement du livreur vers la destination
        if (prev.status !== "delivered") {
          const currentLoc = { ...prev.currentLocation };
          const dropoff = prev.dropoffLocation;

          // Calculer la prochaine position (légèrement plus proche de la destination)
          const moveTowardsDestination = (
            current: number,
            target: number
          ): number => {
            const step = (target - current) * 0.02; // 2% plus proche à chaque mise à jour
            return Math.abs(step) < 0.0001 ? target : current + step;
          };

          const newLat = moveTowardsDestination(currentLoc.lat, dropoff.lat);
          const newLng = moveTowardsDestination(currentLoc.lng, dropoff.lng);

          // Mise à jour de la position actuelle
          return {
            ...prev,
            currentLocation: {
              lat: newLat,
              lng: newLng,
            },
            // Mise à jour du statut si très proche de la destination
            status:
              Math.abs(newLat - dropoff.lat) < 0.001 &&
              Math.abs(newLng - dropoff.lng) < 0.001
                ? "delivered"
                : prev.status === "pickup"
                ? "in_transit"
                : prev.status === "in_transit" &&
                  Math.abs(newLat - dropoff.lat) < 0.01 &&
                  Math.abs(newLng - dropoff.lng) < 0.01
                ? "out_for_delivery"
                : prev.status,
          };
        }
        return prev;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [tracking]);

  // Récupération des données de suivi
  useEffect(() => {
    const fetchTrackingData = async () => {
      setLoading(true);
      try {
        // Simuler un appel API avec délai
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Données mockées pour la démonstration
        const mockData: DeliveryTracking = {
          id: id || "DR001",
          reference: "DEL-2023-001",
          status: "pickup",
          estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000), // +45 min
          currentLocation: {
            lat: 48.8534,
            lng: 2.3488,
          },
          pickupLocation: {
            address: "15 Rue de Rivoli, 75001 Paris",
            lat: 48.8534,
            lng: 2.3488,
          },
          dropoffLocation: {
            address: "1 Avenue des Champs-Élysées, 75008 Paris",
            lat: 48.8698,
            lng: 2.3075,
          },
          route: [
            { lat: 48.8534, lng: 2.3488 },
            { lat: 48.8565, lng: 2.345 },
            { lat: 48.861, lng: 2.336 },
            { lat: 48.865, lng: 2.327 },
            { lat: 48.8698, lng: 2.3075 },
          ],
          courier: {
            name: "Thomas Martin",
            phone: "06 12 34 56 78",
            photoUrl: "/avatars/courier.jpg",
          },
          recipient: {
            name: "Marie Dubois",
            phone: "07 98 76 54 32",
            address: "1 Avenue des Champs-Élysées, 75008 Paris",
          },
          statusUpdates: [
            {
              status: "Commande reçue",
              timestamp: new Date(Date.now() - 90 * 60 * 1000),
              description:
                "Votre commande a été reçue et est en cours de traitement.",
            },
            {
              status: "En préparation",
              timestamp: new Date(Date.now() - 60 * 60 * 1000),
              description: "Votre colis est en cours de préparation.",
            },
            {
              status: "Récupération",
              timestamp: new Date(Date.now() - 15 * 60 * 1000),
              description: "Le coursier a récupéré votre colis.",
            },
          ],
        };

        setTracking(mockData);
      } catch (err) {
        console.error(
          "Erreur lors de la récupération des données de suivi:",
          err
        );
        setError(
          "Impossible de récupérer les informations de suivi. Veuillez réessayer plus tard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingData();
  }, [id]);

  // Statut de la livraison en français
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "pickup":
        return "Colis récupéré";
      case "in_transit":
        return "En transit";
      case "out_for_delivery":
        return "En cours de livraison";
      case "delivered":
        return "Livré";
      default:
        return "Statut inconnu";
    }
  };

  // Convertir en pourcentage de progression
  const getProgressPercentage = (status: string): number => {
    switch (status) {
      case "pickup":
        return 25;
      case "in_transit":
        return 50;
      case "out_for_delivery":
        return 75;
      case "delivered":
        return 100;
      default:
        return 0;
    }
  };

  // Calcul du temps estimé restant
  const getEstimatedTimeRemaining = (): string => {
    if (!tracking || tracking.status === "delivered") return "Livré";

    const now = new Date();
    const estimatedTime = new Date(tracking.estimatedDeliveryTime);
    const diff = estimatedTime.getTime() - now.getTime();

    if (diff <= 0) return "Arrivée imminente";

    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} heure${hours > 1 ? "s" : ""} ${remainingMinutes} minute${
      remainingMinutes > 1 ? "s" : ""
    }`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-xl font-medium text-gray-700">
          Chargement du suivi...
        </span>
      </div>
    );
  }

  if (error || !tracking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-red-500 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Impossible de charger le suivi
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          {error ||
            "Livraison introuvable. Veuillez vérifier la référence et réessayer."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Suivi de livraison</h1>
        <p className="mt-1 text-sm text-gray-500">
          Référence: <span className="font-medium">{tracking.reference}</span>
        </p>
      </div>

      {/* Disposition verticale avec carte en haut et informations en dessous */}
      <div className="flex flex-col space-y-8">
        {/* Carte de suivi - occupe toute la largeur */}
        <div className="bg-white shadow rounded-lg overflow-hidden h-[500px]">
          <MapContainer
            center={[
              (tracking.pickupLocation.lat + tracking.dropoffLocation.lat) / 2,
              (tracking.pickupLocation.lng + tracking.dropoffLocation.lng) / 2,
            ]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Point de départ */}
            <Marker
              position={[
                tracking.pickupLocation.lat,
                tracking.pickupLocation.lng,
              ]}
              icon={pickupIcon}
            >
              <Popup>
                Point de départ
                <br />
                {tracking.pickupLocation.address}
              </Popup>
            </Marker>

            {/* Point d'arrivée */}
            <Marker
              position={[
                tracking.dropoffLocation.lat,
                tracking.dropoffLocation.lng,
              ]}
              icon={dropoffIcon}
            >
              <Popup>
                Destination
                <br />
                {tracking.recipient.address}
              </Popup>
            </Marker>

            {/* Position actuelle du livreur */}
            <Marker
              position={[
                tracking.currentLocation.lat,
                tracking.currentLocation.lng,
              ]}
              icon={deliveryIcon}
            >
              <Popup>
                Position du livreur
                <br />
                {tracking.courier.name}
              </Popup>
            </Marker>

            {/* Trajet prévu */}
            <Polyline
              positions={tracking.route.map((point) => [point.lat, point.lng])}
              color="#3b82f6"
              weight={3}
              opacity={0.7}
              dashArray="5, 10"
            />
          </MapContainer>
        </div>

        {/* Informations de suivi en dessous de la carte */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Section résumé et barre de progression */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <div className="rounded-full bg-blue-100 p-3">
                <PackageIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {getStatusLabel(tracking.status)}
                </h2>
                <p className="text-sm text-gray-500">
                  {tracking.status !== "delivered" ? (
                    <>
                      Livraison estimée dans:{" "}
                      <span className="font-medium">
                        {getEstimatedTimeRemaining()}
                      </span>
                    </>
                  ) : (
                    <>
                      Livré le:{" "}
                      <span className="font-medium">
                        {new Date().toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Barre de progression */}
            <div className="mb-4">
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
                  <div
                    style={{
                      width: `${getProgressPercentage(tracking.status)}%`,
                    }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-4 h-4 rounded-full mb-1 ${
                        getProgressPercentage(tracking.status) >= 25
                          ? "bg-blue-600"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <span>Récupéré</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-4 h-4 rounded-full mb-1 ${
                        getProgressPercentage(tracking.status) >= 50
                          ? "bg-blue-600"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <span>En transit</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-4 h-4 rounded-full mb-1 ${
                        getProgressPercentage(tracking.status) >= 75
                          ? "bg-blue-600"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <span>En livraison</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-4 h-4 rounded-full mb-1 ${
                        getProgressPercentage(tracking.status) >= 100
                          ? "bg-blue-600"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <span>Livré</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grille de 3 sections pour les informations détaillées */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {/* Informations du coursier */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">
                Votre coursier
              </h3>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {tracking.courier.photoUrl ? (
                    <img
                      src={tracking.courier.photoUrl}
                      alt={tracking.courier.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-6 w-6 text-gray-500" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {tracking.courier.name}
                  </p>
                  <a
                    href={`tel:${tracking.courier.phone}`}
                    className="text-sm text-blue-600 flex items-center mt-1"
                  >
                    <PhoneIcon className="h-3 w-3 mr-1" />
                    {tracking.courier.phone}
                  </a>
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
                Contacter
              </button>
            </div>

            {/* Détails de livraison */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">
                Détails de la livraison
              </h3>

              <div className="flex items-start">
                <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="ml-2">
                  <p className="text-xs text-gray-500">
                    Heure estimée de livraison
                  </p>
                  <p className="text-sm font-medium">
                    {tracking.estimatedDeliveryTime.toLocaleTimeString(
                      "fr-FR",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="ml-2">
                  <p className="text-xs text-gray-500">Adresse de livraison</p>
                  <p className="text-sm font-medium">
                    {tracking.recipient.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <UserIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="ml-2">
                  <p className="text-xs text-gray-500">Destinataire</p>
                  <p className="text-sm font-medium">
                    {tracking.recipient.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline des statuts */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">
                Historique de statut
              </h3>
              <div className="space-y-4 max-h-40 overflow-y-auto pr-2">
                {tracking.status === "delivered" && (
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="bg-green-500 rounded-full h-4 w-4"></div>
                      <div className="flex-grow bg-green-500 w-px"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Livré</p>
                      <p className="text-xs text-gray-500">
                        {new Date().toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-sm mt-1">
                        Votre colis a été livré avec succès.
                      </p>
                    </div>
                  </div>
                )}

                {tracking.statusUpdates.map((update, index) => (
                  <div key={index} className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="bg-blue-500 rounded-full h-4 w-4"></div>
                      <div
                        className={`flex-grow ${
                          index === tracking.statusUpdates.length - 1
                            ? "bg-transparent"
                            : "bg-blue-500"
                        } w-px`}
                      ></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {update.status}
                      </p>
                      <p className="text-xs text-gray-500">
                        {update.timestamp.toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-sm mt-1">{update.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
