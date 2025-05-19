import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Toast from '@radix-ui/react-toast';
import * as Tabs from '@radix-ui/react-tabs';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CreditCard, Check, ChevronLeft, LockIcon, InfoIcon, TruckIcon} from 'lucide-react';

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
  acceptTerms: boolean;
};

export default function LivraisonExpressPaiement() {
  const location = useLocation();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  
  // Récupération du prestataire sélectionné
  const selectedProvider = location.state?.provider as DeliveryProvider | undefined;
  const formData = location.state?.formData;
  
  // S'il n'y a pas de prestataire sélectionné, rediriger vers la page des résultats
  if (!selectedProvider && !submitting) {
    setTimeout(() => navigate('/livraison-express/resultats'), 0);
    return null;
  }
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<PaymentFormData>({
    defaultValues: {
      saveCard: false,
      acceptTerms: false,
      billingCountry: 'France',
    }
  });
  
  // Calcul des frais et du total
  const deliveryPrice = selectedProvider?.price || 0;
  const serviceFee = 1.99;
  const total = deliveryPrice + serviceFee;

  const onSubmit = async (data: PaymentFormData) => {
    setSubmitting(true);
    try {
      // Simulation d'un appel API pour le paiement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Paiement effectué:', {
        provider: selectedProvider,
        paymentDetails: data,
        amount: total
      });
      
      setStatus('success');
      setOpen(true);
      
      // Redirection après paiement réussi
      setTimeout(() => {
        navigate('/livraison-express/confirmation', { 
          state: { 
            provider: selectedProvider,
            formData: formData,
            total: total
          } 
        });
      }, 2000);
      
    } catch (error) {
      console.error('Erreur de paiement:', error);
      setStatus('error');
      setOpen(true);
      setSubmitting(false);
    }
  };
  
//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
//       <Toast.Provider swipeDirection="right">
//         <button 
//           onClick={() => navigate(-1)}
//           className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
//         >
//           <ChevronLeft className="h-4 w-4 mr-1" />
//           Retour
//         </button>
        
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Formulaire de paiement */}
//           <div className="flex-1">
//             <h1 className="text-2xl font-bold text-gray-900 mb-6">Paiement</h1>
            
//             <Tabs.Root defaultValue="card" onValueChange={(value) => setPaymentMethod(value as 'card' | 'paypal')}>
//               <Tabs.List className="flex border-b border-gray-200 mb-6">
//                 <Tabs.Trigger
//                   value="card"
//                   className={`px-4 py-2 text-sm font-medium border-b-2 ${
//                     paymentMethod === 'card' 
//                       ? 'border-blue-500 text-blue-600' 
//                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                   }`}
//                 >
//                   Carte bancaire
//                 </Tabs.Trigger>
//                 <Tabs.Trigger
//                   value="paypal"
//                   className={`px-4 py-2 text-sm font-medium border-b-2 ${
//                     paymentMethod === 'paypal' 
//                       ? 'border-blue-500 text-blue-600' 
//                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                   }`}
//                 >
//                   PayPal
//                 </Tabs.Trigger>
//               </Tabs.List>
              
//               <Tabs.Content value="card">
//                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                   <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//                     <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de carte</h3>
                    
//                     <div className="space-y-4">
//                       <div>
//                         <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1">
//                           Nom du titulaire
//                         </label>
//                         <input
//                           id="cardholderName"
//                           type="text"
//                           className={`block w-full rounded-md shadow-sm ${
//                             errors.cardholderName ? 'border-red-300' : 'border-gray-300'
//                           } focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
//                           placeholder="Prénom Nom"
//                           {...register("cardholderName", { required: "Le nom du titulaire est requis" })}
//                         />
//                         {errors.cardholderName && (
//                           <p className="mt-1 text-sm text-red-600">{errors.cardholderName.message}</p>
//                         )}
//                       </div>
                      
