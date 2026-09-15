import { useEffect, useState } from "react";

import API from "../services/api";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import ProgressChart from "../components/ProgressChart";
import RecentActivity from "../components/RecentActivity";
import QuickActions from "../components/QuickActions";

export default function Dashboard() {

    const [dashboard, setDashboard] = useState(null);

    useEffect(() => {

        const fetchDashboard = async () => {

            try {

                const res = await API.get("/dashboard");
                console.log(res.data);
                
                setDashboard(res.data);

            } catch (error) {

                console.error(error);

            }

        };

        fetchDashboard();

    }, []);

    if (!dashboard) {

        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                Loading Dashboard...
            </div>
        );

    }

    const chartData = dashboard.interviews.map((item) => ({
        date: new Date(item.createdAt).toLocaleDateString(),
        score: item.score,
    }));

    return (

        <div className="flex bg-slate-950 text-white min-h-screen">

            <Sidebar />

            <div className="flex-1 p-8">

                <Navbar />

                <h1 className="text-4xl font-bold mt-8">
                    Welcome Back 👋
                </h1>

                {/* Stats */}

                <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mt-8">

                    <StatCard
                        title="Resume Score"
                        value={`${dashboard.resumeScore}%`}
                    />

                    <StatCard
                        title="Interviews"
                        value={dashboard.totalInterviews}
                    />

                    <StatCard
                        title="Average Score"
                        value={dashboard.averageScore}
                    />

                    <StatCard
                        title="ATS Score"
                        value={`${dashboard.resumeScore}%`}
                    />

                </div>

                {/* Chart */}

                <div className="grid lg:grid-cols-3 gap-6 mt-8">

                    <div className="lg:col-span-2">

                        <ProgressChart data={chartData} />

                    </div>

                    <QuickActions />

                </div>

                {/* Recent Interviews */}

                <div className="mt-8">

                    <RecentActivity interviews={dashboard.interviews} />

                </div>

            </div>

        </div>

    );

}