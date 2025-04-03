'use client';
import './hero.css';
import LoadCard from '../loadcard/loadcard';
import LanguageSwitcher from "../language-switcher/switcher";


export default function Hero() {
  // Example loads
  const loads = [
    {
      id: 1,
      name: "Sample Load",
      description: "Ship building material",
      pickup: "Riga",
      delivery: "Barcelona",
      price: "$1500"
    },
    {
      id: 2,
      name: "Fresh Produce",
      description: "Frozen Veggies Load",
      pickup: "Warsaw",
      delivery: "Berlin",
      price: "$900"
    }
  ];

  return (
    <section className="hero-section">
      <div className="hero-overlay"></div>
          <span className='lang'><LanguageSwitcher /></span>
      
      <div className="hero-content">
        <h1>Connecting Shippers &amp; Drivers</h1>
        <p>A trusted platform where shippers meet drivers for efficient and reliable trucking services.</p>
      </div>
      {/* We'll place load cards in the hero for demonstration */}
      <div className="load-grid">
        {loads.map(load => (
          <div key={load.id} className="grid-item">
            <LoadCard load={load} />
          </div>
        ))}
      </div>
    </section>
  );
}
