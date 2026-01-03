import Image from "next/image";

const WelcomePage = () => {
  const data = [
    {
      title: "SPAZIO KOLME",
      texts: [
        {
          text: "Benvenuto in Kolme | Ti presentiamo Spazio Kolme",
          url: "/benvenuto",
        },
        {
          text: "Guida alla 'Non Cancellazione Cookies'",
          url: "/guida-cookies",
        },
      ],
    },
    {
      title: "POS NG",
      texts: [
        {
          text: "VideoGuida: Installazione Certificato POS Evo",
          url: "/benvenuto",
        },
        {
          text: "VideoGuida: Creazione delle Utenze per l'accesso a POS Evo",
          url: "/guida-cookies",
        },
      ],
    },
    {
      title: "BIGINO",
      texts: [
        {
          text: "WINDTRE | Guida accessi POS Evo e strumenti uitli",
          url: "/benvenuto",
        },
        {
          text: "Very Mobile | Guida accessi POS Evo e strumenti utili",
          url: "/guida-cookies",
        },
      ],
    },
  ];

  return (
    <div className="flex mt-10">
      <div>
        <Image width={100} height={100} src="/assets/kolme.png" alt="Welcome" />
      </div>
      <div className="ml-20">
        {data.map((item, index) => (
          <div className="mt-2" key={index}>
            <h1 className="font-bold text-gray-500">{item.title}</h1>
            {item.texts.map((text, textIndex) => (
              <div key={textIndex}>
                <a className="text-blue-500" href={text.url}>
                  {text.text}
                </a>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WelcomePage;
