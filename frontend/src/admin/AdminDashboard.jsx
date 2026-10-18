
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import {
    Users,
    Megaphone,
    ClipboardList,
    Clock,
    LayoutDashboard,
    ArrowUpRight,
    Globe,
    Sprout,
    ShieldCheck,
    BriefcaseBusiness,
    AlertCircle,
    Menu,
    X,
    PanelLeftClose,
    PanelLeftOpen,
    CheckCircle,
    XCircle,
    RefreshCw,
    MapPin,
    CalendarDays
} from "lucide-react";

function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalNotices: 0,
        totalComplaints: 0,
        pendingComplaints: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const [villageInfo, setVillageInfo] = useState(null);
    const [villageInfoError, setVillageInfoError] = useState("");

    // Pending jobs states
    const [pendingJobs, setPendingJobs] = useState([]);
    const [jobsLoading, setJobsLoading] = useState(true);
    const [jobsError, setJobsError] = useState("");
    const [updatingJobId, setUpdatingJobId] = useState("");
    const [jobsMessage, setJobsMessage] = useState("");
    const [jobsMessageType, setJobsMessageType] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await api.get("/auth/admin/dashboard");

                if (response.data.success) {
                    setStats(response.data.stats);
                }
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Dashboard data load nahi ho paya."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    useEffect(() => {
        const fetchVillageInfo = async () => {
            try {
                const response = await api.get("/village-info");

                if (response.data.success) {
                    setVillageInfo(response.data.data);
                }
            } catch (err) {
                setVillageInfoError(
                    err.response?.data?.message ||
                    "Village information load nahi ho payi."
                );
            }
        };

        fetchVillageInfo();
    }, []);

    // Fetch pending jobs from backend
    const fetchPendingJobs = async () => {
        setJobsLoading(true);
        setJobsError("");

        try {
            const response = await api.get("/jobs/pending");

            if (response.data.success) {
                setPendingJobs(response.data.jobs || []);
            } else {
                setJobsError(
                    response.data.message || "Pending jobs load nahi hui."
                );
            }
        } catch (err) {
            setJobsError(
                err.response?.data?.message ||
                "Pending jobs load nahi hui. Admin login aur backend check karo."
            );
        } finally {
            setJobsLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingJobs();
    }, []);

    // Approve or reject a job
    const handleJobStatus = async (jobId, status) => {
        const action = status === "approved" ? "approve" : "reject";

        const confirmed = window.confirm(
            `Kya aap is job ko ${action} karna chahte hain?`
        );

        if (!confirmed) return;

        setUpdatingJobId(jobId);
        setJobsMessage("");
        setJobsMessageType("");
        setJobsError("");

        try {
            const response = await api.patch(
                `/jobs/${jobId}/status`,
                { status }
            );

            if (response.data.success) {
                setPendingJobs((previousJobs) =>
                    previousJobs.filter((job) => job._id !== jobId)
                );

                setJobsMessage(
                    status === "approved"
                        ? "Job successfully approved ho gayi."
                        : "Job reject kar di gayi."
                );

                setJobsMessageType("success");
            } else {
                setJobsMessage(
                    response.data.message || "Job status update nahi hua."
                );
                setJobsMessageType("error");
            }
        } catch (err) {
            setJobsMessage(
                err.response?.data?.message ||
                "Job status update nahi hua. Admin permission check karo."
            );
            setJobsMessageType("error");
        } finally {
            setUpdatingJobId("");
        }
    };

    const statCards = [
        {
            title: "Total Users",
            value: stats.totalUsers,
            icon: Users,
            color: "bg-blue-50 text-blue-700",
            description: "Registered community members"
        },
        {
            title: "Total Notices",
            value: stats.totalNotices,
            icon: Megaphone,
            color: "bg-green-50 text-green-700",
            description: "Published village notices"
        },
        {
            title: "Total Complaints",
            value: stats.totalComplaints,
            icon: ClipboardList,
            color: "bg-purple-50 text-purple-700",
            description: "Complaints received"
        },
        {
            title: "Pending Complaints",
            value: stats.pendingComplaints,
            icon: Clock,
            color: "bg-amber-50 text-amber-700",
            description: "Awaiting attention"
        }
    ];

    return (
        <div className="min-h-screen w-full bg-[#f6f8f6] text-gray-800">

            {/* Mobile overlay */}
            {mobileSidebarOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar overlay"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#123c2c] text-white transition-transform duration-300 ${
                    mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0 ${
                    sidebarCollapsed ? "md:hidden" : ""
                }`}
            >
                <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-5">
                    <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-3"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                            <Sprout size={25} className="text-emerald-300" />
                        </div>

                        <div>
                            <p className="whitespace-nowrap text-lg font-bold">
                                Gaon Connect
                            </p>
                            <p className="text-xs text-green-100/60">
                                Admin Portal
                            </p>
                        </div>
                    </Link>

                    <button
                        type="button"
                        onClick={() => setMobileSidebarOpen(false)}
                        aria-label="Close sidebar"
                        className="rounded-lg p-2 hover:bg-white/10 md:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="px-4 pt-8">
                    <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-green-100/50">
                        Main Menu
                    </p>

                    <nav className="space-y-2">
                        <Link
                            to="/admin/dashboard"
                            onClick={() => setMobileSidebarOpen(false)}
                            className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold"
                        >
                            <LayoutDashboard size={19} />
                            Dashboard
                        </Link>

                        <Link
                            to="/admin/notices"
                            onClick={() => setMobileSidebarOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-green-50/80 hover:bg-white/10"
                        >
                            <Megaphone size={19} />
                            Manage Notices
                            <ArrowUpRight size={15} className="ml-auto" />
                        </Link>

                        <Link
    to="/admin/events"
    onClick={() => setMobileSidebarOpen(false)}
    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-green-50/80 hover:bg-white/10"
>
    <CalendarDays size={19} />
    Manage Events
    <ArrowUpRight size={15} className="ml-auto" />
</Link>

                        <Link
                            to="/admin/complaints"
                            onClick={() => setMobileSidebarOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-green-50/80 hover:bg-white/10"
                        >
                            <ClipboardList size={19} />
                            Manage Complaints
                            <ArrowUpRight size={15} className="ml-auto" />
                        </Link>

                        <Link
                            to="/admin/village-info"
                            onClick={() => setMobileSidebarOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-green-50/80 hover:bg-white/10"
                        >
                            <Globe size={19} />
                            Village Information
                            <ArrowUpRight size={15} className="ml-auto" />
                        </Link>

                        <a
                            href="#pending-jobs"
                            onClick={() => setMobileSidebarOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-green-50/80 hover:bg-white/10"
                        >
                            <BriefcaseBusiness size={19} />
                            Manage Jobs

                            {pendingJobs.length > 0 && (
                                <span className="ml-auto rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-gray-900">
                                    {pendingJobs.length}
                                </span>
                            )}
                        </a>
                    </nav>
                </div>

                <div className="mt-auto p-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="mb-2 flex items-center gap-2 text-emerald-300">
                            <ShieldCheck size={18} />
                            <span className="text-sm font-semibold">
                                Admin Workspace
                            </span>
                        </div>

                        <p className="text-xs leading-5 text-green-50/60">
                            Manage village information from one place.
                        </p>
                    </div>

                    <Link
                        to="/"
                        className="mt-4 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-green-50/80 hover:bg-white/10"
                    >
                        <Globe size={18} />
                        Visit Website
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <div
                className={`min-h-screen w-full transition-all duration-300 ${
                    sidebarCollapsed
                        ? "ml-0 w-full"
                        : "ml-0 w-full md:ml-64 md:w-[calc(100%-16rem)]"
                }`}
            >
                <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white/95 px-4 sm:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setMobileSidebarOpen(true)}
                            aria-label="Open sidebar"
                            className="rounded-xl border border-gray-200 p-2.5 hover:bg-green-50 md:hidden"
                        >
                            <Menu size={20} />
                        </button>

                        <button
                            type="button"
                            onClick={() => setSidebarCollapsed((prev) => !prev)}
                            aria-label={
                                sidebarCollapsed ? "Show sidebar" : "Hide sidebar"
                            }
                            title={
                                sidebarCollapsed ? "Show sidebar" : "Hide sidebar"
                            }
                            className="inline-flex rounded-xl border border-gray-200 bg-white p-2.5 text-gray-600 transition hover:bg-green-50 hover:text-green-700"
                        >
                            {sidebarCollapsed ? (
                                <PanelLeftOpen size={20} />
                            ) : (
                                <PanelLeftClose size={20} />
                            )}
                        </button>

                        <div>
                            <p className="text-xs text-gray-400">
                                GAON CONNECT / ADMIN
                            </p>
                            <h1 className="mt-1 text-lg font-bold sm:text-xl">
                                Dashboard Overview
                            </h1>
                        </div>
                    </div>

                    <div className="hidden text-right sm:block">
                        <p className="text-sm font-semibold">Administrator</p>
                        <p className="text-xs text-gray-400">
                            Management Portal
                        </p>
                    </div>
                </header>

                <main className="mx-auto w-full p-4 sm:p-8 lg:p-10">

                    {/* Welcome section */}
                    <section className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-[#174d36] to-[#24744b] p-6 text-white sm:p-8">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs">
                            <Sprout size={14} />
                            COMMUNITY MANAGEMENT
                        </span>

                        <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
                            Welcome to your dashboard
                        </h2>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-green-50/80 sm:text-base">
                            Keep track of your village community, publish important
                            notices and stay on top of complaints and job approvals.
                        </p>
                    </section>

                    {/* Statistics */}
                    <div className="mb-5">
                        <h2 className="text-lg font-bold">
                            Community Statistics
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Overview of your village portal activity
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            <AlertCircle size={20} />
                            <p>{error}</p>
                        </div>
                    )}

                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {statCards.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.title}
                                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                {item.title}
                                            </p>
                                            <p className="mt-3 text-3xl font-bold">
                                                {loading ? "Loading..." : item.value}
                                            </p>
                                        </div>

                                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}>
                                            <Icon size={22} />
                                        </div>
                                    </div>

                                    <p className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-400">
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </section>

                    {/* Pending Jobs Approval */}
                    <section
                        id="pending-jobs"
                        className="mt-8 scroll-mt-24 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                    >
                        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                                    <BriefcaseBusiness size={25} />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Pending Jobs
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Review job posts before publishing them
                                    </p>
                                </div>

                                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">
                                    {pendingJobs.length}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={fetchPendingJobs}
                                disabled={jobsLoading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <RefreshCw
                                    size={16}
                                    className={jobsLoading ? "animate-spin" : ""}
                                />
                                Refresh Jobs
                            </button>
                        </div>

                        <div className="p-5 sm:p-6">
                            {jobsMessage && (
                                <div
                                    className={`mb-5 rounded-xl border p-4 text-sm ${
                                        jobsMessageType === "success"
                                            ? "border-green-200 bg-green-50 text-green-800"
                                            : "border-red-200 bg-red-50 text-red-700"
                                    }`}
                                >
                                    {jobsMessage}
                                </div>
                            )}

                            {jobsError && (
                                <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                    <AlertCircle size={20} className="shrink-0" />
                                    <div>
                                        <p className="font-semibold">
                                            Jobs load nahi hui
                                        </p>
                                        <p className="mt-1">{jobsError}</p>
                                    </div>
                                </div>
                            )}

                            {jobsLoading ? (
                                <div className="py-10 text-center text-sm text-gray-500">
                                    Loading pending jobs...
                                </div>
                            ) : jobsError ? (
                                <div className="py-4 text-center">
                                    <button
                                        type="button"
                                        onClick={fetchPendingJobs}
                                        className="rounded-xl bg-[#174d36] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#24744b]"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            ) : pendingJobs.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-gray-300 px-4 py-10 text-center">
                                    <CheckCircle
                                        size={36}
                                        className="mx-auto text-green-600"
                                    />
                                    <h3 className="mt-3 font-bold text-gray-800">
                                        No Pending Jobs
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Abhi review karne ke liye koi job nahi hai.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {pendingJobs.map((job) => (
                                        <article
                                            key={job._id}
                                            className="rounded-2xl border border-gray-200 p-5 transition hover:border-green-200 hover:shadow-sm sm:p-6"
                                        >
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="break-words text-lg font-bold text-gray-900">
                                                            {job.title}
                                                        </h3>

                                                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                                                            Pending
                                                        </span>
                                                    </div>

                                                    <span className="mt-3 inline-flex rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-800">
                                                        {job.category}
                                                    </span>

                                                    <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-gray-600">
                                                        {job.description}
                                                    </p>

                                                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <MapPin size={16} />
                                                            {job.location}
                                                        </span>

                                                        {job.salary !== null &&
                                                            job.salary !== undefined &&
                                                            job.salary !== "" && (
                                                                <span>
                                                                    Salary: ₹
                                                                    {Number(job.salary).toLocaleString("en-IN")}
                                                                </span>
                                                            )}
                                                    </div>

                                                    <div className="mt-4 border-t border-gray-100 pt-4 text-xs text-gray-400">
                                                        Posted on:{" "}
                                                        {job.createdAt
                                                            ? new Date(job.createdAt).toLocaleDateString(
                                                                "en-IN",
                                                                {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                    year: "numeric"
                                                                }
                                                            )
                                                            : "Date unavailable"}
                                                    </div>
                                                </div>

                                                <div className="flex shrink-0 flex-col gap-2 sm:w-36">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleJobStatus(
                                                                job._id,
                                                                "approved"
                                                            )
                                                        }
                                                        disabled={updatingJobId !== ""}
                                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        {updatingJobId === job._id ? (
                                                            <RefreshCw
                                                                size={17}
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <CheckCircle size={17} />
                                                        )}
                                                        Approve
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleJobStatus(
                                                                job._id,
                                                                "rejected"
                                                            )
                                                        }
                                                        disabled={updatingJobId !== ""}
                                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        <XCircle size={17} />
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Village Information Summary */}
                    <section className="mt-8 overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm">
                        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                                    <Globe size={25} />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Village Information
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Overview of your village profile
                                    </p>
                                </div>
                            </div>

                            <Link
                                to="/admin/village-info"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#174d36] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#24744b]"
                            >
                                Edit Information
                                <ArrowUpRight size={16} />
                            </Link>
                        </div>

                        <div className="p-5 sm:p-6">
                            {villageInfoError ? (
                                <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                                    {villageInfoError}
                                </div>
                            ) : villageInfo ? (
                                <>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                        <div className="rounded-xl bg-gray-50 p-4">
                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                                Village Name
                                            </p>
                                            <p className="mt-2 break-words font-bold text-gray-900">
                                                {villageInfo.villageName || "Not available"}
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-gray-50 p-4">
                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                                District
                                            </p>
                                            <p className="mt-2 break-words font-bold text-gray-900">
                                                {villageInfo.district || "Not available"}
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-gray-50 p-4">
                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                                Gram Panchayat
                                            </p>
                                            <p className="mt-2 break-words font-bold text-gray-900">
                                                {villageInfo.gramPanchayat || "Not available"}
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-gray-50 p-4">
                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                                Last Updated
                                            </p>
                                            <p className="mt-2 font-bold text-gray-900">
                                                {villageInfo.updatedAt
                                                    ? new Date(villageInfo.updatedAt).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric"
                                                        }
                                                    )
                                                    : "Not available"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center gap-2 text-sm text-green-700">
                                        <ShieldCheck size={17} />
                                        Village profile is available
                                    </div>
                                </>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    Loading village information...
                                </p>
                            )}
                        </div>
                    </section>

                    {/* Quick actions */}
                    <section className="mt-10">
                        <h2 className="text-lg font-bold">Quick Actions</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage important community activities
                        </p>

                        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
                            <Link
                                to="/admin/notices"
                                className="group flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-green-200 hover:shadow-md sm:p-6"
                            >
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                                    <Megaphone size={24} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-3">
                                        <h3 className="font-bold">Manage Notices</h3>
                                        <ArrowUpRight size={19} />
                                    </div>

                                    <p className="mt-2 text-sm leading-6 text-gray-500">
                                        Create, update and publish announcements for your village.
                                    </p>

                                    <span className="mt-4 inline-flex text-sm font-semibold text-green-700">
                                        Open notices →
                                    </span>
                                </div>
                            </Link>

                            <Link
                                to="/admin/complaints"
                                className="group flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-blue-200 hover:shadow-md sm:p-6"
                            >
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                    <ClipboardList size={24} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-3">
                                        <h3 className="font-bold">Manage Complaints</h3>
                                        <ArrowUpRight size={19} />
                                    </div>

                                    <p className="mt-2 text-sm leading-6 text-gray-500">
                                        Review complaints and track community concerns.
                                    </p>

                                    <span className="mt-4 inline-flex text-sm font-semibold text-blue-700">
                                        View complaints →
                                    </span>
                                </div>
                            </Link>
                            <Link
    to="/admin/events"
    className="group flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-purple-200 hover:shadow-md sm:p-6"
>
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
        <CalendarDays size={24} />
    </div>

    <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
            <h3 className="font-bold">Manage Events</h3>
            <ArrowUpRight size={19} />
        </div>

        <p className="mt-2 text-sm leading-6 text-gray-500">
            Create and manage Gram Sabha meetings, health camps
            and other village events.
        </p>

        <span className="mt-4 inline-flex text-sm font-semibold text-purple-700">
            Open events →
        </span>
    </div>
</Link>

                            <a
                                href="#pending-jobs"
                                className="group flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-amber-200 hover:shadow-md sm:p-6"
                            >
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                                    <BriefcaseBusiness size={24} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-3">
                                        <h3 className="font-bold">Manage Jobs</h3>
                                        <ArrowUpRight size={19} />
                                    </div>

                                    <p className="mt-2 text-sm leading-6 text-gray-500">
                                        Review and approve job posts submitted by villagers.
                                    </p>

                                    <span className="mt-4 inline-flex text-sm font-semibold text-amber-700">
                                        Review jobs ({pendingJobs.length}) →
                                    </span>
                                </div>
                            </a>
                        </div>
                    </section>

                    <footer className="mt-10 border-t border-gray-200 pt-5 text-center text-xs text-gray-400 sm:text-left">
                        © Gaon Connect · Village Community Portal
                    </footer>
                </main>
            </div>
        </div>
    );
}

export default AdminDashboard;
