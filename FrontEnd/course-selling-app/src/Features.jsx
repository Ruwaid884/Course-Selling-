import * as React from "react";
import "./Feature.css"

function FeatureSection() {
  const features = [
    {
      title: "Standardization",
      description: "When working in a global workplace...",
      imgSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/2e6364e21a5ae4f1e354791c7fea7103560126e753a511ef9ea245ad1851caf1?apiKey=9050d04291ce4752986908aa78cf4f10&",
      readMore: "Read More",
    },
    {
      title: "Reduced Costs",
      description: "With Weekend UX, there’s no cost to reproduce materials...",
      imgSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/0239abed422f12e74904f677d4890b5829a8706ee614e541e2bc76673f8e93a3?apiKey=9050d04291ce4752986908aa78cf4f10&",
      readMore: "Read More",
    },
    {
      title: "More Customization",
      description: "Just like learners aren’t one-size-fits-all...",
      imgSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/bef9f4583b99c19fdc240017cae1006b9d7bb2c7235a41acb085cede7078f4a8?apiKey=9050d04291ce4752986908aa78cf4f10&",
      readMore: "Read More",
    },
    {
      title: "Affordable Pricing",
      description: "With Weekend UX, there’s no cost to reproduce materials...",
      imgSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/e22886094eaf9cb4399c25fa24de8f221553ac2f5fcc343fcbc2c6b3586883a2?apiKey=9050d04291ce4752986908aa78cf4f10&",
      readMore: "Read More",
    },
    {
      title: "Learner Satisfaction",
      description: "If you really want students to retain what they learn...",
      imgSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/de327ecfc82eeaa569a73d2c784845b414c5fcf678069968bad5e395a7695336?apiKey=9050d04291ce4752986908aa78cf4f10&",
      readMore: "Read More",
    },
    {
      title: "Multimedia Materials",
      description: "One of the main reasons why custom eLearning is effective...",
      imgSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/ea35825d55d900997cd5896efe10d5c2530bd2ea0db4c9caae4425680713e178?apiKey=9050d04291ce4752986908aa78cf4f10&",
      readMore: "Read More",
    },
  ];

  return (
    <>
      <div className="container">
        <section className="features">
          <div className="image-container">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/69577598a95631b6426aed8cd38fee3c66a2e7b6120ce10f0655b07a8d268e1a?apiKey=9050d04291ce4752986908aa78cf4f10&"
              className="main-image"
              alt="Decorative Feature Image"
            />
          </div>
          <div className="text-container">
            <h1 className="section-title">Features</h1>
            <p className="section-description">
              We are always working to provide you best of the features in all
              aspects.
            </p>
            <p className="section-paragraph">
              At WEEKENDUX the chief determination is to clear the minds of our
              students about their goals, while making them consistent in their
              ambitions and pushing them to be confident for their journey
              towards the course of time.
            </p>
            <p className="section-paragraph">
              You will find every little thing on the internet in just a click
              of hand, but here we admire that without knowledge and practice
              the internet may even also fail you in your life.
            </p>
            <div className="learn-more-container">
              <span>Learn More</span>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/99b9d9e1ecaa1ab1895668179042c085f0a1fb719d5c204f4c4510d9f535fd93?apiKey=9050d04291ce4752986908aa78cf4f10&"
                className="arrow-icon"
                alt="Arrow forward"
              />
            </div>
          </div>
        </section>
        <section className="benefits">
          <h1 className="section-title">Our Benefits</h1>
          <p className="section-description">
            By Joining <span className="highlight">INFINIX</span> Platform, One Can Avail a Lot Of Benefits.
          </p>
          <p className="section-paragraph">
            Install our top-rated dropshipping app to your e-commerce site and
            get access to US Suppliers, AliExpress vendors, and the best.
          </p>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div className={`feature feature-${index}`} key={index}>
                <img
                  loading="lazy"
                  src={feature.imgSrc}
                  className="feature-icon"
                  alt={feature.title}
                />
                <h2 className="feature-title">{feature.title}</h2>
                <p className="feature-description">
                  {feature.description}{" "}
                  <span className="read-more">{feature.readMore}</span>
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
      
    </>
  );
}

export default FeatureSection;
