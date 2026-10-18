import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Marketplace() {
    return (
        <>
            <Navbar />

            <main className="page">

                <div className="page-header">
                    <span>🛒 LOCAL MARKET</span>
                    <h1>लोकल मार्केट</h1>
                    <p>गाँव के products को खरीदें और बेचें।</p>
                </div>

                <div className="feature-grid">

                    <div className="feature-card">
                        <span>🌾</span>
                        <h3>अनाज</h3>
                        <p>स्थानीय किसानों के अनाज।</p>
                    </div>

                    <div className="feature-card">
                        <span>🥛</span>
                        <h3>दूध</h3>
                        <p>स्थानीय dairy products।</p>
                    </div>

                    <div className="feature-card">
                        <span>🥬</span>
                        <h3>सब्जियाँ</h3>
                        <p>स्थानीय fresh vegetables।</p>
                    </div>

                    <div className="feature-card">
                        <span>🚜</span>
                        <h3>Agriculture Equipment</h3>
                        <p>कृषि उपकरणों की local listings।</p>
                    </div>

                </div>

            </main>

            <Footer />
        </>
    );
}

export default Marketplace;