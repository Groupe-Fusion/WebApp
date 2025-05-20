import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as Select from "@radix-ui/react-select";
import * as Toast from "@radix-ui/react-toast";
import { CheckIcon, ChevronDownIcon, Cross2Icon } from "@radix-ui/react-icons";
import { FormFieldset } from "../../components/form/FormFieldSet";

// Type pour les données du formulaire
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

export function LivraisonExpressForm() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      packageType: "small",
      fragile: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);

    try {
      // Simulation d'un appel API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Données soumises:", data);

      setStatus("success");
      setOpen(true);

      // Après un court délai pour que l'utilisateur voit le message de succès
      setTimeout(() => {
        // Redirection vers la page des résultats avec les données du formulaire
        navigate("/livraison-express/resultats", { state: { formData: data } });
      }, 2000);
    } catch (error) {
      console.error("Erreur:", error);
      setStatus("error");
      setOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[1200px] relative min-h-screen">
      <Toast.Provider swipeDirection="right">
        <div className="mt-8 bg-white p-6 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            {/* Section Destinataire */}
            <FormFieldset title="Informations destinataire">
              <div className="grid">
                <label
                  className="text-sm font-semibold mb-1"
                  htmlFor="receiverName"
                >
                  Nom complet
                </label>
                <input
                  id="receiverName"
                  className={`rounded-md border ${
                    errors.receiverName ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  {...register("receiverName", {
                    required: "Veuillez entrer le nom du destinataire",
                  })}
                />
                {errors.receiverName && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.receiverName.message}
                  </p>
                )}
              </div>

              <div className="grid">
                <label
                  className="text-sm font-semibold mb-1"
                  htmlFor="receiverPhone"
                >
                  Téléphone
                </label>
                <input
                  id="receiverPhone"
                  type="tel"
                  className={`rounded-md border ${
                    errors.receiverPhone ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  {...register("receiverPhone", {
                    required: "Veuillez entrer le téléphone du destinataire",
                  })}
                />
                {errors.receiverPhone && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.receiverPhone.message}
                  </p>
                )}
              </div>

              <div className="grid md:col-span-2">
                <label
                  className="text-sm font-semibold mb-1"
                  htmlFor="receiverAddress"
                >
                  Adresse
                </label>
                <input
                  id="receiverAddress"
                  className={`rounded-md border ${
                    errors.receiverAddress
                      ? "border-red-500"
                      : "border-gray-300"
                  } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  {...register("receiverAddress", {
                    required: "Veuillez entrer l'adresse du destinataire",
                  })}
                />
                {errors.receiverAddress && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.receiverAddress.message}
                  </p>
                )}
              </div>

              <div className="grid">
                <label
                  className="text-sm font-semibold mb-1"
                  htmlFor="receiverCity"
                >
                  Ville
                </label>
                <input
                  id="receiverCity"
                  className={`rounded-md border ${
                    errors.receiverCity ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  {...register("receiverCity", {
                    required: "Veuillez entrer la ville du destinataire",
                  })}
                />
                {errors.receiverCity && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.receiverCity.message}
                  </p>
                )}
              </div>

              <div className="grid">
                <label
                  className="text-sm font-semibold mb-1"
                  htmlFor="receiverPostalCode"
                >
                  Code postal
                </label>
                <input
                  id="receiverPostalCode"
                  className={`rounded-md border ${
                    errors.receiverPostalCode
                      ? "border-red-500"
                      : "border-gray-300"
                  } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  {...register("receiverPostalCode", {
                    required: "Veuillez entrer le code postal du destinataire",
                  })}
                />
                {errors.receiverPostalCode && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.receiverPostalCode.message}
                  </p>
                )}
              </div>
            </FormFieldset>

            {/* Détails du colis */}
            <FormFieldset title="Détails du colis">
              {/* Type de colis */}
              <div className="grid">
                <label
                  className="text-sm font-semibold mb-1"
                  htmlFor="packageType"
                >
                  Type de colis
                </label>
                <Controller
                  name="packageType"
                  control={control}
                  render={({ field }) => (
                    <Select.Root
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <Select.Trigger
                        className="inline-flex items-center justify-between rounded-md px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                        aria-label="Type de colis"
                      >
                        <Select.Value />
                        <Select.Icon>
                          <ChevronDownIcon />
                        </Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content
                          className="bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden z-50"
                          position="popper"
                        >
                          <Select.Viewport className="p-1">
                            <Select.Item
                              value="small"
                              className="text-sm text-gray-800 rounded flex items-center h-8 px-2 relative select-none data-[highlighted]:bg-blue-100 data-[highlighted]:outline-none"
                            >
                              <Select.ItemText>Petit (max 2kg)</Select.ItemText>
                              <Select.ItemIndicator className="absolute right-2">
                                <CheckIcon />
                              </Select.ItemIndicator>
                            </Select.Item>
                            <Select.Item
                              value="medium"
                              className="text-sm text-gray-800 rounded flex items-center h-8 px-2 relative select-none data-[highlighted]:bg-blue-100 data-[highlighted]:outline-none"
                            >
                              <Select.ItemText>Moyen (2-5kg)</Select.ItemText>
                              <Select.ItemIndicator className="absolute right-2">
                                <CheckIcon />
                              </Select.ItemIndicator>
                            </Select.Item>
                            <Select.Item
                              value="large"
                              className="text-sm text-gray-800 rounded flex items-center h-8 px-2 relative select-none data-[highlighted]:bg-blue-100 data-[highlighted]:outline-none"
                            >
                              <Select.ItemText>Grand (5-10kg)</Select.ItemText>
                              <Select.ItemIndicator className="absolute right-2">
                                <CheckIcon />
                              </Select.ItemIndicator>
                            </Select.Item>
                            <Select.Item
                              value="extra"
                              className="text-sm text-gray-800 rounded flex items-center h-8 px-2 relative select-none data-[highlighted]:bg-blue-100 data-[highlighted]:outline-none"
                            >
                              <Select.ItemText>
                                Extra large (10-20kg)
                              </Select.ItemText>
                              <Select.ItemIndicator className="absolute right-2">
                                <CheckIcon />
                              </Select.ItemIndicator>
                            </Select.Item>
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  )}
                />
              </div>

              {/* Poids */}
              <div className="grid">
                <label className="text-sm font-semibold mb-1" htmlFor="weight">
                  Poids (kg)
                </label>
                <input
                  id="weight"
                  type="number"
                  step="0.1"
                  min="0"
                  className={`rounded-md border ${
                    errors.weight ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  {...register("weight", {
                    required: "Veuillez entrer le poids",
                    min: { value: 0, message: "Le poids doit être positif" },
                  })}
                />
                {errors.weight && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.weight.message}
                  </p>
                )}
              </div>

              {/* Dimensions */}
              <div className="grid">
                <label
                  className="text-sm font-semibold mb-1"
                  htmlFor="dimensions"
                >
                  Dimensions (LxlxH en cm)
                </label>
                <input
                  id="dimensions"
                  placeholder="Ex: 30x20x15"
                  className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("dimensions")}
                />
              </div>

              {/* Fragile */}
              <div className="flex items-center mt-4">
                <Controller
                  name="fragile"
                  control={control}
                  render={({ field }) => (
                    <Checkbox.Root
                      className="h-4 w-4 rounded border border-gray-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-white"
                      id="fragile"
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    >
                      <Checkbox.Indicator>
                        <CheckIcon className="text-blue-600 h-3 w-3" />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                  )}
                />
                <label
                  htmlFor="fragile"
                  className="ml-2 block text-sm font-semibold"
                >
                  Contenu fragile
                </label>
              </div>
            </FormFieldset>

            {/* Instructions spéciales */}
            <FormFieldset title="Instructions spéciales">
              <div className="grid md:col-span-2">
                <label
                  className="text-sm font-semibold mb-1"
                  htmlFor="specialInstructions"
                >
                  Informations supplémentaires
                </label>
                <textarea
                  id="specialInstructions"
                  className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  rows={3}
                  placeholder="Informations supplémentaires pour le livreur..."
                  {...register("specialInstructions")}
                />
              </div>
            </FormFieldset>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2554f8] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? "Traitement en cours..." : "Valider la demande"}
              </button>
            </div>
          </form>
        </div>

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
            {status === "success"
              ? "Demande envoyée avec succès!"
              : "Erreur lors de l'envoi du formulaire"}
          </Toast.Title>
          <Toast.Description
            className={`text-sm mt-1 ${
              status === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {status === "success"
              ? "Votre demande de livraison express a été enregistrée."
              : "Veuillez réessayer ultérieurement ou contacter le service client."}
          </Toast.Description>
          <Toast.Action
            className="absolute top-2 right-2"
            asChild
            altText="Fermer"
          >
            <button className="p-1 rounded-full hover:bg-gray-200">
              <Cross2Icon />
            </button>
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>
    </div>
  );
}
