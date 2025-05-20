import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as Tabs from "@radix-ui/react-tabs";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon, CheckIcon } from "@radix-ui/react-icons";
import {
  PackageIcon,
  ClockIcon,
  MapPinIcon,
  TruckIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  RefreshCcwIcon,
} from "lucide-react";

// Type pour une demande de livraison
interface DeliveryRequest {
  id: string;
  reference: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  createdAt: Date;
  scheduledAt: Date;
  completedAt?: Date;
  packageType: string;
  packageWeight: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPostalCode: string;
  receiverName: string;
  receiverPhone: string;
  providerName?: string;
  providerLogo?: string;
  price: number;
}

export default function Demandes() {
  // États
  const [activeTab, setActiveTab] = useState("upcoming");
  const [requests, setRequests] = useState<DeliveryRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<DeliveryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<DeliveryRequest | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Récupération des demandes (simulation avec données mockées)
  useEffect(() => {
    const fetchDeliveryRequests = async () => {
      setLoading(true);
      try {
        // Simuler un délai d'API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Données mockées
        const mockData: DeliveryRequest[] = [
          {
            id: "DR001",
            reference: "DEL-2023-001",
            status: "pending",
            createdAt: new Date("2023-05-18T10:30:00"),
            scheduledAt: new Date(Date.now() + 86400000), // demain
            packageType: "Colis",
            packageWeight: "2 kg",
            deliveryAddress: "123 Rue du Commerce",
            deliveryCity: "Paris",
            deliveryPostalCode: "75001",
            receiverName: "Jean Dupont",
            receiverPhone: "06 12 34 56 78",
            price: 15.99,
          },
          {
            id: "DR002",
            reference: "DEL-2023-002",
            status: "in_progress",
            createdAt: new Date("2023-05-17T14:45:00"),
            scheduledAt: new Date(Date.now() + 43200000), // 12h
            packageType: "Document",
            packageWeight: "0.5 kg",
            deliveryAddress: "45 Avenue Victor Hugo",
            deliveryCity: "Lyon",
            deliveryPostalCode: "69002",
            receiverName: "Marie Martin",
            receiverPhone: "07 98 76 54 32",
            providerName: "Express Delivery",
            providerLogo: "/logos/express-delivery.png",
            price: 8.50,
          },
          {
            id: "DR003",
            reference: "DEL-2023-003",
            status: "completed",
            createdAt: new Date("2023-05-15T09:15:00"),
            scheduledAt: new Date("2023-05-15T14:00:00"),
            completedAt: new Date("2023-05-15T13:47:00"),
            packageType: "Colis",
            packageWeight: "1.2 kg",
            deliveryAddress: "8 Rue des Fleurs",
            deliveryCity: "Bordeaux",
            deliveryPostalCode: "33000",
            receiverName: "Philippe Durand",
            receiverPhone: "06 23 45 67 89",
            providerName: "QuickServe",
            providerLogo: "/logos/quickserve.png",
            price: 12.75,
          },
          {
            id: "DR004",
            reference: "DEL-2023-004",
            status: "cancelled",
            createdAt: new Date("2023-05-14T16:20:00"),
            scheduledAt: new Date("2023-05-16T10:00:00"),
            packageType: "Document",
            packageWeight: "0.3 kg",
            deliveryAddress: "27 Boulevard Haussmann",
            deliveryCity: "Paris",
            deliveryPostalCode: "75009",
            receiverName: "Sophie Leroy",
            receiverPhone: "07 12 34 56 78",
            price: 7.99,
          },
          {
            id: "DR005",
            reference: "DEL-2023-005",
            status: "in_progress",
            createdAt: new Date("2023-05-18T08:10:00"),
            scheduledAt: new Date(Date.now() + 7200000), // 2h
            packageType: "Colis fragile",
            packageWeight: "3.5 kg",
            deliveryAddress: "15 Rue de la République",
            deliveryCity: "Marseille",
            deliveryPostalCode: "13001",
            receiverName: "Thomas Bernard",
            receiverPhone: "06 87 65 43 21",
            providerName: "City Runners",
            providerLogo: "/logos/city-runners.png",
            price: 19.99,
          },
          {
            id: "DR006",
            reference: "DEL-2023-006",
            status: "completed",
            createdAt: new Date("2023-05-10T11:30:00"),
            scheduledAt: new Date("2023-05-11T13:00:00"),
            completedAt: new Date("2023-05-11T12:55:00"),
            packageType: "Colis",
            packageWeight: "4.2 kg",
            deliveryAddress: "3 Place Bellecour",
            deliveryCity: "Lyon",
            deliveryPostalCode: "69002",
            receiverName: "Émilie Petit",
            receiverPhone: "07 65 43 21 09",
            providerName: "Fast Track",
            providerLogo: "/logos/fast-track.png",
            price: 14.50,
          },
        ];

        setRequests(mockData);
      } catch (error) {
        console.error("Erreur lors de la récupération des demandes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryRequests();
  }, []);

  // Filtrage par onglet actif (à venir ou passées)
  useEffect(() => {
    let filtered = [...requests];
    const now = new Date();

    // Filtre par onglet actif (à venir ou passées)
    if (activeTab === "upcoming") {
      filtered = filtered.filter(
        (req) => 
          req.status === "pending" || 
          req.status === "in_progress" || 
          (req.status === "completed" && req.completedAt && req.completedAt > new Date(now.getTime() - 24 * 60 * 60 * 1000))
      );
    } else {
      filtered = filtered.filter(
        (req) => 
          req.status === "completed" || 
          req.status === "cancelled" ||
          (req.completedAt && req.completedAt <= new Date(now.getTime() - 24 * 60 * 60 * 1000))
      );
    }

    // Tri par date (plus récent d'abord)
    filtered.sort((a, b) => b.scheduledAt.getTime() - a.scheduledAt.getTime());

    setFilteredRequests(filtered);
  }, [requests, activeTab]);

  // Changement de l'onglet actif
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Ouvrir la modale de détails
  const openDetails = (request: DeliveryRequest) => {
    setSelectedRequest(request);
    setDetailsOpen(true);
  };

  // Obtenir l'affichage du statut
  const getStatusDisplay = (status: DeliveryRequest["status"]) => {
    switch (status) {
      case "pending":
        return {
          label: "En attente",
          icon: <ClockIcon className="h-4 w-4 text-amber-500" />,
          className: "bg-amber-50 text-amber-700 border-amber-200",
        };
      case "in_progress":
        return {
          label: "En cours",
          icon: <TruckIcon className="h-4 w-4 text-blue-500" />,
          className: "bg-blue-50 text-blue-700 border-blue-200",
        };
      case "completed":
        return {
          label: "Terminée",
          icon: <CheckCircleIcon className="h-4 w-4 text-green-500" />,
          className: "bg-green-50 text-green-700 border-green-200",
        };
      case "cancelled":
        return {
          label: "Annulée",
          icon: <XCircleIcon className="h-4 w-4 text-red-500" />,
          className: "bg-red-50 text-red-700 border-red-200",
        };
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mes Demandes</h1>
        <p className="mt-1 text-sm text-gray-500">
          Consultez et gérez vos demandes passées et à venir
        </p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Tabs.Root value={activeTab} onValueChange={handleTabChange}>
          <Tabs.List className="flex border-b border-gray-200">
            <Tabs.Trigger
              value="upcoming"
              className={`flex items-center px-4 py-3 text-sm font-medium ${
                activeTab === "upcoming"
                  ? "text-blue-600 border-b-2 border-blue-500"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <ClockIcon className="h-4 w-4 mr-2" />
              Demandes à venir
            </Tabs.Trigger>
            <Tabs.Trigger
              value="past"
              className={`flex items-center px-4 py-3 text-sm font-medium ${
                activeTab === "past"
                  ? "text-blue-600 border-b-2 border-blue-500"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              Demandes passées
            </Tabs.Trigger>
          </Tabs.List>

          {/* Contenu des onglets */}
          <Tabs.Content value="upcoming" className="p-4">
            {renderDeliveryRequests()}
          </Tabs.Content>

          <Tabs.Content value="past" className="p-4">
            {renderDeliveryRequests()}
          </Tabs.Content>
        </Tabs.Root>
      </div>

      {/* Dialogue de détails */}
      <Dialog.Root open={detailsOpen} onOpenChange={setDetailsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
          <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[550px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none overflow-auto">
            <Dialog.Title className="text-lg font-bold text-gray-900">
              Détails de la livraison
            </Dialog.Title>
            
            {selectedRequest && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-gray-500">Référence</div>
                    <div className="font-medium">{selectedRequest.reference}</div>
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusDisplay(selectedRequest.status).className}`}>
                      {getStatusDisplay(selectedRequest.status).icon}
                      <span className="ml-1">{getStatusDisplay(selectedRequest.status).label}</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-gray-500">Date de création</div>
                    <div className="font-medium">
                      {selectedRequest.createdAt.toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Date de livraison</div>
                    <div className="font-medium">
                      {selectedRequest.scheduledAt.toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                      {' à '}
                      {selectedRequest.scheduledAt.toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Informations du colis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Type</div>
                      <div className="font-medium">{selectedRequest.packageType}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Poids</div>
                      <div className="font-medium">{selectedRequest.packageWeight}</div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Destinataire</h3>
                  <div className="mb-2">
                    <div className="text-sm text-gray-500">Nom</div>
                    <div className="font-medium">{selectedRequest.receiverName}</div>
                  </div>
                  <div className="mb-2">
                    <div className="text-sm text-gray-500">Téléphone</div>
                    <div className="font-medium">{selectedRequest.receiverPhone}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Adresse</div>
                    <div className="font-medium">
                      {selectedRequest.deliveryAddress}, {selectedRequest.deliveryPostalCode} {selectedRequest.deliveryCity}
                    </div>
                  </div>
                </div>

                {selectedRequest.providerName && (
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Prestataire</h3>
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <TruckIcon className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="ml-3">
                        <div className="font-medium">{selectedRequest.providerName}</div>
                        <div className="text-sm text-gray-500">Prix: {selectedRequest.price.toFixed(2)} €</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Prix</h3>
                  <div className="text-lg font-semibold">{selectedRequest.price.toFixed(2)} €</div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  {selectedRequest.status === "pending" && (
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded text-red-700 bg-white hover:bg-red-50"
                      onClick={() => {
                        alert("Demande annulée");
                        setDetailsOpen(false);
                      }}
                    >
                      <XCircleIcon className="h-4 w-4 mr-2" />
                      Annuler
                    </button>
                  )}
                  
                  {selectedRequest.status === "completed" && (
                    <Link
                      to="/support"
                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <AlertCircleIcon className="h-4 w-4 mr-2" />
                      Signaler un problème
                    </Link>
                  )}
                  
                  {(selectedRequest.status === "pending" || selectedRequest.status === "in_progress") && (
                    <Link
                      to={`/suivi/${selectedRequest.id}`}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <TruckIcon className="h-4 w-4 mr-2" />
                      Suivre la livraison
                    </Link>
                  )}
                  
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Fermer
                    </button>
                  </Dialog.Close>
                </div>
              </div>
            )}
            
            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-4 inline-flex items-center justify-center rounded-full h-8 w-8 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Fermer"
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );

  // Fonction pour afficher les demandes
  function renderDeliveryRequests() {
    if (loading) {
      return (
        <div className="py-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50">
            <RefreshCcwIcon className="h-6 w-6 text-blue-500 animate-spin" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Chargement...</h3>
          <p className="mt-1 text-sm text-gray-500">
            Veuillez patienter pendant que nous récupérons vos demandes.
          </p>
        </div>
      );
    }

    if (filteredRequests.length === 0) {
      return (
        <div className="py-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
            <PackageIcon className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune demande trouvée</h3>
          <p className="mt-1 text-sm text-gray-500">
            {activeTab === "upcoming"
              ? "Vous n'avez aucune demande de livraison à venir."
              : "Vous n'avez aucune demande de livraison passée."}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredRequests.map((request) => {
          const statusDisplay = getStatusDisplay(request.status);
          
          return (
            <div
              key={request.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4 sm:p-5">
                <div className="sm:flex sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900">
                        {request.reference}
                      </h3>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusDisplay.className}`}>
                        {statusDisplay.icon}
                        <span className="ml-1">{statusDisplay.label}</span>
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {request.price.toFixed(2)} €
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {request.createdAt.toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-start">
                      <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="ml-2">
                        <h4 className="text-xs font-medium text-gray-500">Date de livraison</h4>
                        <p className="text-sm font-medium">
                          {request.scheduledAt.toLocaleDateString('fr-FR')} à{' '}
                          {request.scheduledAt.toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="ml-2">
                        <h4 className="text-xs font-medium text-gray-500">Adresse</h4>
                        <p className="text-sm font-medium">
                          {request.deliveryCity}, {request.deliveryPostalCode}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <UserIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="ml-2">
                        <h4 className="text-xs font-medium text-gray-500">Destinataire</h4>
                        <p className="text-sm font-medium">
                          {request.receiverName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  {request.status === "pending" && (
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 mr-2"
                      onClick={() => {
                        if (confirm("Êtes-vous sûr de vouloir annuler cette demande ?")) {
                          alert("Demande annulée");
                        }
                      }}
                    >
                      <XCircleIcon className="h-3.5 w-3.5 mr-1" />
                      Annuler
                    </button>
                  )}
                  
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                    onClick={() => openDetails(request)}
                  >
                    Voir détails
                  </button>
                  
                  {(request.status === "pending" || request.status === "in_progress") && (
                    <Link
                      to={`/suivi/${request.id}`}
                      className="ml-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <TruckIcon className="h-3.5 w-3.5 mr-1" />
                      Suivre
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}