//                       <div>
//                         <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
//                           Numéro de carte
//                         </label>
//                         <div className="relative">
//                           <input
//                             id="cardNumber"
//                             type="text"
//                             className={`block w-full rounded-md shadow-sm ${
//                               errors.cardNumber ? 'border-red-300' : 'border-gray-300'
//                             } focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
//                             placeholder="1234 5678 9012 3456"
//                             {...register("cardNumber", { 
//                               required: "Le numéro de carte est requis",
//                               pattern: {
//                                 value: /^[0-9]{16}$/,
//                                 message: "Veuillez entrer un numéro de carte valide (16 chiffres sans espaces)"
//                               }
//                             })}
//                           />
//                           <div className="absolute inset-y-0 right-0 flex items-center pr-3">
//                             <CreditCard className="h-5 w-5 text-gray-400" />
//                           </div>
//                         </div>
//                         {errors.cardNumber && (
//                           <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>
//                         )}
//                       </div>
                      
//                       <div className="flex space-x-4">
//                         <div className="w-1/2">
//                           <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
//                             Date d'expiration
//                           </label>
//                           <input
//                             id="expiryDate"
//                             type="text"
//                             className={`block w-full rounded-md shadow-sm ${
//                               errors.expiryDate ? 'border-red-300' : 'border-gray-300'
//                             } focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
//                             placeholder="MM/AA"
//                             {...register("expiryDate", { 
//                               required: "La date d'expiration est requise",
//                               pattern: {
//                                 value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
//                                 message: "Format requis: MM/AA"
//                               }
//                             })}
//                           />
//                           {errors.expiryDate && (
//                             <p className="mt-1 text-sm text-red-600">{errors.expiryDate.message}</p>
//                           )}
//                         </div>
                        
//                         <div className="w-1/2">
//                           <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
//                             Code de sécurité
//                           </label>
//                           <div className="relative">
//                             <input
//                               id="cvv"
//                               type="text"
//                               className={`block w-full rounded-md shadow-sm ${
//                                 errors.cvv ? 'border-red-300' : 'border-gray-300'
//                               } focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
//                               placeholder="123"
//                               {...register("cvv", { 
//                                 required: "Le code de sécurité est requis",
//                                 pattern: {
//                                   value: /^[0-9]{3,4}$/,
//                                   message: "Le code de sécurité doit contenir 3 ou 4 chiffres"
//                                 }
//                               })}
//                             />
//                             <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer group">
//                               <InfoIcon className="h-4 w-4 text-gray-400" />
//                               <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
//                                 Le code de sécurité (CVV) est composé de 3 ou 4 chiffres et se trouve au dos de votre carte.
//                               </div>
//                             </div>
//                           </div>
//                           {errors.cvv && (
//                             <p className="mt-1 text-sm text-red-600">{errors.cvv.message}</p>
//                           )}
//                         </div>
//                       </div>
                      
//                       <div className="flex items-center mt-2">
//                         <Checkbox.Root
//                           className="h-4 w-4 rounded border border-gray-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-white"
//                           id="saveCard"
//                           {...register("saveCard")}
//                         >
//                           <Checkbox.Indicator>
//                             <Check className="h-3 w-3 text-blue-600" />
//                           </Checkbox.Indicator>
//                         </Checkbox.Root>
//                         <label htmlFor="saveCard" className="ml-2 block text-sm text-gray-700">
//                           Sauvegarder cette carte pour mes prochains paiements
//                         </label>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//                     <h3 className="text-lg font-medium text-gray-900 mb-4">Adresse de facturation</h3>
                    
//                     <div className="space-y-4">
//                       <div>
//                         <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700 mb-1">
//                           Adresse
//                         </label>
//                         <input
//                           id="billingAddress"
//                           type="text"
//                           className={`block w-full rounded-md shadow-sm ${
//                             errors.billingAddress ? 'border-red-300' : 'border-gray-300'
//                           } focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
//                           {...register("billingAddress", { required: "L'adresse est requise" })}
//                         />
//                         {errors.billingAddress && (
//                           <p className="mt-1 text-sm text-red-600">{errors.billingAddress.message}</p>
//                         )}
//                       </div>
                      
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <label htmlFor="billingCity" className="block text-sm font-medium text-gray-700 mb-1">
//                             Ville
//                           </label>
//                           <input
//                             id="billingCity"
//                             type="text"
//                             className={`block w-full rounded-md shadow-sm ${
//                               errors.billingCity ? 'border-red-300' : 'border-gray-300'
//                             } focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
//                             {...register("billingCity", { required: "La ville est requise" })}
//                           />
//                           {errors.billingCity && (
//                             <p className="mt-1 text-sm text-red-600">{errors.billingCity.message}</p>
//                           )}
//                         </div>
                        
