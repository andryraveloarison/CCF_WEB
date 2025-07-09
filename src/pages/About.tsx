import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReloadButton from "../components/ReloadButton";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed flex flex-col">
      {/* 🔲 Barre du haut fixe */}
      <div className="top-0 left-0 h-[40vh] right-0 z-50 bg-black text-white rounded-br-[30px] rounded-bl-[30px] flex flex-col">
        <div className="flex items-center justify-between px-4 pt-6">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>

          <ReloadButton/>

        </div>

        <div className="flex-1 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-[150px] h-auto object-contain mt-[-60px]"
          />
        </div>

        <div className="fixed top-[calc(40vh-20px)] left-1/2 -translate-x-1/2 text-center text-white rounded-[1px] w-[260px] shadow-lg">
          <h2 className="bg-white text-black px-4 py-2 text-sm rounded-[5px]">
            À propos de l'application
          </h2>
        </div>
      </div>

      <div className="h-[calc(100vh-40vh-2.5rem)] w-screen overflow-hidden flex flex-col justify-between mt-10 bg-white text-gray-800 px-4">
        <div className="flex-grow h-[calc(100vh-25rem)] flex items-start justify-center">
          <div className="text-center">
            <p className="text-l mb-4">
              CCF est une application dédiée aux membres du Chœur du Christ en Famille.
            </p>
            <p className="text-l">
              Elle permet d'afficher les paroles des chants utilisés lors des cultes, des répétitions ou des événements spéciaux.
            </p>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 pb-4">
          Made with 🖤
        </div>
      </div>
    </div>
  );
};

export default About;
