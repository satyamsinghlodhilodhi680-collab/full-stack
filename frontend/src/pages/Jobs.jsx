import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

const initialForm = {
    title: "",
    category: "Labour",
    description: "",
    location: "",
    contactNumber: "",
    salary: ""
};

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [form, setForm] = useState(initialForm);
    const [submitting, setSubmitting] = useState(false);
    const [formMessage, setFormMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const [myJobs, setMyJobs] = useState([]);
    const [myJobsLoading, setMyJobsLoading] = useState(false);
    const [myJobsError, setMyJobsError] = useState("");

    // Job application states
    const [selectedJob, setSelectedJob] = useState(null);
    const [coverLetter, setCoverLetter] = useState("");
    const [applicationMessage, setApplicationMessage] = useState("");
    const [applicationMessageType, setApplicationMessageType] = useState("");
    const [applicationSubmitting, setApplicationSubmitting] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await api.get("/jobs");

                if (response.data.success) {
                    setJobs(response.data.jobs);
                }
            } catch (err) {
                console.error("Fetch Jobs Error:", err);
                setError("Jobs load nahi ho paayi. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormMessage("");
        setMessageType("");

        try {
            const response = await api.post("/jobs", {
                ...form,
                salary: form.salary === "" ? null : Number(form.salary)
            });

            setFormMessage(
                response.data.message ||
                "Job admin approval ke liye submit ho gayi."
            );
            setMessageType("success");
            setForm({ ...initialForm });
        } catch (err) {
            console.error("Submit Job Error:", err);

            setFormMessage(
                err.response?.status === 401
                    ? "Job post karne ke liye pehle login karein."
                    : err.response?.data?.message ||
                      "Job submit nahi hui. Please try again."
            );
            setMessageType("error");
        } finally {
            setSubmitting(false);
        }
    };

    const fetchMyJobs = async () => {
        setMyJobsLoading(true);
        setMyJobsError("");

        try {
            const response = await api.get("/jobs/my");

            if (response.data.success) {
                setMyJobs(response.data.jobs);
            }
        } catch (err) {
            console.error("Fetch My Jobs Error:", err);

            setMyJobsError(
                err.response?.status === 401
                    ? "Apni posted jobs dekhne ke liye login karein."
                    : "Aapki jobs load nahi ho paayi."
            );
        } finally {
            setMyJobsLoading(false);
        }
    };

    // Submit job application
    const handleApply = async (e) => {
        e.preventDefault();

        if (!selectedJob) return;

        setApplicationSubmitting(true);
        setApplicationMessage("");
        setApplicationMessageType("");

        try {
            const response = await api.post("/applications", {
                jobId: selectedJob._id,
                coverLetter: coverLetter.trim()
            });

            setApplicationMessage(
                response.data.message ||
                "Application successfully submitted."
            );
            setApplicationMessageType("success");
            setCoverLetter("");
            setSelectedJob(null);
        } catch (err) {
            console.error("Apply for Job Error:", err);

            setApplicationMessage(
                err.response?.status === 401
                    ? "Apply karne ke liye pehle login karein."
                    : err.response?.data?.message ||
                      "Application submit nahi hui. Please try again."
            );
            setApplicationMessageType("error");
        } finally {
            setApplicationSubmitting(false);
        }
    };

    const inputClass =
        "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100";

    const labelClass =
        "mb-2 block text-sm font-semibold text-gray-700";

    const categories = [
        {
            icon: "👨‍🌾",
            title: "मजदूर",
            description: "खेती के लिए local workers खोजें।",
            color: "bg-green-50"
        },
        {
            icon: "🚜",
            title: "Tractor Service",
            description: "अपने आसपास tractor service खोजें।",
            color: "bg-amber-50"
        },
        {
            icon: "🔧",
            title: "Electrician",
            description: "स्थानीय electrician की जानकारी।",
            color: "bg-blue-50"
        },
        {
            icon: "🛠️",
            title: "Other Services",
            description: "गाँव में उपलब्ध दूसरी local services।",
            color: "bg-purple-50"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                {/* Page Header */}
                <section className="mb-10 text-center">
                    <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-bold tracking-wide text-green-800">
                        💼 LOCAL WORK
                    </span>

                    <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
                        स्थानीय रोजगार
                    </h1>

                    <p className="mx-auto mt-3 max-w-2xl text-gray-600 sm:text-lg">
                        अपने आसपास काम और services खोजें और गाँव में
                        रोजगार के अवसर बढ़ाएँ।
                    </p>
                </section>

                {/* Category Cards */}
                <section className="mb-14">
                    <h2 className="mb-6 text-2xl font-bold text-gray-900">
                        Explore Categories
                    </h2>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {categories.map((category) => (
                            <div
                                key={category.title}
                                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div
                                    className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${category.color}`}
                                >
                                    {category.icon}
                                </div>

                                <h3 className="text-lg font-bold text-gray-900">
                                    {category.title}
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-gray-600">
                                    {category.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Job Posting Form */}
                <section className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="rounded-3xl bg-green-800 p-7 text-white sm:p-9 lg:col-span-1">
                        <span className="text-4xl">🤝</span>

                        <h2 className="mt-5 text-2xl font-bold">
                            गाँव में काम पाएँ और दें
                        </h2>

                        <p className="mt-4 leading-7 text-green-100">
                            अपनी job या service की जानकारी साझा करें।
                            Submit करने के बाद admin आपकी listing review
                            करेगा।
                        </p>

                        <div className="mt-7 space-y-4 text-sm text-green-50">
                            <p>✓ आसान job posting</p>
                            <p>✓ Admin approval system</p>
                            <p>✓ Approved listings public होंगी</p>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-9 lg:col-span-2">
                        <div className="mb-7">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Post a Job / Service
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                सभी जरूरी जानकारी भरें।
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className={labelClass}>
                                    Job / Service Title *
                                </label>

                                <input
                                    className={inputClass}
                                    type="text"
                                    name="title"
                                    placeholder="Example: Electrician Required"
                                    value={form.title}
                                    onChange={handleChange}
                                    required
                                    maxLength={100}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Category *
                                </label>

                                <select
                                    className={inputClass}
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Labour">Labour</option>
                                    <option value="Tractor Service">
                                        Tractor Service
                                    </option>
                                    <option value="Electrician">
                                        Electrician
                                    </option>
                                    <option value="Plumber">Plumber</option>
                                    <option value="Other Services">
                                        Other Services
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Description *
                                </label>

                                <textarea
                                    className={inputClass}
                                    name="description"
                                    placeholder="Job ya service ke baare mein likhein..."
                                    value={form.description}
                                    onChange={handleChange}
                                    required
                                    maxLength={2000}
                                    rows={4}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                    <label className={labelClass}>
                                        Village / Location *
                                    </label>

                                    <input
                                        className={inputClass}
                                        type="text"
                                        name="location"
                                        placeholder="Amkheriya Tikariya"
                                        value={form.location}
                                        onChange={handleChange}
                                        required
                                        maxLength={150}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Contact Number *
                                    </label>

                                    <input
                                        className={inputClass}
                                        type="tel"
                                        name="contactNumber"
                                        placeholder="10-digit mobile number"
                                        value={form.contactNumber}
                                        onChange={handleChange}
                                        pattern="[6-9][0-9]{9}"
                                        title="Valid 10-digit Indian mobile number enter karein"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Salary / Service Charge (₹)
                                </label>

                                <input
                                    className={inputClass}
                                    type="number"
                                    name="salary"
                                    placeholder="Optional"
                                    value={form.salary}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </div>

                            <div className="rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                                <strong>Note:</strong> Submit karne ke baad
                                job pending rahegi. Admin approval ke baad
                                hi public listing mein aayegi.
                            </div>

                            {formMessage && (
                                <div
                                    role="status"
                                    className={`rounded-xl p-4 text-sm ${
                                        messageType === "success"
                                            ? "bg-green-50 text-green-800"
                                            : "bg-red-50 text-red-700"
                                    }`}
                                >
                                    {formMessage}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full rounded-xl bg-green-700 px-6 py-3.5 font-bold text-white shadow-sm transition hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                            >
                                {submitting
                                    ? "Submitting..."
                                    : "Submit for Approval →"}
                            </button>
                        </form>
                    </div>
                </section>

                {/* My Posted Jobs */}
                <section className="mb-14 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                My Posted Jobs
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                Apni jobs aur approval status dekhein.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={fetchMyJobs}
                            disabled={myJobsLoading}
                            className="rounded-xl bg-green-700 px-4 py-2.5 font-semibold text-white hover:bg-green-800 disabled:opacity-60"
                        >
                            {myJobsLoading ? "Loading..." : "View My Jobs"}
                        </button>
                    </div>

                    {myJobsError && (
                        <p className="mt-5 rounded-xl bg-red-50 p-4 text-red-700">
                            {myJobsError}
                        </p>
                    )}

                    {!myJobsLoading && !myJobsError && myJobs.length === 0 && (
                        <p className="mt-5 text-gray-500">
                            View My Jobs par click karke apni posted jobs dekhein.
                        </p>
                    )}

                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                        {myJobs.map((job) => (
                            <article
                                key={job._id}
                                className="rounded-2xl border border-gray-200 p-5"
                            >
                                <h3 className="text-lg font-bold text-gray-900">
                                    {job.title}
                                </h3>

                                <p className="mt-2 text-sm text-gray-600">
                                    {job.category} · {job.location}
                                </p>

                                <span
                                    className={`mt-4 inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                                        job.status === "approved"
                                            ? "bg-green-100 text-green-800"
                                            : job.status === "rejected"
                                              ? "bg-red-100 text-red-800"
                                              : "bg-amber-100 text-amber-800"
                                    }`}
                                >
                                    {job.status === "approved"
                                        ? "Approved"
                                        : job.status === "rejected"
                                          ? "Rejected"
                                          : "Pending Approval"}
                                </span>
                            </article>
                        ))}
                    </div>
                </section>

                {/* Approved Jobs */}
                <section>
                    <div className="mb-7">
                        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                            Available Jobs & Services
                        </h2>

                        <p className="mt-2 text-gray-600">
                            यहाँ admin-approved jobs दिखाई देंगी।
                        </p>
                    </div>

                    {loading && (
                        <p className="rounded-2xl bg-white p-6 text-gray-600 shadow-sm">
                            Jobs load ho rahi hain...
                        </p>
                    )}

                    {!loading && error && (
                        <div className="rounded-2xl bg-red-50 p-6 text-red-700">
                            {error}
                        </div>
                    )}

                    {!loading && !error && jobs.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
                            <span className="text-4xl">📋</span>

                            <h3 className="mt-4 text-lg font-bold text-gray-800">
                                अभी कोई approved job उपलब्ध नहीं है
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                नई listings admin approval के बाद यहाँ दिखेंगी।
                            </p>
                        </div>
                    )}

                    {!loading && !error && jobs.length > 0 && (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {jobs.map((job) => (
                                <article
                                    key={job._id}
                                    className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                                            {job.category}
                                        </span>

                                        <span className="text-xl">💼</span>
                                    </div>

                                    <h3 className="mt-4 text-xl font-bold text-gray-900">
                                        {job.title}
                                    </h3>

                                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-gray-600">
                                        {job.description}
                                    </p>

                                    <div className="mt-5 space-y-3 border-t border-gray-100 pt-4 text-sm">
                                        <p className="flex gap-2 text-gray-600">
                                            <span>📍</span>
                                            <span>{job.location}</span>
                                        </p>

                                        <p className="flex gap-2 font-semibold text-gray-800">
                                            <span>💰</span>
                                            <span>
                                                {job.salary != null
                                                    ? `₹${job.salary}`
                                                    : "Salary negotiable"}
                                            </span>
                                        </p>
                                    </div>

                                    <div className="mt-5 inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                        ✓ Admin Approved
                                    </div>

                                    {/* Apply Now Button */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedJob(job);
                                            setCoverLetter("");
                                            setApplicationMessage("");
                                            setApplicationMessageType("");
                                        }}
                                        className="mt-5 w-full rounded-xl bg-green-700 px-4 py-3 font-bold text-white transition hover:bg-green-800"
                                    >
                                        Apply Now →
                                    </button>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                {/* Application Form */}
                {selectedJob && (
                    <section className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Apply for Job
                                </h2>

                                <p className="mt-2 text-gray-600">
                                    {selectedJob.title}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedJob(null);
                                    setApplicationMessage("");
                                }}
                                className="rounded-lg px-3 py-2 font-semibold text-gray-600 hover:bg-gray-100"
                            >
                                Cancel ✕
                            </button>
                        </div>

                        <form onSubmit={handleApply} className="mt-6 space-y-5">
                            <div>
                                <label className={labelClass}>
                                    Cover Letter *
                                </label>

                                <textarea
                                    className={inputClass}
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    placeholder="Apne baare mein aur aap is job ke liye suitable kyun hain, likhein..."
                                    rows={5}
                                    maxLength={2000}
                                    required
                                />

                                <p className="mt-1 text-right text-xs text-gray-500">
                                    {coverLetter.length}/2000
                                </p>
                            </div>

                            {applicationMessage && (
                                <div
                                    role="status"
                                    className={`rounded-xl p-4 text-sm ${
                                        applicationMessageType === "success"
                                            ? "bg-green-50 text-green-800"
                                            : "bg-red-50 text-red-700"
                                    }`}
                                >
                                    {applicationMessage}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={applicationSubmitting}
                                className="w-full rounded-xl bg-green-700 px-6 py-3 font-bold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                            >
                                {applicationSubmitting
                                    ? "Submitting..."
                                    : "Submit Application →"}
                            </button>
                        </form>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default Jobs;