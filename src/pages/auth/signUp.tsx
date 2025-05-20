import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as Toast from "@radix-ui/react-toast";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";

type SignUpFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  acceptConditions: boolean;
};

export default function SignUp() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>();

  // Pour permettre de comparer le mot de passe et sa confirmation
  const password = watch("password");

const onSubmit = async (data: SignUpFormData) => {
  setSubmitting(true);
  try {
    // Création de l'objet à envoyer à l'API
    const userData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: data.password,
      acceptConditions: data.acceptConditions,
    };

    // Appel à l'API d'inscription
    const response = await fetch('http://57.128.212.12:8081/api/User', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    // Vérification de la réponse
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Erreur lors de l\'inscription');
    }

    // Récupération des données de réponse
    const responseData = await response.json();
    console.log("Inscription réussie:", responseData);

    // Redirection après inscription réussie
    navigate("/auth/signin", {
      state: {
        message: "Compte créé avec succès ! Vous pouvez maintenant vous connecter.",
      },
    });
  } catch (err) {
    console.error("Erreur d'inscription:", err);
    setError(
      err instanceof Error 
        ? err.message 
        : "Une erreur est survenue lors de l'inscription. Veuillez réessayer."
    );
    setOpen(true);
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Toast.Provider swipeDirection="right">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Bienvenue chez Quickserve
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Créez votre compte pour une expérience optimale
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Prénom
                </label>
                <div className="mt-1">
                  <input
                    id="firstName"
                    type="text"
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.firstName ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    {...register("firstName", {
                      required: "Le prénom est requis",
                    })}
                  />
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nom
                </label>
                <div className="mt-1">
                  <input
                    id="lastName"
                    type="text"
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.lastName ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    {...register("lastName", {
                      required: "Le nom est requis",
                    })}
                  />
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Adresse email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.email ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    {...register("email", {
                      required: "L'adresse email est requise",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Adresse email invalide",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Numéro de téléphone
                </label>
                <div className="mt-1">
                  <input
                    id="phoneNumber"
                    type="tel"
                    autoComplete="tel"
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.phoneNumber ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="0612345678"
                    {...register("phoneNumber", {
                      required: "Le numéro de téléphone est requis",
                      pattern: {
                        value: /^0[1-9][0-9]{8}$/,
                        message:
                          "Veuillez entrer un numéro de téléphone valide (10 chiffres commençant par 0)",
                      },
                    })}
                  />
                  {errors.phoneNumber && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mot de passe
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    type="password"
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.password ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    {...register("password", {
                      required: "Le mot de passe est requis",
                      minLength: {
                        value: 6,
                        message:
                          "Le mot de passe doit contenir au moins 6 caractères",
                      },
                    })}
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirmation du mot de passe
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    type="password"
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.confirmPassword
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    {...register("confirmPassword", {
                      required: "Veuillez confirmer votre mot de passe",
                      validate: (value) =>
                        value === password ||
                        "Les mots de passe ne correspondent pas",
                    })}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <Checkbox.Root
                    className="h-4 w-4 rounded border border-gray-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-white"
                    id="acceptConditions"
                    {...register("acceptConditions", {
                      required:
                        "Vous devez accepter les conditions d'utilisation",
                    })}
                  >
                    <Checkbox.Indicator>
                      <CheckIcon className="h-3 w-3 text-blue-600" />
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
                      conditions d'utilisation
                    </a>
                  </label>
                  {errors.acceptConditions && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.acceptConditions.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2554f8] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {submitting ? "Inscription en cours..." : "S'inscrire"}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/auth/signin"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Déjà un compte ? Se connecter
              </Link>
            </div>
          </div>
        </div>

        {/* Toast notification pour les erreurs */}
        <Toast.Root
          className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 fixed bottom-4 right-4"
          open={open}
          onOpenChange={setOpen}
          duration={5000}
        >
          <Toast.Title className="text-red-800 font-medium">
            Erreur d'inscription
          </Toast.Title>
          <Toast.Description className="text-sm text-red-600 mt-1">
            {error}
          </Toast.Description>
          <Toast.Action asChild altText="Fermer">
            <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200">
              <Cross2Icon />
            </button>
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>
    </div>
  );
}
