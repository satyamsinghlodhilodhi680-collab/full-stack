
import { useEffect, useState } from "react";
import api from "../services/api";

function VillageInfoManagement() {
    const [formData, setFormData] = useState({
        villageName: "",
        tehsil: "",
        district: "",
        state: "",
        gramPanchayat: "",
        introduction: "",
        population: "",
        households: "",
        villageCode: "",
        pinCode: "",
        populationDataYear: "",
        facilities: {
            school: "",
            health: "",
            drinkingWater: "",
            roads: "",
            transport: "",
            anganwadi: ""
        }
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchVillageInfo = async () => {
            try {
                const response = await api.get("/village-info");

                if (response.data.success) {
                    const village = response.data.data;

                    setFormData({
                        villageName: village.villageName || "",
                        tehsil: village.tehsil || "",
                        district: village.district || "",
                        state: village.state || "",
                        gramPanchayat: village.gramPanchayat || "",
                        introduction: village.introduction || "",
                        population: village.population ?? "",
                        households: village.households ?? "",
                        villageCode: village.villageCode || "",
                        pinCode: village.pinCode || "",
                        populationDataYear: village.populationDataYear ?? "",
                        facilities: {
                            school: village.facilities?.school || "",
                            health: village.facilities?.health || "",
                            drinkingWater: village.facilities?.drinkingWater || "",
                            roads: village.facilities?.roads || "",
                            transport: village.facilities?.transport || "",
                            anganwadi: village.facilities?.anganwadi || ""
                        }
                    });
                }
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Village information load nahi ho payi."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchVillageInfo();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleFacilityChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            facilities: {
                ...previous.facilities,
                [name]: value
            }
        }));
    };

    