//                         <div>
//                           <label htmlFor="billingPostalCode" className="block text-sm font-medium text-gray-700 mb-1">
//                             Code postal
//                           </label>
//                           <input
//                             id="billingPostalCode"
//                             type="text"
//                             className={`block w-full rounded-md shadow-sm ${
//                               errors.billingPostalCode ? 'border-red-300' : 'border-gray-300'
//                             } focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
//                             {...register("billingPostalCode", { 
//                               required: "Le code postal est requis",
//                               pattern: {
//                                 value: /^[0-9]{5}$/,
//                                 message: "Veuillez entrer un code postal valide (5 chiffres)"
//                               }
//                             })}
//                           />
//                           {errors.billingPostalCode && (
//                             <p className="mt-1 text-sm text-red-600">{errors.billingPostalCode.message}</p>
//                           )}
//                         </div>
//                       </div>
                      
//                       <div>
//                         <label htmlFor="billingCountry" className="block text-sm font-medium text-gray-700 mb-1">
//                           Pays
//                         </label>
//                         <select
//                           id="billingCountry"
//                           className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                           {...register("billingCountry", { required: "Le pays est requis" })}
//                         >
//                           <option value="France">France</option>
//                           <option value="Belgique">Belgique</option>
//                           <option value="Suisse">Suisse</option>
//                           <option value="Luxembourg">Luxembourg</option>
//                           <option value="Monaco">Monaco</option>
//                         </select>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-start mb-6">
//                     <div className="flex items-center h-5">
//                       <Checkbox.Root
//                         className="h-4 w-4 rounded border border-gray-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-white"
//                         id="acceptTerms"
//                         {...register("acceptTerms", { required: "Vous devez accepter les conditions générales" })}
//                       >
//                         <Checkbox.Indicator>
//                           <Check className="h-3 w-3 text-blue-600" />
//                         </Checkbox.Indicator>
//                       </Checkbox.Root>
//                     </div>
//                     <div className="ml-3 text-sm">
//                       <label htmlFor="acceptTerms" className="font-medium text-gray-700">
//                         J'accepte les{' '}
//                         <a href="#" className="text-blue-600 hover:text-blue-500">
//                           conditions générales
//                         </a>
//                         {' '}et la{' '}
//                         <a href="#" className="text-blue-600 hover:text-blue-500">
//                           politique de confidentialité
//                         </a>
//                       </label>
//                       {errors.acceptTerms && (
//                         <p className="mt-1 text-sm text-red-600">{errors.acceptTerms.message}</p>
//                       )}
//                     </div>
//                   </div>
                  
//                   <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-8">
//                     <button
//                       type="button"
//                       className="flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
//                       onClick={() => navigate(-1)}
//                     >
//                       Annuler
//                     </button>
//                     <button
//                       type="submit"
//                       className="flex justify-center items-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2554f8] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
//                       disabled={submitting}
//                     >
//                       {submitting ? (
//                         <>
//                           <span className="mr-2">Traitement en cours...</span>
//                           <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
//                         </>
//                       ) : (
//                         <>
//                           <LockIcon className="h-4 w-4 mr-2" />
//                           Payer {total.toFixed(2)} €
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </form>
//               </Tabs.Content>
              
