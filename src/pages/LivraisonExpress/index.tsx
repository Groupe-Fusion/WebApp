import { LivraisonExpressForm } from "../Forms/LivraisonExpress";

export default function LivraisonExpress() {
    return (
        <div className="flex flex-col items-center bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Livraison Express</h1>
        <LivraisonExpressForm />
        </div>
    );
}