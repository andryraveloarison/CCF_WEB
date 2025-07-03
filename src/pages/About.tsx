const About = () => {
    return (
      <div className="h-screen w-screen overflow-hidden flex flex-col justify-between bg-white text-gray-800 px-4">
        <div className="flex-grow h-screen flex items-start justify-center">
          <div className="text-center mt-[20vh]">
            {/* Image responsive avec taille max réduite */}
            <img
              src="/logo.png"
              alt="Logo"
              className="mx-auto mb-6 w-full max-w-[150px] h-auto object-contain"
            />
  
            <p className="text-lg mb-4">
              CCF est une application dédiée aux membres du Chœur du Christ en Famille.
            </p>
            <p className="text-lg">
              Elle permet d'afficher les paroles des chants utilisés lors des cultes, des répétitions ou des événements spéciaux.
            </p>
          </div>
        </div>
  
        <div className="text-center text-sm text-gray-500 pb-4">
          Made with ❤️
        </div>
      </div>
    );
  };
  
  export default About;
  