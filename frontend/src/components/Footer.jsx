import { Link } from "react-router-dom";
import { MapPin, ArrowUpRight } from "lucide-react";

function Footer() {

    return (
        <footer className="footer">

            <div className="footer-container">

                {/* BRAND */}

                <div className="footer-brand">

                    <div className="footer-logo">
                        🌾
                    </div>

                    <h3>
                        THIKERIYA AMKHERIYA
                    </h3>

                    <p>
                        हमारा गाँव, हमारी पहचान।
                    </p>

                    <div className="footer-location">
                        <MapPin size={15} />
                        <span>
                       tikeriya  amkheriya    Damoh, Madhya Pradesh
                        </span>
                    </div>

                </div>


                {/* QUICK LINKS */}

                <div className="footer-column">

                    <h4>
                        QUICK LINKS
                    </h4>

                    <Link to="/">
                        Home
                    </Link>

                    <Link to="/kisan">
                        Kisan Services
                    </Link>

                    <Link to="/notices">
                        Village Notices
                    </Link>

                    <Link to="/jobs">
                        Local Jobs
                    </Link>

                </div>


                {/* SERVICES */}

                <div className="footer-column">

                    <h4>
                        SERVICES
                    </h4>

                    <Link to="/marketplace">
                        Local Market
                    </Link>

                    <Link to="/emergency">
                        Emergency
                    </Link>

                    <Link to="/complaints">
                        Complaints
                    </Link>

                    <Link to="/contact">
                        Contact
                    </Link>

                </div>


                {/* ADMIN */}

                <div className="footer-column">

                    <h4>
                        VILLAGE PORTAL
                    </h4>

                    <p className="footer-info">
                        गाँव की जानकारी और सेवाओं को
                        डिजिटल रूप से एक जगह लाने की
                        कोशिश।
                    </p>

                    <Link
                        to="/admin"
                        className="admin-link"
                    >
                        Admin Panel
                        <ArrowUpRight size={15} />
                    </Link>

                </div>

            </div>


            <div className="footer-bottom">

                <span>
                    © {new Date().getFullYear()} Amkheriya Digital Village
                </span>

                <span>
                    Built for our village ❤️
                </span>

            </div>

        </footer>
    );
}

export default Footer;