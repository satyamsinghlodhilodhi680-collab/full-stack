
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await api.get("/applications/my");

                if (response.data.success) {
                    setApplications(response.data.applications);
                }
            } catch (err) {
                console.error("Fetch Applications Error:", err);

                setError(
                    err.response?.status === 401
                        ? "Applications dekhne ke liye pehle login karein."
                        : "Applications load nahi ho paayi. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const statusStyle = {
        pending: "bg-amber-100 text-amber-800",
        reviewed: "bg-blue-100 text-blue-800",
        shortlisted: "bg-green-100 text-green-800",
        rejected: "bg-red-100 text-red-800"
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <section className="mb-8">
                    <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-800">
                        💼 MY JOB APPLICATIONS
                    </span>

                    <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        My Applications
                    </h1>

                    <p className="mt-3 text-gray-600">
                        Apni submitted applications aur unka current status dekhein.
                    </p>
                </section>

                {loading && (
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        Applications load ho rahi hain...
                    </div>
                )}

                {!loading && error && (
                    <div className="rounded-2xl bg-red-50 p-6 text-red-700">
                        {error}
                    </div>
                )}

                {!loading && !error && applications.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
                        <span className="text-4xl">📋</span>

                        <h2 className="mt-4 text-xl font-bold text-gray-900">
                            Abhi koi application nahi hai
                        </h2>

                        <p className="mt-2 text-gray-600">
                            Jobs page par jaakar available jobs ke liye apply karein.
                        </p>
                    </div>
                )}

                {!loading && !error && applications.length > 0 && (
                    <>
                        <p className="mb-5 text-sm text-gray-600">
                            Total applications:{" "}
                            <strong>{applications.length}</strong>
                        </p>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {applications.map((application) => (
                                <article
                                    key={application._id}
                                    className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <h2 className="text-xl font-bold text-gray-900">
                                            {application.job?.title || "Job unavailable"}
                                        </h2>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                                                statusStyle[application.status] ||
                                                "bg-gray-100 text-gray-700"
                                            }`}
                                        >
                                            {application.status}
                                        </span>
                                    </div>

                                    {application.job && (
                                        <>
                                            <p className="mt-3 text-sm text-gray-600">
                                                {application.job.category} ·{" "}
                                                {application.job.location}
                                            </p>

                                            <p className="mt-2 text-sm font-semibold text-gray-800">
                                                💰{" "}
                                                {application.job.salary != null
                                                    ? `₹${application.job.salary}`
                                                    : "Salary negotiable"}
                                            </p>
                                        </>
                                    )}

                                    <div className="mt-5 border-t border-gray-100 pt-4">
                                        <h3 className="text-sm font-bold text-gray-800">
                                            Your Cover Letter
                                        </h3>

                                        <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-600">
                                            {application.coverLetter}
                                        </p>

                                        <p className="mt-4 text-xs text-gray-500">
                                            Applied on:{" "}
                                            {new Date(application.createdAt).toLocaleDateString("en-IN")}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default MyApplications;
