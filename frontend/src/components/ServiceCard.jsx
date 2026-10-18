import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

function ServiceCard({
    icon,
    title,
    description,
    link
}) {

    return (
        <Link
            to={link}
            className="service-card"
        >

            <div className="service-card-icon">
                {icon}
            </div>

            <div className="service-card-content">

                <h3>
                    {title}
                </h3>

                <p>
                    {description}
                </p>

            </div>

            <div className="service-card-arrow">
                <ArrowUpRight size={18} />
            </div>

        </Link>
    );
}

export default ServiceCard;