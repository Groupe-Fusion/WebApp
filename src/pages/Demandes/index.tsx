import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { useUser } from "../../context/UserContext";

// Type pour une demande de livraison
interface DeliveryRequest {
  id: string;
  reservationId: number;
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
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [requests, setRequests] = useState<DeliveryRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<DeliveryRequest[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] =
    useState<DeliveryRequest | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  console.log("requests", requests);
  console.log("filteredRequests", filteredRequests);

  // Récupération des demandes depuis l'API réelle
  useEffect(() => {
    const fetchDeliveryRequests = async () => {
      setLoading(true);
      try {
        // Vérification de l'authentification
        if (!user || !user.id) {
          throw new Error(
            "Vous devez être connecté pour accéder à vos demandes"
          );
        }

        // Appel à l'API de réservations
        const response = await fetch(
          `http://57.128.212.12:8082/api/reservations/user/${user.id}`
        );

        if (!response.ok) {
          throw new Error(
            `Erreur lors de la récupération des demandes: ${response.status}`
          );
        }

        const responseData = await response.json();
        console.log("Données de réservations:", responseData);

        // Vérification de la structure des données - adaptée à la structure réelle
        let reservationsArray = [];

        // Vérifier si la structure contient $values (format spécifique)
        if (
          responseData &&
          responseData.$values &&
          Array.isArray(responseData.$values)
        ) {
          reservationsArray = responseData.$values;
        }
        // Si c'est un tableau direct
        else if (Array.isArray(responseData)) {
          reservationsArray = responseData;
        }
        // Si c'est un objet avec un élément unique (comme dans l'exemple)
        else if (
          responseData &&
          responseData["0"] &&
          responseData["0"].reservationId
        ) {
          reservationsArray = [responseData["0"]];
        }
        // Autres formats potentiels
        else if (responseData && typeof responseData === "object") {
          if (responseData.$values) reservationsArray = responseData.$values;
          else if (responseData.items) reservationsArray = responseData.items;
          else if (responseData.reservations)
            reservationsArray = responseData.reservations;
          else if (responseData.data) reservationsArray = responseData.data;
          else if (responseData.results)
            reservationsArray = responseData.results;
        }

        console.log("Tableau de réservations extrait:", reservationsArray);

        // Vérification que nous avons bien un tableau
        if (!Array.isArray(reservationsArray)) {
          console.error(
            "La réponse n'est pas convertible en tableau:",
            responseData
          );
          reservationsArray = []; // Utiliser un tableau vide en cas d'erreur
        }

        // Transformer les données de l'API en format utilisable par le composant
        const formattedRequests: DeliveryRequest[] = reservationsArray.map(
          (item: any) => ({
            id: item.reservationId?.toString() || Math.random().toString(),
            reference: `REF-${item.reservationId || "NEW"}`,
            status: mapApiStatusToUiStatus(item.reservationStatus || "pending"),
            createdAt: new Date(item.createdDate || new Date()),
            scheduledAt: new Date(item.deliveryDate || new Date()),
            completedAt:
              item.reservationStatus === "completed" ? new Date() : undefined,
            packageType: item.packageType || "Colis",
            packageWeight: `${item.weight || 0} kg`,
            deliveryAddress: item.recipientAddress || "",
            deliveryCity: item.recipientCity || "",
            deliveryPostalCode: item.recipientPostalCode || "",
            receiverName: item.recipientName || "",
            receiverPhone: item.recipientPhone || "",
            providerName: item.prestataire?.name || "",
            providerLogo: item.prestataire?.logo || "",
            price: item.price || 0,
            reservationId: item.reservationId || 0,
          })
        );

        setRequests(formattedRequests);
      } catch (error) {
        console.error("Erreur lors de la récupération des demandes:", error);
        // Fallback vers les données mockées en cas d'erreur
        setRequests([]); // Ou utilisez vos données mockées
      } finally {
        setLoading(false);
      }
    };

    // Fonction auxiliaire pour mapper les statuts de l'API aux statuts de l'interface
    const mapApiStatusToUiStatus = (
      apiStatus: string
    ): "pending" | "in_progress" | "completed" | "cancelled" => {
      switch (apiStatus.toLowerCase()) {
        case "completed":
        case "delivered":
          return "completed";
        case "cancelled":
          return "cancelled";
        case "in_progress":
        case "in_transit":
        case "out_for_delivery":
          return "in_progress";
        default:
          return "pending";
      }
    };

    fetchDeliveryRequests();
  }, [user]);

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
          (req.status === "completed" &&
            req.completedAt &&
            req.completedAt > new Date(now.getTime() - 24 * 60 * 60 * 1000))
      );
    } else {
      filtered = filtered.filter(
        (req) =>
          req.status === "completed" ||
          req.status === "cancelled" ||
          (req.completedAt &&
            req.completedAt <= new Date(now.getTime() - 24 * 60 * 60 * 1000))
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
    <div className="mx-auto">
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
                    <div className="font-medium">
                      {selectedRequest.reference}
                    </div>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        getStatusDisplay(selectedRequest.status).className
                      }`}
                    >
                      {getStatusDisplay(selectedRequest.status).icon}
                      <span className="ml-1">
                        {getStatusDisplay(selectedRequest.status).label}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-gray-500">
                      Date de création
                    </div>
                    <div className="font-medium">
                      {selectedRequest.createdAt.toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">
                      Date de livraison
                    </div>
                    <div className="font-medium">
                      {selectedRequest.scheduledAt.toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                      {" à "}
                      {selectedRequest.scheduledAt.toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Informations du colis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Type</div>
                      <div className="font-medium">
                        {selectedRequest.packageType}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Poids</div>
                      <div className="font-medium">
                        {selectedRequest.packageWeight}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Destinataire
                  </h3>
                  <div className="mb-2">
                    <div className="text-sm text-gray-500">Nom</div>
                    <div className="font-medium">
                      {selectedRequest.receiverName}
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="text-sm text-gray-500">Téléphone</div>
                    <div className="font-medium">
                      {selectedRequest.receiverPhone}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Adresse</div>
                    <div className="font-medium">
                      {selectedRequest.deliveryAddress},{" "}
                      {selectedRequest.deliveryPostalCode}{" "}
                      {selectedRequest.deliveryCity}
                    </div>
                  </div>
                </div>

                {selectedRequest.providerName && (
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      Prestataire
                    </h3>
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <TruckIcon className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="ml-3">
                        <div className="font-medium">
                          {selectedRequest.providerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          Prix: {selectedRequest.price.toFixed(2)} €
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Prix
                  </h3>
                  <div className="text-lg font-semibold">
                    {selectedRequest.price.toFixed(2)} €
                  </div>
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

                  {(selectedRequest.status === "pending" ||
                    selectedRequest.status === "in_progress") && (
                    <Link
                      to={`/suivi/${selectedRequest.reservationId}`}
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Chargement...
          </h3>
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Aucune demande trouvée
          </h3>
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
                      <span
                        className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusDisplay.className}`}
                      >
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
                      {request.createdAt.toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-start">
                      <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="ml-2">
                        <h4 className="text-xs font-medium text-gray-500">
                          Date de livraison
                        </h4>
                        <p className="text-sm font-medium">
                          {request.scheduledAt.toLocaleDateString("fr-FR")} à{" "}
                          {request.scheduledAt.toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="ml-2">
                        <h4 className="text-xs font-medium text-gray-500">
                          Adresse
                        </h4>
                        <p className="text-sm font-medium">
                          {request.deliveryCity}, {request.deliveryPostalCode}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <UserIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="ml-2">
                        <h4 className="text-xs font-medium text-gray-500">
                          Destinataire
                        </h4>
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
                        if (
                          confirm(
                            "Êtes-vous sûr de vouloir annuler cette demande ?"
                          )
                        ) {
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

                  {(request.status === "pending" ||
                    request.status === "in_progress") && (
                    <button
                      onClick={() =>
                        navigate("/suivi", {
                          state: { reservationId: request.reservationId },
                        })
                      }
                      className="ml-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <TruckIcon className="h-3.5 w-3.5 mr-1" />
                      Suivre
                    </button>
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
