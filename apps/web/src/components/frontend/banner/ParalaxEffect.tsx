import ParalaxCard from "./ParalaxCard";

const cardData = [
  { videoSrc: "/assets/car-video-2.mp4", title: "Fleet", description: "Over 300 vehicles in stock...", index: 1 },
  { videoSrc: "/assets/car-video-3.mp4", title: "Affordability", description: "Our buy here pay here...", index: 2 },
  // Add other cards here
];

const ParalaxEffect = () => (
  <section className="projects-section">
    {cardData.map((card, idx) => (
      <ParalaxCard key={idx} {...card} />
    ))}
  </section>
);

export default ParalaxEffect;
