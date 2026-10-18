import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Emergency() {
    const contacts = [
        {
            icon: "🚑",
            title: "Ambulance",
            number: "108"
        },
        {
            icon: "👮",
            title: "Police",
            number: "112"
        },
        {
            icon: "🚒",
            title: "Fire",
            number: "101"
        },
        {
            icon: "🏥",
            title: "Hospital",
            number: "Emergency"
        }
    ];

    return (
        <>
            <Navbar />

            <main className="page">

                <div className="page-header emergency-header">
                    <span>🚨 EMERGENCY</span>
                    <h1>Emergency सहायता</h1>
                    <p>
                        जरूरी स्थिति में महत्वपूर्ण contacts।
                    </p>
                </div>

                <div className="emergency-grid">

                    {contacts.map((contact) => (
                        <a
                            href={`tel:${contact.number}`}
                            className="emergency-card"
                            key={contact.title}
                        >
                            <span>{contact.icon}</span>
                            <h3>{contact.title}</h3>
                            <strong>{contact.number}</strong>
                        </a>
                    ))}

                </div>

            </main>

            <Footer />
        </>
    );
}

export default Emergency;