const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    const pinCode = formData.pinCode.trim();
    const villageCode = formData.villageCode.trim();
    const population = formData.population;
    const households = formData.households;
    const year = formData.populationDataYear;

    // Required fields
    if (
        !formData.villageName.trim() ||
        !formData.district.trim() ||
        !formData.state.trim() ||
        !formData.gramPanchayat.trim()
    ) {
        setError("Village Name, District, State aur Gram Panchayat required hain.");
        return;
    }

    // PIN code: exactly 6 digits
    if (pinCode && !/^[1-9][0-9]{5}$/.test(pinCode)) {
        setError("Valid 6-digit Indian PIN code enter karo.");
        return;
    }

    // Population must be a non-negative integer
    if (
        population !== "" &&
        (!Number.isSafeInteger(Number(population)) || Number(population) < 0)
    ) {
        setError("Population ek valid whole number honi chahiye.");
        return;
    }

    // Households must be a non-negative integer
    if (
        households !== "" &&
        (!Number.isSafeInteger(Number(households)) || Number(households) < 0)
    ) {
        setError("Households ek valid whole number hona chahiye.");
        return;
    }

    // Population year validation
    if (
        year !== "" &&
        (
            !/^\d{4}$/.test(year) ||
            Number(year) < 1800 ||
            Number(year) > new Date().getFullYear()
        )
    ) {
        setError("Valid 4-digit data year enter karo.");
        return;
    }

    // Village code validation
    if (villageCode && !/^\d+$/.test(villageCode)) {
        setError("Village Census Code mein sirf digits hone chahiye.");
        return;
    }

    setSaving(true);

    try {
        const payload = {
            ...formData,
            population: population === "" ? null : Number(population),
            households: households === "" ? null : Number(households),
            populationDataYear: year === "" ? null : Number(year),
            pinCode,
            villageCode,
        };

        const response = await api.put("/village-info", payload);

        if (response.data.success) {
            setMessage("Village information successfully update ho gayi.");
        }
    } catch (err) {
        setError(
            err.response?.data?.message ||
            "Information update nahi ho payi."
        );
    } finally {
        setSaving(false);
    }
};


    if (loading) {
        return (
            <div className="p-8">
                Village information load ho rahi hai...
            </div>
        );
    }

    const inputClass =
        "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100";

    const labelClass =
        "mb-2 block text-sm font-semibold text-slate-700";

    return (
        <main className="min-h-screen bg-slate-50 p-4 text-slate-800 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-6xl">

                {/* Page Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-green-700">
                            <span className="h-2 w-2 rounded-full bg-green-600"></span>
                            Gao-Connect / Admin
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Village Information
                        </h1>

                        <p className="mt-2 text-sm text-slate-500 sm:text-base">
                            Manage your village profile and public facilities.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-green-100 bg-white px-4 py-3 shadow-sm">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-xl">
                            🌿
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Village Portal</p>
                            <p className="font-semibold text-green-800">
                                Gao-Connect
                            </p>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {message && (
                    <div
                        role="status"
                        className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
                    >
                        <p className="font-semibold">✓ Changes saved</p>
                        <p className="mt-1">{message}</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div
                        role="alert"
                        className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                        <p className="font-semibold">Something went wrong</p>
                        <p className="mt-1">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Basic Information */}
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-xl">
                                    🏡
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Basic Information
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Update the official details of your village.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7">
                            {[
                                ["villageName", "Village Name"],
                                ["tehsil", "Tehsil"],
                                ["district", "District"],
                                ["state", "State"],
                                ["gramPanchayat", "Gram Panchayat"]
                            ].map(([name, label]) => (
                                <label key={name} className="block">
                                    <span className={labelClass}>
                                        {label}
                                        {name !== "tehsil" && (
                                            <span className="ml-1 text-red-500">*</span>
                                        )}
                                    </span>

                                    <input
                                        name={name}
                                        value={formData[name]}
                                        onChange={handleChange}
                                        required={name !== "tehsil"}
                                        placeholder={`Enter ${label.toLowerCase()}`}
                                        className={inputClass}
                                    />
                                </label>
                            ))}

                            <label className="block sm:col-span-2">
                                <span className={labelClass}>
                                    Village Introduction
                                </span>

                                <textarea
                                    name="introduction"
                                    value={formData.introduction}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Write a verified introduction about your village..."
                                    className={`${inputClass} resize-y`}
                                />

                                <span className="mt-2 block text-xs text-slate-400">
                                    Use accurate, locally verified information.
                                </span>
                            </label>
                        </div>
                    </section>

                    {/* Population and Official Codes */}
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-xl">
                                    📊
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Population & Official Details
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Enter figures from official records.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3 sm:p-7">
                            {[
                                ["population", "Population", "number"],
                                ["households", "Households", "number"],
                                ["villageCode", "Village Census Code", "text"],
                                ["pinCode", "PIN Code", "text"],
                                ["populationDataYear", "Population Data Year", "number"]
                            ].map(([name, label, type]) => (
                                <label key={name} className="block">
                                    <span className={labelClass}>
                                        {label}
                                    </span>

                                    <input
                                        name={name}
                                        type={type}
                                        min={type === "number" ? 0 : undefined}
                                        step={type === "number" ? 1 : undefined}
                                        maxLength={type === "text" ? 10 : undefined}
                                        value={formData[name]}
                                        onChange={handleChange}
                                        placeholder={`Enter ${label.toLowerCase()}`}
                                        className={inputClass}
                                    />
                                </label>
                            ))}

                            <p className="text-xs leading-5 text-slate-500 sm:col-span-2 lg:col-span-3">
                                Population aur households ke saath unka data year zaroor maintain karein.
                                Census figures ko current population ke roop mein present na karein.
                            </p>
                        </div>
                    </section>

                    {/* Village Facilities */}
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-xl">
                                    🏥
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Village Facilities
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Maintain information about services available in the village.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-3">
                            {[
                                ["school", "Education / School", "🏫"],
                                ["health", "Health Services", "🏥"],
                                ["drinkingWater", "Drinking Water", "💧"],
                                ["roads", "Roads", "🛣️"],
                                ["transport", "Transport", "🚌"],
                                ["anganwadi", "Anganwadi", "👶"]
                            ].map(([name, label, emoji]) => (
                                <div
                                    key={name}
                                    className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-green-300 hover:shadow-sm"
                                >
                                    <label className="block">
                                        <span className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-lg">
                                                {emoji}
                                            </span>
                                            {label}
                                        </span>

                                        <textarea
                                            name={name}
                                            value={formData.facilities[name]}
                                            onChange={handleFacilityChange}
                                            rows={4}
                                            placeholder={`Enter verified ${label.toLowerCase()} details...`}
                                            className={`${inputClass} resize-y`}
                                        />
                                    </label>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Save Actions */}
                    <div className="sticky bottom-0 z-10 -mx-4 border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:static sm:mx-0 sm:rounded-2xl sm:border sm:px-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs leading-5 text-slate-500 sm:text-sm">
                                Please verify the information before saving.
                            </p>

                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-800 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                            >
                                {saving ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
                                        Saving Changes...
                                    </>
                                ) : (
                                    <>
                                        <span>✓</span>
                                        Save Village Information
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </main>
    );
}

export default VillageInfoManagement;
