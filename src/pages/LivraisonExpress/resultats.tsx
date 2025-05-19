import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { StarIcon, MapPinIcon, TruckIcon, ClockIcon } from 'lucide-react'

// Type pour les données du formulaire (copié depuis LivraisonExpress.tsx)
type FormData = {
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  receiverCity: string;
  receiverPostalCode: string;
  packageType: string;
  weight: string;
  dimensions?: string;
  fragile: boolean;
  deliverNow: boolean;
  deliveryDate?: string;
  deliveryTime?: string;
  insurance: boolean;
  signature: boolean;
  specialInstructions?: string;
};

// Type pour un prestataire de livraison
interface DeliveryProvider {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  price: number;
  delayMinutes: number;
  distance: number;
  availableSlots: string[];
}

export default function LivraisonExpressResultats() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState<DeliveryProvider[]>([]);
  const formData = location.state?.formData as FormData | undefined;
  const reservationId = location.state?.reservationId as string | undefined;

  console.log("FormData:", formData);
  console.log("Reservation ID:", reservationId);

  // Fonction pour sélectionner un prestataire et rediriger vers le paiement
  const handleSelectProvider = async (provider: DeliveryProvider) => {
    // Vérifier si on a un ID de réservation
    if (!reservationId) {
      console.error("ID de réservation manquant");
      setError(
        "Impossible de mettre à jour la réservation: identifiant manquant"
      );
      return;
    }

    setSubmitting(true);

    try {
      // 1. D'abord récupérer les données actuelles de la réservation
      const getResponse = await fetch(
        `http://57.128.212.12:8082/api/reservations/${reservationId}`
      );

      if (!getResponse.ok) {
        throw new Error(
          `Erreur lors de la récupération de la réservation: ${getResponse.status}`
        );
      }

      // 2. Obtenir les données actuelles
      const reservationData = await getResponse.json();
      console.log("Réservation existante:", reservationData);

      // 3. Mettre à jour uniquement le champ prestataireId
      const updatedData = {
        ...reservationData,
        prestataireId: provider.id,
        // // Mettre à jour le statut si nécessaire
        // reservationStatus: "pending", // Ou un autre statut approprié
        // // Mettre à jour le prix depuis le prestataire si nécessaire
        // price: provider.price,
      };

      // 4. Envoyer la réservation complète mise à jour
      const response = await fetch(
        `http://57.128.212.12:8082/api/reservations/${reservationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message ||
            "Erreur lors de la mise à jour de la réservation"
        );
      }

      // Redirection vers la page de paiement avec les infos du prestataire
      navigate("/livraison-express/paiement", {
        state: {
          provider: provider,
          formData: formData,
          reservationId: reservationId,
        },
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la réservation:", error);
      setError(
        error instanceof Error ? error.message : "Une erreur est survenue"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // États de filtrage et de tri
  const [sortType, setSortType] = useState<SortType>("price");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [maxDelay, setMaxDelay] = useState<number | null>(null);
  const [showFastDeliveryOnly, setShowFastDeliveryOnly] = useState(false);
  const [showHighRatedOnly, setShowHighRatedOnly] = useState(false);

  // Récupération des prestataires disponibles
  useEffect(() => {
    // Vérifier que les données du formulaire existent
    if (!formData) {
      return;
    }
    
    // Simuler un appel API pour obtenir les prestataires disponibles
    const fetchProviders = async () => {
      setLoading(true);
      try {
        // Dans un cas réel, vous enverriez les données du formulaire à l'API
        // et recevriez des résultats filtrés en fonction des critères
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Données simulées des prestataires
        const mockProviders: DeliveryProvider[] = [
          {
            id: '1',
            name: 'Express Delivery Pro',
            logo: '/logos/express-delivery.png',
            rating: 4.8,
            reviewCount: 512,
            price: 12.99,
            delayMinutes: formData.deliverNow ? 15 : 0,
            distance: 3.2,
            availableSlots: ['Aujourd\'hui', 'Demain', 'Après-demain']
          },
          {
            id: '2',
            name: 'QuickServe',
            logo: '/logos/quickserve.png',
            rating: 4.6,
            reviewCount: 328,
            price: 9.99,
            delayMinutes: formData.deliverNow ? 25 : 0,
            distance: 5.7,
            availableSlots: ['Aujourd\'hui', 'Demain', 'Après-demain']
          },
          {
            id: '3',
            name: 'Elite Delivery',
            logo: '/logos/elite-delivery.png',
            rating: 4.9,
            reviewCount: 712,
            price: 18.50,
            delayMinutes: formData.deliverNow ? 10 : 0,
            distance: 2.8,
            availableSlots: ['Aujourd\'hui', 'Demain']
          },
          {
            id: '4',
            name: 'City Runners',
            logo: '/logos/city-runners.png',
            rating: 4.5,
            reviewCount: 287,
            price: 11.25,
            delayMinutes: formData.deliverNow ? 20 : 0,
            distance: 4.3,
            availableSlots: ['Aujourd\'hui', 'Demain', 'Après-demain']
          },
          {
            id: '5',
            name: 'Fast Track',
            logo: '/logos/fast-track.png',
            rating: 4.3,
            reviewCount: 185,
            price: 8.75,
            delayMinutes: formData.deliverNow ? 30 : 0,
            distance: 6.1,
            availableSlots: ['Demain', 'Après-demain']
          }
        ];
        
        // Trier par délai si livraison immédiate, sinon par prix
        const sortedProviders = formData.deliverNow 
          ? [...mockProviders].sort((a, b) => a.delayMinutes - b.delayMinutes)
          : [...mockProviders].sort((a, b) => a.price - b.price);
        
        setProviders(sortedProviders);
      } catch (error) {
        console.error('Erreur lors de la récupération des prestataires:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProviders();
  }, [formData]);
  
  // Si pas de données de formulaire, afficher un message d'erreur
  if (!formData && !loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Aucune donnée de livraison</h2>
          <p className="text-gray-600 mb-6">Aucune information de livraison n'a été trouvée. Veuillez remplir le formulaire de livraison express.</p>
          <Link to="/livraison-express" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2554f8] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Retour au formulaire
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Prestataires disponibles</h1>
        <div className="mt-2 text-sm text-gray-600">
          {formData?.deliverNow ? (
            <p>Livraison immédiate pour colis {formData.packageType} à {formData.receiverCity}</p>
          ) : (
            <p>Livraison le {formData?.deliveryDate} pour colis {formData?.packageType} à {formData?.receiverCity}</p>
          )}
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {providers.map((provider) => (
            <div key={provider.id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                    {/* Fallback pour les logos non disponibles */}
                    <TruckIcon className="h-10 w-10 text-gray-500" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h2 className="text-lg font-medium text-gray-900">{provider.name}</h2>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                      <span>{provider.rating}</span>
                      <span className="mx-1">•</span>
                      <span>{provider.reviewCount} avis</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                        <span>À {provider.distance} km</span>
                      </div>
                      {formData?.deliverNow && (
                        <div className="flex items-center text-sm text-gray-500">
                          <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                          <span>Dans {provider.delayMinutes} min</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <span className="text-xl font-semibold text-gray-900">{provider.price.toFixed(2)} €</span>
                        {formData?.insurance && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            Assurance incluse
                          </span>
                        )}
                      </div>
                      <button
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2554f8] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={() => alert(`Prestataire ${provider.name} sélectionné!`)}
                      >
                        Sélectionner
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {!formData?.deliverNow && (
                <div className="border-t border-gray-200 px-6 py-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Créneaux disponibles :</h3>
                  <div className="flex flex-wrap gap-2">
                    {provider.availableSlots.map((slot, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {slot}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}