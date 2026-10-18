import { ArrowRight, MapPin, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

function Hero() {
    return (
        <section className="hero">

            {/* Background decoration */}
            <div className="hero-glow hero-glow-one"></div>
            <div className="hero-glow hero-glow-two"></div>

            <div className="hero-container">

                {/* LEFT CONTENT */}
                <div className="hero-content">

                    <div className="hero-location">
                        <MapPin size={16} />
                        <span>Amkheriya • Damoh • Madhya Pradesh</span>
                    </div>

                    <h1>
                        हमारा गाँव,
                        <br />
                        <span>हमारी पहचान।</span>
                    </h1>

                    <p>
                        <strong>Amkheriya Digital Village</strong> में आपका
                        स्वागत है। गाँव की जानकारी, किसान सेवाएँ,
                        रोजगार, सूचनाएँ और जरूरी सेवाएँ अब एक ही जगह।
                    </p>

                    <div className="hero-buttons">

                        <Link
                            to="/notices"
                            className="hero-primary-btn"
                        >
                            गाँव की जानकारी देखें
                            <ArrowRight size={18} />
                        </Link>

                        <Link
                            to="/emergency"
                            className="hero-secondary-btn"
                        >
                            <ShieldCheck size={18} />
                            Emergency Help
                        </Link>

                    </div>

                    <div className="hero-trust">

                        <div className="trust-icon">
                            🌾
                        </div>

                        <div>
                            <strong>Digital Village Initiative</strong>
                            <span>
                                Connecting Amkheriya digitally
                            </span>
                        </div>

                    </div>

                </div>


                {/* RIGHT SIDE */}
                <div className="hero-village-card">

                    <div className="hero-card-top">

                        <span className="live-dot"></span>

                        <span>
                            VILLAGE PORTAL
                        </span>

                    </div>

                    <div className="hero-village-icon">
                        🏡
                    </div>

                    <h2>
                        AMKHERIYA
                    </h2>

                    <p>
                        Damoh, Madhya Pradesh
                    </p>

                    <div className="hero-divider"></div>

                    <div className="hero-mini-stats">

                        <div>
                            <strong>398+</strong>
                            <span>Population*</span>
                        </div>

                        <div>
                            <strong>110</strong>
                            <span>Families*</span>
                        </div>

                        <div>
                            <strong>470661</strong>
                            <span>PIN</span>
                        </div>

                    </div>

                    <div className="hero-card-footer">
                        <span>🌱</span>
                        <p>
                            Welcome to our digital village
                        </p>
                    </div>

                </div>

            </div>

        </section>
    );
}

export default Hero;