import "../styles/Home.css";

function Home({ onLogin, onBuyerLogin  }) {

  const products = [
    {
      name: "Copper Scrap",
      description: "High-quality copper scrap for recycling and industrial use.",
      icon: "🟤"
    },
    {
      name: "Aluminium Scrap",
      description: "Aluminium scrap suitable for recycling and manufacturing.",
      icon: "⚙️"
    },
    {
      name: "Iron & Steel Scrap",
      description: "Ferrous scrap materials available for bulk export.",
      icon: "🔩"
    },
    {
      name: "Other Scrap Materials",
      description: "Various recyclable and industrial scrap materials.",
      icon: "♻️"
    }
  ];

  return (
    <div className="home">

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="brand">

          <div className="small-logo">
            EI
          </div>

          <span>
            ExportIndia
          </span>

        </div>

        <div className="nav-links">

          <a href="#products">
            Products
          </a>

          <a href="#about">
            About Us
          </a>

          <a href="#contact">
            Contact
          </a>

        </div>

        <div className="nav-actions">
            <button className="buyer-login" onClick={onBuyerLogin}>
                Buyer Login
            </button>
            <button className="admin-login" onClick={onLogin}>
                Admin Login
            </button>
        </div>

      </nav>


      {/* HERO */}

      <section className="hero">

        <div className="hero-content">

          <p className="hero-label">
            GLOBAL SCRAP EXPORTER
          </p>

          <h1>
            Quality Scrap.
            <br />

            <span>
              Reliable Supply.
            </span>

            <br />

            Global Delivery.
          </h1>

          <p className="hero-description">

            We supply and export quality scrap materials
            from India to buyers across the world.

          </p>

          <div className="hero-buttons">

            <a
              href="#products"
              className="primary-action"
            >
              View Products
            </a>

            <a
              href="#contact"
              className="secondary-action"
            >
              Contact Us
            </a>

          </div>

        </div>

      </section>


      {/* PRODUCTS */}

      <section
        className="products-section"
        id="products"
      >

        <div className="section-header">

          <div>

            <p className="section-label">
              WHAT WE SUPPLY
            </p>

            <h2>
              Our Products
            </h2>

            <p>
              Quality materials available for bulk
              domestic and international supply.
            </p>

          </div>

        </div>


        <div className="product-grid">

          {products.map((product) => (

            <div
              className="product-card"
              key={product.name}
            >

              <div className="product-icon">
                {product.icon}
              </div>

              <h3>
                {product.name}
              </h3>

              <p>
                {product.description}
              </p>

              <button>
                Request Quote →
              </button>

            </div>

          ))}

        </div>

      </section>


      {/* ABOUT */}

      <section
        className="about-section"
        id="about"
      >

        <div className="about-content">

          <p className="section-label">
            ABOUT US
          </p>

          <h2>
            Connecting quality materials
            with global buyers.
          </h2>

          <p>
            We are focused on supplying quality scrap
            and recyclable materials to businesses
            looking for reliable bulk suppliers.
          </p>

          <p>
            Our goal is to build long-term relationships
            with buyers through transparent communication,
            consistent quality and reliable supply.
          </p>

        </div>

        <div className="about-box">

          <div>
            <strong>India</strong>
            <span>Origin</span>
          </div>

          <div>
            <strong>Global</strong>
            <span>Reach</span>
          </div>

          <div>
            <strong>Bulk</strong>
            <span>Supply</span>
          </div>

        </div>

      </section>


      {/* CONTACT */}

      <section
        className="contact-section"
        id="contact"
      >

        <p className="section-label">
          GET IN TOUCH
        </p>

        <h2>
          Looking for scrap materials?
        </h2>

        <p>
          Contact us for product availability,
          pricing and bulk requirements.
        </p>

        <div className="contact-buttons">

          <a href="mailto:your@email.com">
            Email Us
          </a>

          <a href="https://wa.me/919999999999">
            WhatsApp
          </a>

        </div>

      </section>


      {/* FOOTER */}

      <footer>

        <div className="footer-brand">

          <div className="small-logo">
            EI
          </div>

          <span>
            ExportIndia
          </span>

        </div>

        <p>
          Global Scrap Exporter
        </p>

        <p className="copyright">
          © 2026 ExportIndia. All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default Home;