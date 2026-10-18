import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Kisan() {
    return (
        <>
            <Navbar />

            <main className="page">

                <div className="page-header">
                    <span>🌾 KISAN CENTER</span>
                    <h1>किसान सेवाएँ</h1>
                    <p>
                        किसानों के लिए खेती और कृषि से जुड़ी उपयोगी जानकारी।
                    </p>
                </div>

                <div className="feature-grid">

                    <div className="feature-card">
                        <span>📈</span>
                        <h3>मंडी भाव</h3>
                        <p>अलग-अलग फसलों के वर्तमान बाजार भाव।</p>
                    </div>

                    <div className="feature-card">
                        <span>🌦️</span>
                        <h3>मौसम</h3>
                        <p>खेती के लिए मौसम से जुड़ी जानकारी।</p>
                    </div>

                    <div className="feature-card">
                        <span>🌱</span>
                        <h3>खेती की जानकारी</h3>
                        <p>फसल और खेती से संबंधित उपयोगी tips।</p>
                    </div>

                    <div className="feature-card">
                        <span>🏛️</span>
                        <h3>सरकारी योजनाएँ</h3>
                        <p>किसानों के लिए उपलब्ध योजनाओं की जानकारी।</p>
                    </div>

                </div>

            </main>

            <Footer />
        </>
    );
}

export default Kisan;