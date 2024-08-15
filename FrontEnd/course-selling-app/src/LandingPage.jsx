import * as React from "react";
import "./LandingPage.css"
import { useNavigate } from "react-router-dom";
import { EmailState, userEmailState } from "./store/selectors/userEmailState";
import { useRecoilValue } from "recoil";

function FeatureCard({ imgSrc, imgAlt, title }) {
  return (
  <div className="feature-card">
    <img loading="lazy" src={imgSrc} alt={imgAlt} className="feature-image" />
  </div>
  );
}

function LandingPage() {
    const navigate = useNavigate();
    const userEmail = useRecoilValue(userEmailState);
    const Email = useRecoilValue(EmailState);
 const features = [
  { imgSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/39c2f649e6c39a949db8b96a33d3e36bba1876f2c2f8799d59cd0c14fb4161d7?apiKey=9050d04291ce4752986908aa78cf4f10&", imgAlt:"Public Speaking icon", title: "Public Speaking" },
  { imgSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/6a4667dc89b997015faee184fe01110a2ce8fdfa3d36b64e4a0b598ee3f493b2?apiKey=9050d04291ce4752986908aa78cf4f10&", imgAlt: "Career-Oriented icon", title: "Career-Oriented" },
  { imgSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/d1acbc0da3aae6dda4981653e68ee8e5481cfadb6278d3f2ac1d3624d66e86c1?apiKey=9050d04291ce4752986908aa78cf4f10&", imgAlt: "Creative Thinking icon", title: "Creative Thinking" }
  ];

  return (
    <>
      <section className="main-container">
        <header className="hero">
          <h1 className="hero-title">
            <span className="text-dark">up</span> your <span className="text-highlight">skills</span>
            <br />
            to <span className="text-highlight">advance</span> your <span className="text-highlight">career</span>
            <span className="text-dark"> path</span>
          </h1>
          <p className="hero-description">
            Learn UI-UX Design skills with weekend UX. The latest online learning system and material that help your knowledge growing.
          </p>
          { !(Email || userEmail) && <div className="cta-buttons">
            
            <button className="cta-primary"  onClick={() => {
                                    navigate("/user/signin")
                                }}>Get Started As User </button>
            <button className="cta-secondary"  onClick={() => {
                                    navigate("/admin/signin")
                                }}>Get Started as Admin</button>
          </div>}
        </header>
        <section className="featuresicon">
          {features.map(feature => (
            <FeatureCard key={feature.title} imgSrc={feature.imgSrc} imgAlt={feature.imgAlt} />
          ))}
        </section>
      </section>

      
    </>
  );
}

export default LandingPage;
