import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import ServiceCard from "../components/ServiceCard";
import { ArrowRight, MapPin ,Search} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function Home() {



    const [villageInfo, setVillageInfo] = useState(null);
    const navigate = useNavigate();
const [searchQuery, setSearchQuery] = useState("");
const [showSearchResults, setShowSearchResults] = useState(false);

useEffect(() => {
    const fetchVillageInfo = async () => {
        try {
            const response = await fetch(
                "http://localhost:3000/api/village-info"
            );

            const result = await response.json();

            if (response.ok && result.success) {
                setVillageInfo(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch village information:", error);
        }
    };

    fetchVillageInfo();
}, []);

    const services = [
        {
            icon: "🌾",
            title: "किसान सेवाएँ",
            description: "खेती, मंडी भाव और कृषि योजनाओं की जानकारी",
            link: "/kisan"
        },
        {
            icon: "📢",
            title: "गाँव की सूचनाएँ",
            description: "Amkheriya की महत्वपूर्ण पंचायत सूचनाएँ",
            link: "/notices"
        },
        {
            icon: "💼",
            title: "स्थानीय रोजगार",
            description: "स्थानीय काम और रोजगार के अवसर",
            link: "/jobs"
        },
        {
            icon: "🛒",
            title: "लोकल मार्केट",
            description: "गाँव के products और local sellers",
            link: "/marketplace"
        },
        {
            icon: "🚨",
            title: "Emergency",
            description: "जरूरी emergency contacts एक जगह",
            link: "/emergency"
        },
        {
            icon: "📝",
            title: "समस्या बताएं",
            description: "गाँव की समस्या online बताएं",
            link: "/complaints"
        }
    ];

    return (
        <>
            <Navbar />


            

{/* HOME PAGE SEARCH */}
<section className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-10">
    <form
        onSubmit={(event) => {
            event.preventDefault();

            const query = searchQuery.trim().toLowerCase();

            if (!query) return;

            const searchRoutes = [
                {
                    keywords: ["notice", "notices", "सूचना", "सूचनाएं", "पंचायत"],
                    link: "/notices",
                },
                {
                    keywords: ["job", "jobs", "employment", "रोजगार", "नौकरी"],
                    link: "/jobs",
                },
                {
                    keywords: ["kisan", "farmer", "farming", "किसान", "खेती"],
                    link: "/kisan",
                },
                {
                    keywords: ["market", "marketplace", "product", "seller", "बाजार", "उत्पाद"],
                    link: "/marketplace",
                },
            ];

            const matchedRoute = searchRoutes.find((item) =>
                item.keywords.some((keyword) => query.includes(keyword))
            );

            if (matchedRoute) {
                setShowSearchResults(false);
                navigate(matchedRoute.link);
                return;
            }

            const facilityKeywords = [
                "school", "education", "health", "hospital", "water",
                "road", "transport", "anganwadi", "facility",
                "स्कूल", "शिक्षा", "स्वास्थ्य", "पानी", "सड़क",
            ];

            if (facilityKeywords.some((keyword) => query.includes(keyword))) {
                setShowSearchResults(false);
                document.getElementById("village-facilities")?.scrollIntoView({
                    behavior: "smooth",
                });
                return;
            }

            setShowSearchResults(true);
        }}
        className="flex w-full items-center gap-2 rounded-full border border-slate-200 bg-white p-2 shadow-[0_4px_24px_rgba(15,23,42,0.06)] transition-all duration-200 hover:border-green-300 focus-within:border-green-600 focus-within:shadow-[0_0_0_4px_rgba(22,163,74,0.10)]"
    >
        <div className="ml-2 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-green-50 text-green-700">
            <Search size={21} strokeWidth={2.2} />
        </div>

        <input
            type="search"
            value={searchQuery}
            onChange={(event) => {
                setSearchQuery(event.target.value);
                setShowSearchResults(false);
            }}
            placeholder="Search notices, jobs, kisan services..."
            aria-label="Search village services"
            className="min-w-0 flex-1 border-0 bg-transparent px-2 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 sm:text-base"
        />

        <button
            type="submit"
            className="shrink-0 rounded-full bg-green-800 px-8 py-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-green-700 active:scale-95 sm:px-10"
        >
            Search
        </button>
    </form>

    <p className="mt-3 text-center text-xs text-slate-500 sm:text-sm">
        Search village services, notices, jobs, farming and marketplace.
    </p>

    {showSearchResults && (
        <p role="status" className="mt-3 text-center text-sm text-amber-700">
            Is keyword ka direct match nahi mila. Notice, Jobs, Kisan ya Marketplace ka naam try karo.
        </p>
    )}
</section>



            <main>

                {/* HERO */}

                <Hero />

                


                {/* VILLAGE INTRO */}

                <section className="village-intro">

                    <div className="village-intro-content">

                        <span className="section-label">
                            📍 OUR VILLAGE
                        </span>
<h2>
    Welcome to <strong>{villageInfo?.villageName || "Amkheriya"}</strong>
</h2>
<p>
    {villageInfo?.introduction ||
        "यह portal हमारे गाँव की महत्वपूर्ण जानकारी, सेवाएँ, रोजगार और पंचायत से जुड़ी जानकारी एक ही जगह उपलब्ध कराने के लिए बनाया गया है।"}
</p>
                        <div className="location-badge">

                            <MapPin size={18} />

                           <span>
    {[
        villageInfo?.villageName || "Amkheriya",
        villageInfo?.tehsil || "Tikariya",
        villageInfo?.district || "Damoh",
        villageInfo?.state || "Madhya Pradesh"
    ].join(" • ")}
</span>

                        </div>

                    </div>


                    {/* INFO CARD */}

                    <div className="village-info-card">

                        <div className="village-info-top">

                            <span>🌾</span>

                            <div>

                                <small>
                                    DIGITAL VILLAGE
                                </small>

                               <h3>
    {villageInfo?.villageName || "Amkheriya"}
</h3>
                            </div>

                        </div>


                        <div className="info-row">

                            <span>
                                📍 District
                            </span>

                         <strong>
    {villageInfo?.district || "Damoh"}
</strong>

                        </div>


                        <div className="info-row">

                            <span>
                                🗺️ State
                            </span>

                         <strong>
    {villageInfo?.state || "Madhya Pradesh"}
</strong>
                        </div>


                        <div className="info-row">

                            <span>
                                🏛️ Panchayat
                            </span>

                           <strong>
    {villageInfo?.gramPanchayat || "Datla"}
</strong>
                        </div>

                    </div>

                </section>



            
{/* VILLAGE PROFILE */}

<section className="village-profile-section">
    <div className="section-heading">
        <span className="section-label">
            🌿 GAON KI PEHCHAAN
        </span>

        <h2>
            Hamara Gaon, <strong>Hamari Pehchaan</strong>
        </h2>

        <p>
            Amkheriya ki pehchaan, sthaniya jeevan aur
            gram panchayat se judi jaankari ek jagah.
        </p>
    </div>

    <div className="village-profile-grid">
        <article className="village-profile-card">
            <span className="profile-icon">🏡</span>
            <h3>Gaon ka Parichay</h3>
            <p>
                Amkheriya, Tikariya, Damoh, Madhya Pradesh
                se judi jaankari aur gaon ki pehchaan.
            </p>
        </article>

        <article className="village-profile-card">
            <span className="profile-icon">🏛️</span>
            <h3>Gram Panchayat</h3>
            <p>
                Panchayat Datla se judi sarvajanik jaankari,
                notices aur nagrik sevaon ke liye ek digital platform.
            </p>
        </article>

        <article className="village-profile-card">
            <span className="profile-icon">🌾</span>
            <h3>Krishi aur Jeevan</h3>
            <p>
                Kheti, sthaniya kaam aur gaon ke logon ke
                liye upyogi sevaon ki jaankari.
            </p>
        </article>

        <article className="village-profile-card">
            <span className="profile-icon">🤝</span>
            <h3>Jan Bhagidari</h3>
            <p>
                Gaon ki samasyaon ko report karne aur
                mahatvapurn suchnaon tak pahunchne ki suvidha.
            </p>
        </article>
    </div>
</section>


                
                {/* VILLAGE FACILITIES */}

                <section className="village-facilities-section">

                    <div className="section-heading">

                        <span className="section-label">
                            🏡 VILLAGE FACILITIES
                        </span>

                        <h2>
                            गाँव की <strong>सुविधाएँ</strong>
                        </h2>

                        <p>
                            Amkheriya गाँव की जरूरी सुविधाओं और
                            सार्वजनिक सेवाओं की जानकारी एक ही जगह।
                        </p>

                    </div>

                    <div className="village-facilities-grid">

                        <div className="village-facility-card">
                            <div className="village-facility-icon">
                                🎓
                            </div>

                            <h3>शिक्षा</h3>

                           <p>
    {villageInfo?.facilities?.school ||
        "स्थानीय स्कूलों और शिक्षा सुविधाओं की जानकारी जल्द उपलब्ध होगी।"}
</p>

                          <span className="facility-status">
    {villageInfo?.facilities?.school
        ? "जानकारी उपलब्ध है"
        : "जानकारी जल्द उपलब्ध होगी"}
</span>
                        </div>

                        <div className="village-facility-card">
                            <div className="village-facility-icon">
                                🏥
                            </div>

                            <h3>स्वास्थ्य सेवाएँ</h3>

                           <p>
    {villageInfo?.facilities?.health ||
        "नजदीकी स्वास्थ्य केंद्र और चिकित्सा सुविधाओं की जानकारी जल्द उपलब्ध होगी।"}
</p>

<span className="facility-status">
    {villageInfo?.facilities?.health
        ? "जानकारी उपलब्ध है"
        : "जानकारी सत्यापन के अधीन"}
</span>
                        </div>

                        <div className="village-facility-card">
                            <div className="village-facility-icon">
                                💧
                            </div>

                            <h3>पेयजल</h3>

                           <p>
    {villageInfo?.facilities?.drinkingWater ||
        "गाँव में पेयजल के स्रोतों और पानी की सुविधा की जानकारी जल्द उपलब्ध होगी।"}
</p>

<span className="facility-status">
    {villageInfo?.facilities?.drinkingWater
        ? "जानकारी उपलब्ध है"
        : "जानकारी सत्यापन के अधीन"}
</span>
                        </div>

                        <div className="village-facility-card">
                            <div className="village-facility-icon">
                                🛣️
                            </div>

                            <h3>सड़कें</h3>

                          <p>
    {villageInfo?.facilities?.roads ||
        "गाँव की सड़कों और आसपास के क्षेत्रों तक पहुँच की जानकारी जल्द उपलब्ध होगी।"}
</p>

<span className="facility-status">
    {villageInfo?.facilities?.roads
        ? "जानकारी उपलब्ध है"
        : "जानकारी सत्यापन के अधीन"}
</span>
                        </div>

                        <div className="village-facility-card">
                            <div className="village-facility-icon">
                                🚌
                            </div>

                            <h3>परिवहन</h3>

                           <p>
    {villageInfo?.facilities?.transport ||
        "नजदीकी बस स्टॉप और परिवहन साधनों की जानकारी जल्द उपलब्ध होगी।"}
</p>

<span className="facility-status">
    {villageInfo?.facilities?.transport
        ? "जानकारी उपलब्ध है"
        : "जानकारी सत्यापन के अधीन"}
</span>
                        </div>

                        <div className="village-facility-card">
                            <div className="village-facility-icon">
                                👶
                            </div>

                            <h3>आँगनवाड़ी</h3>

                          <p>
    {villageInfo?.facilities?.anganwadi ||
        "आँगनवाड़ी केंद्रों और बच्चों से जुड़ी सेवाओं की जानकारी जल्द उपलब्ध होगी।"}
</p>

<span className="facility-status">
    {villageInfo?.facilities?.anganwadi
        ? "जानकारी उपलब्ध है"
        : "जानकारी जल्द उपलब्ध होगी"}
</span>
                        </div>

                    </div>

                </section>



                {/* SERVICES */}

                <section className="services-section">

                    <div className="section-heading">

                        <span>
                            OUR SERVICES
                        </span>

                        <h2>
                            गाँव के लिए <strong>जरूरी सेवाएँ</strong>
                        </h2>

                        <p>
                            Amkheriya के लोगों के लिए जरूरी
                            जानकारी और सेवाएँ अब एक ही जगह।
                        </p>

                    </div>


                    <div className="services-grid">

                        {services.map((service) => (

                            <ServiceCard
                                key={service.title}
                                {...service}
                            />

                        ))}

                    </div>

                </section>


                {/* FARMER */}

                <section className="farmer-section">

                    <div className="farmer-content">

                        <span>
                            🌾 AMKHERIYA KISAN CORNER
                        </span>

                        <h2>

                            हमारे किसानों के लिए

                            <br />

                            <strong>
                                खास जानकारी
                            </strong>

                        </h2>

                        <p>
                            खेती, मौसम, मंडी भाव और सरकारी
                            योजनाओं से जुड़ी उपयोगी जानकारी।
                        </p>

                        <a
                            href="/kisan"
                            className="primary-btn"
                        >

                            किसान सेक्शन देखें

                            <ArrowRight size={18} />

                        </a>

                    </div>


                    <div className="farmer-image">
                        👨‍🌾
                    </div>

                </section>


                {/* LOCATION */}

                <section className="location-section">

                    <div className="location-content">

                        <span className="section-label">
                            📍 FIND OUR VILLAGE
                        </span>

                        <h2>
                            Amkheriya,
                            <strong> Damoh</strong>
                        </h2>

                        <p>
                            Madhya Pradesh, India
                        </p>


                        <div className="location-details">

                            <div>
                                <MapPin size={20} />
                                <span>
                                    Amkheriya
                                </span>
                            </div>

                            <div>
                                🗺️
                                <span>
                                    Damoh District
                                </span>
                            </div>

                            <div>
                                🇮🇳
                                <span>
                                    Madhya Pradesh
                                </span>
                            </div>

                        </div>


                        <a
                            href="https://www.google.com/maps/search/?api=1&query=Amkheriya%2C+Damoh%2C+Madhya+Pradesh"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="map-directions-btn"
                        >

                            📍 Open in Google Maps

                        </a>

                    </div>


                    <div className="map-placeholder">

                        <div className="map-pin">
                            📍
                        </div>

                        <h3>
                            Amkheriya
                        </h3>

                        <p>
                            Damoh, Madhya Pradesh
                        </p>

                        <span className="map-note">
                            Village Location
                        </span>

                    </div>

                </section>

            </main>

            <Footer />

        </>
    );
}

export default Home;