//               <Tabs.Content value="paypal">
//                 <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
//                   <div className="text-lg mb-4">Vous serez redirigé vers PayPal pour finaliser votre paiement.</div>
//                   <button
//                     className="mt-4 inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#009cde] hover:bg-[#0070ba] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#009cde]"
//                     onClick={() => {
//                       setSubmitting(true);
//                       setTimeout(() => {
//                         setStatus('success');
//                         setOpen(true);
//                         setTimeout(() => {
//                           navigate('/livraison-express/confirmation', { 
//                             state: { 
//                               provider: selectedProvider,
//                               formData: formData,
//                               total: total,
//                               paymentMethod: 'paypal'
//                             } 
//                           });
//                         }, 2000);
//                       }, 2000);
//                     }}
//                   >
//                     {submitting ? (
//                       <>
//                         <span className="mr-2">Redirection...</span>
//                         <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
//                       </>
//                     ) : (
//                       <>Payer avec PayPal</>
//                     )}
//                   </button>
//                 </div>
//               </Tabs.Content>
//             </Tabs.Root>
//           </div>

//           {/* Récapitulatif de commande */}
//           <div className="lg:w-1/3 w-full">
//             <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 sticky top-6">
//               <h2 className="text-lg font-medium text-gray-900 mb-4">Résumé de la commande</h2>
              
//               {selectedProvider && (
//                 <div className="border-b border-gray-200 pb-4 mb-4">
//                   <div className="flex items-start">
//                     <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
//                       <CreditCard className="h-6 w-6 text-gray-500" />
//                     </div>
//                     <div className="ml-3">
//                       <h3 className="text-sm font-medium text-gray-900">{selectedProvider.name}</h3>
//                       <p className="text-sm text-gray-500">
//                         Délai estimé: {selectedProvider.delayMinutes} minutes
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}
              
//               <div className="space-y-3 mb-4">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Prix de la livraison</span>
//                   <span className="text-gray-900 font-medium">{deliveryPrice.toFixed(2)} €</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Frais de service</span>
//                   <span className="text-gray-900 font-medium">{serviceFee.toFixed(2)} €</span>
//                 </div>
//                 <div className="border-t border-gray-200 pt-3 flex justify-between text-base">
//                   <span className="font-medium text-gray-900">Total</span>
//                   <span className="font-bold text-gray-900">{total.toFixed(2)} €</span>
//                 </div>
//               </div>
              
//               <div className="border-t border-gray-200 pt-4 mt-6">
//                 <h3 className="text-sm font-medium text-gray-900 mb-2">Besoin d'aide ?</h3>
//                 <p className="text-sm text-gray-600 mb-4">
//                   Si vous avez des questions concernant votre commande, contactez notre service client.
//                 </p>
//                 <a 
//                   href="tel:+33123456789" 
//                   className="text-sm text-blue-600 hover:text-blue-500 font-medium"
//                 >
//                   01 23 45 67 89
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {/* Toast notification */}
//         <Toast.Root 
//           className={`${
//             status === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
//           } border fixed bottom-4 right-4 p-4 rounded-lg shadow-lg`}
//           open={open}
//           onOpenChange={setOpen}
//           duration={5000}
//         >
//           <Toast.Title className={`font-medium ${
//             status === 'success' ? 'text-green-800' : 'text-red-800'
//           }`}>
//             {status === 'success' 
//               ? 'Paiement réussi!'
//               : 'Erreur de paiement'
//             }
//           </Toast.Title>
//           <Toast.Description className={`text-sm mt-1 ${
//             status === 'success' ? 'text-green-600' : 'text-red-600'
//           }`}>
//             {status === 'success' 
//               ? 'Votre paiement a été traité avec succès. Redirection en cours...'
//               : 'Un problème est survenu lors du traitement de votre paiement. Veuillez réessayer.'
//             }
//           </Toast.Description>
//         </Toast.Root>
//         <Toast.Viewport />
//       </Toast.Provider>
//     </div>
//   );

