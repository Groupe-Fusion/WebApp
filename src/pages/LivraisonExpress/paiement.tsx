import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import * as Toast from "@radix-ui/react-toast";
import * as Tabs from "@radix-ui/react-tabs";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CreditCard, Check, LockIcon, InfoIcon, TruckIcon } from "lucide-react";
import { FormFieldset } from "../../components/form/FormFieldSet";

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

// Type pour les données du formulaire de paiement
type PaymentFormData = {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  saveCard: boolean;
  billingAddress: string;
  billingCity: string;
  billingPostalCode: string;
  billingCountry: string;
  acceptConditions: boolean;
};

export default function LivraisonExpressPaiement() {
  const location = useLocation();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");

  // Récupération du prestataire sélectionné
  const selectedProvider = location.state?.provider as
    | DeliveryProvider
    | undefined;
  const formData = location.state?.formData;

  // S'il n'y a pas de prestataire sélectionné, rediriger vers la page des résultats
  if (!selectedProvider && !submitting) {
    setTimeout(() => navigate("/livraison-express/resultats"), 0);
    return null;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormData>({
    defaultValues: {
      billingCountry: "France",
    },
  });

  // Calcul des frais et du total
  const deliveryPrice = selectedProvider?.price || 0;
  const serviceFee = 1.99;
  const total = deliveryPrice + serviceFee;

  const onSubmit = async (data: PaymentFormData) => {
    setSubmitting(true);
    try {
      // Simulation d'un appel API pour le paiement
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Paiement effectué:", {
        provider: selectedProvider,
        paymentDetails: data,
        amount: total,
      });

      setStatus("success");
      setOpen(true);

      // Redirection après paiement réussi
      setTimeout(() => {
        navigate("/livraison-express/confirmation", {
          state: {
            provider: selectedProvider,
            formData: formData,
            total: total,
          },
        });
      }, 2000);
    } catch (error) {
      console.error("Erreur de paiement:", error);
      setStatus("error");
      setOpen(true);
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[1200px] relative min-h-screen">
      <Toast.Provider swipeDirection="right">
        <h1 className="text-2xl font-bold mb-6">Finalisation de la commande</h1>

        <div className="bg-white p-6 shadow sm:rounded-lg sm:px-10 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Résumé de la commande
          </h2>

          {selectedProvider && (
            <div className="border-b border-gray-200 pb-4 mb-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <TruckIcon className="h-6 w-6 text-gray-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">
                    {selectedProvider.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Délai estimé: {selectedProvider.delayMinutes} minutes
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Prix de la livraison</span>
              <span className="text-gray-900 font-medium">
                {deliveryPrice.toFixed(2)} €
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Frais de service</span>
              <span className="text-gray-900 font-medium">
                {serviceFee.toFixed(2)} €
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between text-base">
              <span className="font-medium text-gray-900">Total</span>
              <span className="font-bold text-gray-900">
                {total.toFixed(2)} €
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Méthode de paiement
            </h2>

            <Tabs.Root
              defaultValue="card"
              onValueChange={(value) =>
                setPaymentMethod(value as "card" | "paypal")
              }
            >
              <Tabs.List className="flex border-b border-gray-200 mb-6">
                <Tabs.Trigger
                  value="card"
                  className={`px-4 py-2 text-sm font-medium border-b-2 ${
                    paymentMethod === "card"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Carte bancaire
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="paypal"
                  className={`px-4 py-2 text-sm font-medium border-b-2 ${
                    paymentMethod === "paypal"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  PayPal
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </div>
        </div>

        {paymentMethod === "card" ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="bg-white p-6 shadow sm:rounded-lg sm:px-10">
              <FormFieldset title="Informations de cartes">
                <div className="grid md:col-span-2">
                  <label
                    className="text-sm font-semibold mb-1"
                    htmlFor="cardholderName"
                  >
                    Nom du titulaire
                  </label>
                  <input
                    id="cardholderName"
                    className={`rounded-md border ${
                      errors.cardholderName
                        ? "border-red-500"
                        : "border-gray-300"
                    } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Prénom Nom"
                    {...register("cardholderName", {
                      required: "Veuillez entrer le nom du titulaire",
                    })}
                  />
                  {errors.cardholderName && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.cardholderName.message}
                    </p>
                  )}
                </div>

                <div className="grid md:col-span-2">
                  <label
                    className="text-sm font-semibold mb-1"
                    htmlFor="cardNumber"
                  >
                    Numéro de carte
                  </label>
                  <div className="relative">
                    <input
                      id="cardNumber"
                      className={`block w-full rounded-md border ${
                        errors.cardNumber ? "border-red-500" : "border-gray-300"
                      } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="1234 5678 9012 3456"
                      {...register("cardNumber", {
                        required: "Le numéro de carte est requis",
                        pattern: {
                          value: /^[0-9]{16}$/,
                          message:
                            "Veuillez entrer un numéro de carte valide (16 chiffres sans espaces)",
                        },
                      })}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {errors.cardNumber && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.cardNumber.message}
                    </p>
                  )}
                </div>

                <div className="grid">
                  <label
                    className="text-sm font-semibold mb-1"
                    htmlFor="expiryDate"
                  >
                    Date d'expiration
                  </label>
                  <input
                    id="expiryDate"
                    className={`rounded-md border ${
                      errors.expiryDate ? "border-red-500" : "border-gray-300"
                    } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="MM/AA"
                    {...register("expiryDate", {
                      required: "Veuillez entrer la date d'expiration",
                      pattern: {
                        value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                        message: "Format requis: MM/AA",
                      },
                    })}
                  />
                  {errors.expiryDate && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.expiryDate.message}
                    </p>
                  )}
                </div>

                <div className="grid">
                  <label className="text-sm font-semibold mb-1" htmlFor="cvv">
                    Code de sécurité
                  </label>
                  <div className="relative">
                    <input
                      id="cvv"
                      className={`block w-full rounded-md border ${
                        errors.cvv ? "border-red-500" : "border-gray-300"
                      } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="123"
                      {...register("cvv", {
                        required: "Veuillez entrer le code de sécurité",
                        pattern: {
                          value: /^[0-9]{3,4}$/,
                          message:
                            "Le code de sécurité doit contenir 3 ou 4 chiffres",
                        },
                      })}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer group">
                      <InfoIcon className="h-4 w-4 text-gray-400" />
                      <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                        Le code de sécurité (CVV) est composé de 3 ou 4 chiffres
                        et se trouve au dos de votre carte.
                      </div>
                    </div>
                  </div>
                  {errors.cvv && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.cvv.message}
                    </p>
                  )}
                </div>
              </FormFieldset>

              <div className="space-y-4">
                <div className="flex items-center mt-2">
                  <Checkbox.Root
                    className="h-4 w-4 rounded border border-gray-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-white"
                    id="saveCard"
                    {...register("saveCard")}
                  >
                    <Checkbox.Indicator>
                      <Check className="h-3 w-3 text-blue-600" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <label
                    htmlFor="saveCard"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Sauvegarder cette carte pour mes prochains paiements
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 shadow sm:rounded-lg sm:px-10">
              <FormFieldset title="Adresse de facturation">
                <div className="grid md:col-span-2">
                  <label
                    className="text-sm font-semibold mb-1"
                    htmlFor="billingAddress"
                  >
                    Adresse
                  </label>
                  <input
                    id="billingAddress"
                    type="text"
                    className={`block w-full rounded-md border ${
                      errors.billingAddress
                        ? "border-red-500"
                        : "border-gray-300"
                    } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    {...register("billingAddress", {
                      required: "Veuillez entrer l'adresse",
                    })}
                  />
                  {errors.billingAddress && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.billingAddress.message}
                    </p>
                  )}
                </div>

                <div className="grid">
                  <label
                    className="text-sm font-semibold mb-1"
                    htmlFor="billingCity"
                  >
                    Ville
                  </label>
                  <input
                    id="billingCity"
                    type="text"
                    className={`rounded-md border ${
                      errors.billingCity ? "border-red-500" : "border-gray-300"
                    } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    {...register("billingCity", {
                      required: "Veuillez entrer la ville",
                    })}
                  />
                  {errors.billingCity && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.billingCity.message}
                    </p>
                  )}
                </div>

                <div className="grid">
                  <label
                    className="text-sm font-semibold mb-1"
                    htmlFor="billingPostalCode"
                  >
                    Code Postal
                  </label>
                  <input
                    id="billingPostalCode"
                    className={`block w-full rounded-md border ${
                      errors.billingPostalCode
                        ? "border-red-500"
                        : "border-gray-300"
                    } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    {...register("billingPostalCode", {
                      required: "Veuillez entrer le code postal",
                      pattern: {
                        value: /^[0-9]{5}$/,
                        message:
                          "Veuillez entrer un code postal valide (5 chiffres)",
                      },
                    })}
                  />
                  {errors.billingPostalCode && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.billingPostalCode.message}
                    </p>
                  )}
                </div>

                <div className="grid md:col-span-2">
                  <label
                    className="text-sm font-semibold mb-1"
                    htmlFor="billingCountry"
                  >
                    Pays
                  </label>
                  <select
                    id="billingCountry"
                    className={`block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    {...register("billingCountry", {
                      required: "Le pays est requis",
                    })}
                  >
                    <option value="France">France</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Suisse">Suisse</option>
                    <option value="Luxembourg">Luxembourg</option>
                    <option value="Monaco">Monaco</option>
                  </select>
                </div>
              </FormFieldset>
            </div>

            <div className="flex items-start mb-6">
              <div className="flex items-center h-5">
                <Checkbox.Root
                  className="h-4 w-4 rounded border border-gray-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-white"
                  id="acceptConditions"
                  {...register("acceptConditions", {
                    required: "Vous devez accepter les conditions générales",
                  })}
                >
                  <Checkbox.Indicator>
                    <Check className="h-3 w-3 text-blue-600" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="acceptConditions"
                  className="font-medium text-gray-700"
                >
                  J'accepte les{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    conditions générales
                  </a>{" "}
                  et la{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    politique de confidentialité
                  </a>
                </label>
                {errors.acceptConditions && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.acceptConditions.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-semibold bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => navigate(-1)}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex justify-center items-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2554f8] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="mr-2">Traitement en cours...</span>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  </>
                ) : (
                  <>
                    <LockIcon className="h-4 w-4 mr-2" />
                    Payer {total.toFixed(2)} €
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center mb-8">
            <div className="text-lg mb-4">
              Vous serez redirigé vers PayPal pour finaliser votre paiement.
            </div>
            <button
              className="mt-4 inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2554f8] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2554f8]"
              onClick={() => {
                setSubmitting(true);
                setTimeout(() => {
                  setStatus("success");
                  setOpen(true);
                  setTimeout(() => {
                    navigate("/livraison-express/confirmation", {
                      state: {
                        provider: selectedProvider,
                        formData: formData,
                        total: total,
                        paymentMethod: "paypal",
                      },
                    });
                  }, 2000);
                }, 2000);
              }}
            >
              {submitting ? (
                <>
                  <span className="mr-2">Redirection...</span>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                </>
              ) : (
                <>Payer avec PayPal</>
              )}
            </button>
          </div>
        )}

        <Toast.Root
          className={`${
            status === "success"
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          } border fixed bottom-4 right-4 p-4 rounded-lg shadow-lg`}
          open={open}
          onOpenChange={setOpen}
          duration={5000}
        >
          <Toast.Title
            className={`font-medium ${
              status === "success" ? "text-green-800" : "text-red-800"
            }`}
          >
            {status === "success" ? "Paiement réussi!" : "Erreur de paiement"}
          </Toast.Title>
          <Toast.Description
            className={`text-sm mt-1 ${
              status === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {status === "success"
              ? "Votre paiement a été traité avec succès. Redirection en cours..."
              : "Un problème est survenu lors du traitement de votre paiement. Veuillez réessayer."}
          </Toast.Description>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>
    </div>
  );
}
