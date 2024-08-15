import * as React from "react";
import "./Aboutus.css"

function AboutSection() {
  return (
    <section className="about-section">
      <h2 className="about-title">About Us</h2>
      <p className="mission-statement">
        <span className="highlight">INFINIX</span> providing the best
        opportunities to the students around the globe.
      </p>
      <p className="description">
        INFINIX is a UI/UX Design Academy in Kashmir involved in User
        Experience and User Interface Training and Consulting. It was started in
        2023 and is passionate about User Interface Design/ User Experience
        Design, Human-Computer Interaction Design. Humanoid is gushing towards
        competence to acquire knowledge and have a wide understanding of the
        sphere through the foremost courses in the area of UI/UX Design, by
        strengthening up your skills, for your golden future.
      </p>
      <div className="cta-container">
        <button className="cta-button">Join Us As Tutor</button>
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/d6a4ce5131f790b9b48049b496c52f33c37b07568d5c52dc71f707a952a0dc6f?apiKey=9050d04291ce4752986908aa78cf4f10&" alt="Call to action graphic" className="cta-image" />
      </div>
    </section>
  )
}

function ImageColumn() {
  return (
    <aside className="image-column">
      <div className="image-container">
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/c8e6fd0ccd67d7a68fbbb0aedb64c8285a6553249bad3c35ddf87653480a32b2?apiKey=9050d04291ce4752986908aa78cf4f10&" alt="Decorative graphic 1" className="decorative-image" />
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/bb32097ad8db126794ecfc2a641f1bb5df2b4a5034b10156e99aa9d0cc9ee7b2?apiKey=9050d04291ce4752986908aa78cf4f10&" alt="Decorative graphic 2" className="decorative-image" />
      </div>
    </aside>
  );
}

function MyComponent() {
  return (
    <>
      <main className="content">
        <AboutSection />
        <ImageColumn />
      </main>

      
    </>
  );
}

export default MyComponent;
