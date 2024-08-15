import * as React from "react";
import "./cards.css" 

function ServiceCard({ imageSrc, title, description }) {
  return (
    <article className="service-card">
      <div className="image-container">
        <img loading="lazy" src={imageSrc} alt={`${title} Icon`} />
      </div>
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
      <a className="learn-more" href="#">
        Learn More
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/5fb82e7a529c27255cf547f114538defb658258a147f932fe4c708347e8caa56?apiKey=9050d04291ce4752986908aa78cf4f10&" alt="" />
      </a>
    </article>
  );
}

function CardLanding() {
  const services = [
    {
      imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/55c97dbaea404afa5b6800d0fc3d0cc04254eb0e1ec1b19a1d48be3ff901edb0?apiKey=9050d04291ce4752986908aa78cf4f10&",
      title: "Interaction Design",
      description: "Lessons on design that cover the most recent developments."
    },
    {
      imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/9a256adc0c63ddce62eab02a6b1c690d4137cfa35582e118650882bb2f24b7bb?apiKey=9050d04291ce4752986908aa78cf4f10&",
      title: "UX Design Course",
      description: "Classes in development that cover the most recent advancements in web."
    },
    {
      imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/d77863a3db8f75e57a1aea88fe37dfe44521ccb747a285e38e44b6316e5e97b1?apiKey=9050d04291ce4752986908aa78cf4f10&",
      title: "User Interface Design",
      description: "User Interface Design courses that cover the most recent trends."
    }
  ];

  return (
    <main className="main-container">
      <h1 className="heading">Our Services</h1>
      <h2 className="subheading">Fostering a playful & engaging learning environment</h2>
      <section className="services-container">
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            imageSrc={service.imageSrc}
            title={service.title}
            description={service.description}
          />
        ))}
      </section>
    </main>
  );
}

export default CardLanding;