return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6">
      <Toast.Provider swipeDirection="right">
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour
        </button>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Finalisation de la commande</h1>
        
        {/* 1. Résumé de la commande d'abord */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Résumé de la commande</h2>
          
          {selectedProvider && (
            <div className="border-b border-gray-200 pb-4 mb-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <TruckIcon className="h-6 w-6 text-gray-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">{selectedProvider.name}</h3>
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
              <span className="text-gray-900 font-medium">{deliveryPrice.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Frais de service</span>
              <span className="text-gray-900 font-medium">{serviceFee.toFixed(2)} €</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between text-base">
              <span className="font-medium text-gray-900">Total</span>
              <span className="font-bold text-gray-900">{total.toFixed(2)} €</span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Besoin d'aide ?</h3>
            <p className="text-sm text-gray-600 mb-2">
              Si vous avez des questions concernant votre commande, contactez notre service client.
            </p>
            <a 
              href="tel:+33123456789" 
              className="text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              01 23 45 67 89
            </a>
          </div>
        </div>
        
        {/* 2. Méthodes de paiement */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Méthode de paiement</h2>
          
          <Tabs.Root defaultValue="card" onValueChange={(value) => setPaymentMethod(value as 'card' | 'paypal')}>
            <Tabs.List className="flex border-b border-gray-200 mb-6">
              <Tabs.Trigger
                value="card"
                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                  paymentMethod === 'card' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Carte bancaire
              </Tabs.Trigger>
              <Tabs.Trigger
                value="paypal"
                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                  paymentMethod === 'paypal' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                PayPal
              </Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </div>
        
        {/* 3. Formulaire de paiement qui apparaît conditionnellement */}
        {paymentMethod === 'card' ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de carte</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du titulaire
                  </label>
                  <input
                    id="cardholderName"
                    type="text"
                    className={`block w-full rounded-md shadow-sm ${
                      errors.cardholderName ? 'border-red-300' : 'border-gray-300'
                    } focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="Prénom Nom"
                    {...register("cardholderName", { required: "Le nom du titulaire est requis" })}
                  />
                  {errors.cardholderName && (
                    <p className="mt-1 text-sm text-red-600">{errors.cardholderName.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de carte
                  </label>
                  <div className="relative">
                    <input
                      id="cardNumber"
                      type="text"
                      className={`block w-full rounded-md shadow-sm ${
                        errors.cardNumber ? 'border-red-300' : 'border-gray-300'
                      } focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      placeholder="1234 5678 9012 3456"
                      {...register("cardNumber", { 
                        required: "Le numéro de carte est requis",
                        pattern: {
                          value: /^[0-9]{16}$/,
                          message: "Veuillez entrer un numéro de carte valide (16 chiffres sans espaces)"
                        }
                      })}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {errors.cardNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>
                  )}
                </div>
                
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Date d'expiration
                    </label>
                    <input
                      id="expiryDate"
                      type="text"
                      className={`block w-full rounded-md shadow-sm ${
                        errors.expiryDate ? 'border-red-300' : 'border-gray-300'
                      } focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      placeholder="MM/AA"
                      {...register("expiryDate", { 
                        required: "La date d'expiration est requise",
                        pattern: {
                          value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                          message: "Format requis: MM/AA"
                        }
                      })}
                    />
                    {errors.expiryDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.expiryDate.message}</p>
                    )}
                  </div>
                  
                  <div className="w-1/2">
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                      Code de sécurité
                    </label>
                    <div className="relative">
                      <input
                        id="cvv"
                        type="text"
                        className={`block w-full rounded-md shadow-sm ${
                          errors.cvv ? 'border-red-300' : 'border-gray-300'
                        } focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        placeholder="123"
                        {...register("cvv", { 
                          required: "Le code de sécurité est requis",
                          pattern: {
                            value: /^[0-9]{3,4}$/,
                            message: "Le code de sécurité doit contenir 3 ou 4 chiffres"
                          }
                        })}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer group">
                        <InfoIcon className="h-4 w-4 text-gray-400" />
                        <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                          Le code de sécurité (CVV) est composé de 3 ou 4 chiffres et se trouve au dos de votre carte.
                        </div>
                      </div>
                    </div>
                    {errors.cvv && (
                      <p className="mt-1 text-sm text-red-600">{errors.cvv.message}</p>
                    )}
                  </div>
                </div>
                
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
                  <label htmlFor="saveCard" className="ml-2 block text-sm text-gray-700">
                    Sauvegarder cette carte pour mes prochains paiements
                  </label>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Adresse de facturation</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <input
                    id="billingAddress"
                    type="text"
                    className={`block w-full rounded-md shadow-sm ${
                      errors.billingAddress ? 'border-red-300' : 'border-gray-300'
                    } focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    {...register("billingAddress", { required: "L'adresse est requise" })}
                  />
                  {errors.billingAddress && (
                    <p className="mt-1 text-sm text-red-600">{errors.billingAddress.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="billingCity" className="block text-sm font-medium text-gray-700 mb-1">
                      Ville
                    </label>
                    <input
                      id="billingCity"
                      type="text"
                      className={`block w-full rounded-md shadow-sm ${
                        errors.billingCity ? 'border-red-300' : 'border-gray-300'
                      } focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      {...register("billingCity", { required: "La ville est requise" })}
                    />
                    {errors.billingCity && (
                      <p className="mt-1 text-sm text-red-600">{errors.billingCity.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="billingPostalCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Code postal
                    </label>
                    <input
                      id="billingPostalCode"
                      type="text"
                      className={`block w-full rounded-md shadow-sm ${
                        errors.billingPostalCode ? 'border-red-300' : 'border-gray-300'
                      } focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      {...register("billingPostalCode", { 
                        required: "Le code postal est requis",
                        pattern: {
                          value: /^[0-9]{5}$/,
                          message: "Veuillez entrer un code postal valide (5 chiffres)"
                        }
                      })}
                    />
                    {errors.billingPostalCode && (
                      <p className="mt-1 text-sm text-red-600">{errors.billingPostalCode.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="billingCountry" className="block text-sm font-medium text-gray-700 mb-1">
                    Pays
                  </label>
                  <select
                    id="billingCountry"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    {...register("billingCountry", { required: "Le pays est requis" })}
                  >
                    <option value="France">France</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Suisse">Suisse</option>
                    <option value="Luxembourg">Luxembourg</option>
                    <option value="Monaco">Monaco</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex items-start mb-6">
              <div className="flex items-center h-5">
                <Checkbox.Root
                  className="h-4 w-4 rounded border border-gray-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-white"
                  id="acceptTerms"
                  {...register("acceptTerms", { required: "Vous devez accepter les conditions générales" })}
                >
                  <Checkbox.Indicator>
                    <Check className="h-3 w-3 text-blue-600" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="acceptTerms" className="font-medium text-gray-700">
                  J'accepte les{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    conditions générales
                  </a>
                  {' '}et la{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    politique de confidentialité
                  </a>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-1 text-sm text-red-600">{errors.acceptTerms.message}</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-center gap-3 mt-8">
              <button
                type="button"
                className="flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
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
          // Contenu pour PayPal
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center mb-8">
            <div className="text-lg mb-4">Vous serez redirigé vers PayPal pour finaliser votre paiement.</div>
            <button
              className="mt-4 inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#009cde] hover:bg-[#0070ba] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#009cde]"
              onClick={() => {
                setSubmitting(true);
                setTimeout(() => {
                  setStatus('success');
                  setOpen(true);
                  setTimeout(() => {
                    navigate('/livraison-express/confirmation', { 
                      state: { 
                        provider: selectedProvider,
                        formData: formData,
                        total: total,
                        paymentMethod: 'paypal'
                      } 
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
        
        {/* Toast notification - inchangé */}
        <Toast.Root 
          className={`${
            status === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          } border fixed bottom-4 right-4 p-4 rounded-lg shadow-lg`}
          open={open}
          onOpenChange={setOpen}
          duration={5000}
        >
          <Toast.Title className={`font-medium ${
            status === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
            {status === 'success' 
              ? 'Paiement réussi!'
              : 'Erreur de paiement'
            }
          </Toast.Title>
          <Toast.Description className={`text-sm mt-1 ${
            status === 'success' ? 'text-green-600' : 'text-red-600'
          }`}>
            {status === 'success' 
              ? 'Votre paiement a été traité avec succès. Redirection en cours...'
              : 'Un problème est survenu lors du traitement de votre paiement. Veuillez réessayer.'
            }
          </Toast.Description>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>
    </div>
  );
}