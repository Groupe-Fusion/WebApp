import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";

export default function Home() {
  const navigate = useNavigate();

  // Service categories data
  const serviceCategories = [
    {
      title: "Livraison Express",
      subtitle: "12 services",
      icon: "/package-3d-1.png",
      alt: "Package",
      path: "/delivery",
    },
    {
      title: "Déménagement",
      icon: "/delivery-truck-3d-1.png",
      alt: "Delivery truck",
      path: "/moving",
    },
    {
      title: "Nettoyage Auto",
      icon: "/sponge-3d-1.png",
      alt: "Sponge",
      path: "/car-cleaning",
    },
    {
      title: "Dépannage Auto",
      icon: "/toolbox-3d-1.png",
      alt: "Toolbox",
      path: "/car-repair",
    },
    {
      title: "Garde d'enfants",
      icon: "/child-3d-default-1.png",
      alt: "Child default",
      path: "/childcare",
    },
  ];

  return (
    <div className="flex flex-row justify-center w-full">
      <div className="w-full max-w-[1200px] relative min-h-screen py-5 px-5">
        {/* Location Bar */}
        <div className="flex items-center bg-white rounded-[20px] h-10 w-[223px] px-2.5">
          <img
            className="w-5 h-5 object-cover"
            alt="Marqueur"
            src="/marqueur-1.png"
          />
          <span className="ml-[6px] font-normal text-black text-xs">
            10 Rue du Général Sarra...
          </span>
          <img
            className="ml-auto w-5 h-5 object-cover"
            alt="Angle petit droit"
            src="/angle-petit-droit-1-5.png"
          />
        </div>

        <div className="mt-[49px] flex items-center">
          <h1 className="font-normal text-black text-2xl">Bonjour, Alex</h1>
          <img
            className="w-[25px] h-[25px] ml-3 object-cover"
            alt="Waving hand"
            src="/waving-hand-3d-default-1.png"
          />
        </div>
        <p className="mt-1 font-normal text-[#00000080] text-base">
          De quoi avez-vous besoin ?
        </p>

        {/* Profile Completion Card */}
        <Card className="mt-5 rounded-[20px] border-none">
          <CardContent className="p-5">
            <h3 className="font-normal text-black text-base">
              Complétez votre profil
            </h3>
            <p className="mt-[9px] font-normal text-[#00000080] text-base w-[252px]">
              Pour une meilleure intéraction et une expérience personnalisée
            </p>
            <div className="mt-[21px] relative">
              <Progress
                value={75}
                className="h-1 bg-[#d9d9d9] rounded-[20px]"
              />
              <span className="absolute right-0 top-[-21px] font-normal text-black text-xs">
                75%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Track Request Button */}
        <Button 
          className="mt-5 w-full h-[60px] bg-[#2554f8] rounded-[10px] font-semibold text-white text-xl"
          onClick={() => navigate("/requests")}
        >
          Suivre ma demande
        </Button>

        {/* Service Categories */}
        <div className="mt-[38px] space-y-5">
          {serviceCategories.map((service, index) => (
            <Card 
              key={index} 
              className="h-20 rounded-[20px] border-none cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(service.path)}
            >
              <CardContent className="p-0 h-full">
                <div className="flex items-center h-full px-5">
                  <img
                    className="w-10 h-10 object-cover"
                    alt={service.alt}
                    src={service.icon}
                  />
                  <div className="ml-5">
                    <h3 className="font-normal text-black text-xl">
                      {service.title}
                    </h3>
                    {service.subtitle && (
                      <p className="font-normal text-[#00000080] text-xs">
                        {service.subtitle}
                      </p>
                    )}
                  </div>
                  <img
                    className="ml-auto w-[25px] h-[25px] object-cover"
                    alt="Angle petit droit"
                    src="/angle-petit-droit-1-5.png"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};