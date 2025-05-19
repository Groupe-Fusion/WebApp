import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  StarIcon,
  MapPinIcon,
  TruckIcon,
  ClockIcon,
  Filter,
  Check,
} from "lucide-react";
import * as Slider from "@radix-ui/react-slider";
import * as Popover from "@radix-ui/react-popover";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import * as Checkbox from "@radix-ui/react-checkbox";

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
}

// Types de tri disponibles
type SortType = "price" | "delay";

export default function LivraisonExpressResultats() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [allProviders, setAllProviders] = useState<DeliveryProvider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<
    DeliveryProvider[]
  >([]);
  const formData = location.state?.formData as FormData | undefined;

  // Fonction pour sélectionner un prestataire et rediriger vers le paiement
  const handleSelectProvider = (provider: DeliveryProvider) => {
    navigate("/livraison-express/paiement", {
      state: {
        provider: provider,
        formData: formData,
      },
    });
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
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Données simulées des prestataires
        const mockProviders: DeliveryProvider[] = [
          {
            id: "1",
            name: "Express Delivery Pro",
            logo: "/logos/express-delivery.png",
            rating: 4.8,
            reviewCount: 512,
            price: 12.99,
            delayMinutes: 15,
            distance: 3.2,
          },
          {
            id: "2",
            name: "QuickServe",
            logo: "/logos/quickserve.png",
            rating: 4.6,
            reviewCount: 328,
            price: 9.99,
            delayMinutes: 25,
            distance: 5.7,
          },
          {
            id: "3",
            name: "Elite Delivery",
            logo: "/logos/elite-delivery.png",
            rating: 4.9,
            reviewCount: 712,
            price: 18.5,
            delayMinutes: 10,
            distance: 2.8,
          },
          {
            id: "4",
            name: "City Runners",
            logo: "/logos/city-runners.png",
            rating: 4.5,
            reviewCount: 287,
            price: 11.25,
            delayMinutes: 20,
            distance: 4.3,
          },
          {
            id: "5",
            name: "Fast Track",
            logo: "/logos/fast-track.png",
            rating: 4.3,
            reviewCount: 185,
            price: 8.75,
            delayMinutes: 30,
            distance: 6.1,
          },
        ];

        // Enregistrer tous les prestataires
        setAllProviders(mockProviders);

        // Initialiser les filtres avec des valeurs basées sur les données
        const maxPrice = Math.max(...mockProviders.map((p) => p.price));
        setPriceRange([0, Math.ceil(maxPrice)]);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des prestataires:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [formData]);

  // Appliquer les filtres et le tri
  useEffect(() => {
    if (allProviders.length === 0) return;

    let result = [...allProviders];

    // Filtrer par plage de prix
    result = result.filter(
      (provider) =>
        provider.price >= priceRange[0] && provider.price <= priceRange[1]
    );

    // Filtrer par délai maximal
    if (maxDelay !== null) {
      result = result.filter((provider) => provider.delayMinutes <= maxDelay);
    }

    // Filtrer par livraison rapide
    if (showFastDeliveryOnly) {
      result = result.filter((provider) => provider.delayMinutes <= 20);
    }

    // Filtrer par notation élevée
    if (showHighRatedOnly) {
      result = result.filter((provider) => provider.rating >= 4.5);
    }

    // Appliquer le tri
    if (sortType === "price") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortType === "delay") {
      result.sort((a, b) => a.delayMinutes - b.delayMinutes);
    }

    setFilteredProviders(result);
  }, [
    allProviders,
    sortType,
    priceRange,
    maxDelay,
    showFastDeliveryOnly,
    showHighRatedOnly,
  ]);

  // Si pas de données de formulaire, afficher un message d'erreur
  if (!formData && !loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            Aucune donnée de livraison
          </h2>
          <p className="text-gray-600 mb-6">
            Aucune information de livraison n'a été trouvée. Veuillez remplir le
            formulaire de livraison express.
          </p>
          <Link
            to="/livraison-express"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2554f8] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Retour au formulaire
          </Link>
        </div>
      </div>
    );
  }

  // Obtenir le min et max des prix pour le slider
  const minPrice = Math.min(...allProviders.map((p) => p.price));
  const maxPrice = Math.max(...allProviders.map((p) => p.price));

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setSortType("price");
    setPriceRange([0, Math.ceil(maxPrice)]);
    setMaxDelay(null);
    setShowFastDeliveryOnly(false);
    setShowHighRatedOnly(false);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Prestataires disponibles
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {filteredProviders.length} prestataires trouvés
          </p>
        </div>

        {/* Options de filtrage et de tri */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sélection du critère de tri */}
          <ToggleGroup.Root
            type="single"
            defaultValue="price"
            value={sortType}
            onValueChange={(value) => value && setSortType(value as SortType)}
            className="inline-flex rounded-md shadow-sm overflow-hidden"
          >
            <ToggleGroup.Item
              value="price"
              className={`px-4 py-2 text-sm font-medium border ${
                sortType === "price"
                  ? "bg-blue-50 text-blue-700 border-blue-200 z-10"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              Prix
            </ToggleGroup.Item>
            <ToggleGroup.Item
              value="delay"
              className={`px-4 py-2 text-sm font-medium border ${
                sortType === "delay"
                  ? "bg-blue-50 text-blue-700 border-blue-200 z-10"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              Délai
            </ToggleGroup.Item>
          </ToggleGroup.Root>

          {/* Popover pour les filtres avancés */}
          <Popover.Root>
            <Popover.Trigger asChild>
              <button className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 inline-flex items-center gap-2 hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                Filtres
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                className="w-[300px] bg-white rounded-md shadow-lg border border-gray-200 p-4 z-50"
                sideOffset={5}
              >
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2 text-black">
                      Prix (€)
                    </h3>
                    <div className="px-2 py-4">
                      <Slider.Root
                        className="relative flex items-center select-none touch-none w-full h-5"
                        value={priceRange}
                        min={0}
                        max={Math.ceil(maxPrice) + 5}
                        step={1}
                        minStepsBetweenThumbs={1}
                        onValueChange={(value) =>
                          setPriceRange([value[0], value[1]])
                        }
                      >
                        <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                          <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
                        </Slider.Track>
                        <Slider.Thumb
                          className="block w-5 h-5 bg-white rounded-full border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          aria-label="Prix minimum"
                        />
                        <Slider.Thumb
                          className="block w-5 h-5 bg-white rounded-full border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          aria-label="Prix maximum"
                        />
                      </Slider.Root>

                      <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>{priceRange[0].toFixed(2)}€</span>
                        <span>{priceRange[1].toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2 text-black">
                      Délai de livraison
                    </h3>
                    <select
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      value={maxDelay === null ? "" : maxDelay.toString()}
                      onChange={(e) =>
                        setMaxDelay(
                          e.target.value ? parseInt(e.target.value) : null
                        )
                      }
                    >
                      <option value="">Tous les délais</option>
                      <option value="15">Moins de 15 minutes</option>
                      <option value="30">Moins de 30 minutes</option>
                      <option value="45">Moins de 45 minutes</option>
                      <option value="60">Moins d'une heure</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox.Root
                        className="h-4 w-4 rounded border border-gray-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-white"
                        id="fastDelivery"
                        checked={showFastDeliveryOnly}
                        onCheckedChange={(checked) =>
                          setShowFastDeliveryOnly(checked === true)
                        }
                      >
                        <Checkbox.Indicator>
                          <Check className="h-3 w-3 text-blue-600" />
                        </Checkbox.Indicator>
                      </Checkbox.Root>
                      <label
                        htmlFor="fastDelivery"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Livraison rapide (≤ 20 min)
                      </label>
                    </div>

                    <div className="flex items-center">
                      <Checkbox.Root
                        className="h-4 w-4 rounded border border-gray-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-white"
                        id="highRated"
                        checked={showHighRatedOnly}
                        onCheckedChange={(checked) =>
                          setShowHighRatedOnly(checked === true)
                        }
                      >
                        <Checkbox.Indicator>
                          <Check className="h-3 w-3 text-blue-600" />
                        </Checkbox.Indicator>
                      </Checkbox.Root>
                      <label
                        htmlFor="highRated"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Bien notés (≥ 4.5 étoiles)
                      </label>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between">
                    <button
                      className="text-sm text-blue-600 hover:underline"
                      onClick={resetFilters}
                    >
                      Réinitialiser les filtres
                    </button>
                    <Popover.Close asChild>
                      <button className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700">
                        Appliquer
                      </button>
                    </Popover.Close>
                  </div>
                </div>
                <Popover.Arrow className="fill-white" />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </div>

      {/* Message indiquant les filtres actifs */}
      {(showFastDeliveryOnly ||
        showHighRatedOnly ||
        maxDelay !== null ||
        priceRange[0] > 0 ||
        priceRange[1] < maxPrice) && (
        <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mb-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-blue-700">
              <span className="font-medium">Filtres actifs:</span>{" "}
              {priceRange[0] > 0 || priceRange[1] < maxPrice
                ? `Prix entre ${priceRange[0].toFixed(
                    2
                  )}€ et ${priceRange[1].toFixed(2)}€`
                : ""}
              {maxDelay !== null ? ` • Délai maximum: ${maxDelay} min` : ""}
              {showFastDeliveryOnly ? " • Livraison rapide" : ""}
              {showHighRatedOnly ? " • Bien notés" : ""}
            </div>
            <button
              className="text-xs text-blue-600 hover:underline"
              onClick={resetFilters}
            >
              Effacer tout
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredProviders.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-gray-600 mb-4">
            Aucun prestataire trouvé
          </h2>
          <p className="text-gray-600 mb-6">
            Aucun prestataire ne correspond à vos critères. Essayez d'ajuster
            vos filtres.
          </p>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2554f8] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={resetFilters}
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredProviders.map((provider) => (
            <div
              key={provider.id}
              className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                    {/* Fallback pour les logos non disponibles */}
                    <TruckIcon className="h-10 w-10 text-gray-500" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h2 className="text-lg font-medium text-gray-900">
                      {provider.name}
                    </h2>
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
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                        <span>Dans {provider.delayMinutes} min</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <span className="text-xl font-semibold text-gray-900">
                          {provider.price.toFixed(2)} €
                        </span>
                      </div>
                      <button
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2554f8] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={() => handleSelectProvider(provider)}
                      >
                        Sélectionner
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
