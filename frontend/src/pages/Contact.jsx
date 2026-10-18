import {
    Mail,
    Phone,
    MapPin,
    ArrowLeft,
    Send
} from "lucide-react";
import { Link } from "react-router-dom";

function Contact() {
    return (
        <>

            {/* PAGE HEADER */}

            <section className="contact-hero">

                <div className="contact-hero-content">

                    <span>
                        📞 GET IN TOUCH
                    </span>

                    <h1>
                        हमसे <strong>संपर्क करें</strong>
                    </h1>

                    <p>
                        Amkheriya और Panchayat Datla से जुड़ी
                        जानकारी या सहायता के लिए संपर्क करें।
                    </p>

                </div>

            </section>


            {/* CONTACT CONTENT */}

            <main className="contact-page">

                <div className="contact-grid">


                    {/* CONTACT INFORMATION */}

                    <div className="contact-info">

                        <span className="contact-label">
                            CONTACT DETAILS
                        </span>

                        <h2>
                            Amkheriya
                            <br />
                            <strong>Village Connect</strong>
                        </h2>

                        <p>
                            गाँव से जुड़ी जानकारी, सहायता और
                            आवश्यक संपर्क के लिए नीचे दिए गए
                            details का उपयोग करें।
                        </p>


                        {/* PHONE */}

                        <a
                            href="tel:7693946796"
                            className="contact-item"
                        >

                            <div className="contact-item-icon">
                                <Phone size={21} />
                            </div>

                            <div>
                                <span>PHONE</span>
                                <strong>
                                    7693946796
                                </strong>
                            </div>

                        </a>


                        {/* EMAIL */}

                        <a
                            href="mailto:satyamsinghlodhilodhi680@gmail.com"
                            className="contact-item"
                        >

                            <div className="contact-item-icon">
                                <Mail size={21} />
                            </div>

                            <div>
                                <span>EMAIL</span>
                                <strong>
                                    satyamsinghlodhilodhi680@gmail.com
                                </strong>
                            </div>

                        </a>


                        {/* PANCHAYAT */}

                        <div className="contact-item">

                            <div className="contact-item-icon">
                                <MapPin size={21} />
                            </div>

                            <div>
                                <span>PANCHAYAT</span>

                                <strong>
                                    Datla Gram Panchayat
                                </strong>

                                <small>
                                    Damoh, Madhya Pradesh
                                </small>
                            </div>

                        </div>

                    </div>


                    {/* CONTACT CARD */}

                    <div className="contact-card">

                        <div className="contact-card-icon">
                            🌾
                        </div>

                        <span>
                            AMKHERIYA DIGITAL VILLAGE
                        </span>

                        <h3>
                            हमारा गाँव,
                            <br />
                            हमारी पहचान।
                        </h3>

                        <p>
                            गाँव की आवाज़ और जानकारी को
                            डिजिटल रूप से जोड़ने की एक पहल।
                        </p>


                        <div className="contact-location">

                            <MapPin size={18} />

                            <div>
                                <strong>
                                    Amkheriya
                                </strong>

                                <span>
                                    Damoh, Madhya Pradesh
                                </span>
                            </div>

                        </div>


                        <a
                            href="mailto:satyamsinghlodhilodhi680@gmail.com"
                            className="contact-email-btn"
                        >
                            <Send size={17} />

                            Email करें
                        </a>

                    </div>

                </div>


                {/* BACK HOME */}

                <Link
                    to="/"
                    className="back-home"
                >
                    <ArrowLeft size={17} />
                    वापस Home पर जाएँ
                </Link>

            </main>

        </>
    );
}

export default Contact;