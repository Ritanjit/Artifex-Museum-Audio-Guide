// src\components\dashboard\dashboard.tsx
import React, { useState, useEffect } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    RadialBarChart,
    RadialBar,
    PolarAngleAxis
} from "recharts";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Users, MessageSquare, BarChart2, CalendarIcon } from "lucide-react";
import { getAllFeedback } from "@/actions/feedback";
import { useVisitorCounter } from "@/lib/contexts/VisitorCounterContext";
import { getVisitorHistory } from "@/apis/visitorApi";

// Fixed hardcoded data structure
const data = {
    week: Array(7).fill(null).map((_, i) => ({
        day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
        visitors: 120 + i * 15,
        feedbacks: 45 + i * 10,
        avgRating: 4.0 + i * 0.1
    })),
    month: Array(30).fill(null).map((_, i) => ({
        day: `Day ${i + 1}`,
        visitors: 100 + i * 3,
        feedbacks: 50 + i,
        avgRating: 4.0 + (i % 5) * 0.1
    })),
    year: Array(12).fill(null).map((_, i) => ({
        month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
        visitors: 3000 + i * 100,
        feedbacks: 1200 + i * 50,
        avgRating: 4.0 + (i % 5) * 0.1
    }))
};

// Custom Bar component with hover effect
const AnimatedBar = (props: any) => {
    const { fill, x, y, width, height } = props;
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                rx={8}
                ry={8}
                fill={fill}
                style={{
                    transition: "all 0.3s ease",
                }}
                className="group hover:scale-[1.06] hover:drop-shadow-md transform origin-bottom"
            />
        </g>
    );
};

// Custom Tooltip to prevent object rendering errors
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 border border-gray-200 shadow-md rounded-md">
                <p className="text-gray-700 font-medium">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const Dashboard = () => {
    const [view, setView] = useState<"week" | "month" | "year">("week");
    const [selectedMetric, setSelectedMetric] = useState<"visitors" | "feedbacks" | "avgRating">("visitors");
    const [showAll, setShowAll] = useState(true);

    const { visitorCount } = useVisitorCounter();

    // State for feedback data
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [visitorHistory, setVisitorHistory] = useState<any[]>([]);
    const [historyLoading, setHistoryLoading] = useState(true);

    // Fetch visitor history from FrontQL
    useEffect(() => {
        const fetchVisitorHistory = async () => {
            try {
                const history = await getVisitorHistory(view);

                // Improved aggregation logic
                const aggregatedHistory = history.reduce((acc: Record<string, any>, item) => {
                    let key;
                    if (view === 'year') {
                        // Parse date to get month name
                        const dateParts = item.date.split('-');
                        if (dateParts.length === 3) {
                            const [year, month] = dateParts;
                            const dateObj = new Date(`${year}-${month}-01`);
                            key = dateObj.toLocaleString('default', { month: 'short' });
                        } else {
                            // Fallback to date if format is unexpected
                            key = item.date;
                        }
                    } else {
                        key = item.date;
                    }

                    if (!acc[key]) {
                        acc[key] = {
                            ...item,
                            count: 0
                        };
                    }
                    acc[key].count += Number(item.count);
                    return acc;
                }, {});

                setVisitorHistory(Object.values(aggregatedHistory));
            } catch (error) {
                console.error("Error fetching visitor history:", error);
            } finally {
                setHistoryLoading(false);
            }
        };

        fetchVisitorHistory();
    }, [view]);

    // Fetch feedback data from FrontQL
    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const data = await getAllFeedback();
                setFeedbacks(data);
            } catch (error) {
                console.error("Failed to load feedback:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, []);

    // Calculate statistics based on API data
    const totalFeedbacksCount = feedbacks.length;
    const averageRating = totalFeedbacksCount > 0
        ? feedbacks.reduce((sum, f) => {
            // Ensure rating is a number between 1-5
            const rating = Math.min(5, Math.max(1, Number(f.rating) || 0));
            return sum + rating;
        }, 0) / totalFeedbacksCount
        : 0;

    // Calculate rating distribution
    const ratingDistribution = [0, 0, 0, 0, 0];
    feedbacks.forEach(f => {
        const rating = Math.floor(Number(f.rating));
        if (rating >= 1 && rating <= 5) {
            ratingDistribution[rating - 1]++;
        }
    });

    // Format for radial chart
    const radialChartData = ratingDistribution.map((count, index) => ({
        name: `${index + 1}★`,
        count,
        fill: ["#f87171", "#fb923c", "#facc15", "#4ade80", "#22d3ee"][index]
    }));

    // // For bar chart - use hardcoded visitors but real feedback counts
    // const chartData = {
    //     week: data.week.map((day, index) => {
    //         // Calculate average rating for this day's feedbacks
    //         const dayRatings = feedbacks.slice(index * 10, (index + 1) * 10);
    //         const dayAvgRating = dayRatings.length > 0
    //             ? dayRatings.reduce((sum, f) => sum + (Number(f.rating)) || 0, 0) / dayRatings.length
    //             : 0;

    //         return {
    //             ...day,
    //             feedbacks: dayRatings.length,
    //             avgRating: dayAvgRating
    //         };
    //     }),
    //     month: data.month.map((day, index) => {
    //         // Group feedbacks by "day"
    //         const dayRatings = feedbacks.slice(index * 3, (index + 1) * 3);
    //         const dayAvgRating = dayRatings.length > 0
    //             ? dayRatings.reduce((sum, f) => sum + (Number(f.rating)) || 0, 0) / dayRatings.length
    //             : 0;

    //         return {
    //             ...day,
    //             feedbacks: dayRatings.length,
    //             avgRating: dayAvgRating
    //         };
    //     }),
    //     year: data.year.map((month, index) => {
    //         // Group feedbacks by "month"
    //         const monthRatings = feedbacks.slice(index * 100, (index + 1) * 100);
    //         const monthAvgRating = monthRatings.length > 0
    //             ? monthRatings.reduce((sum, f) => sum + (Number(f.rating)) || 0, 0) / monthRatings.length
    //             : 0;

    //         return {
    //             ...month,
    //             feedbacks: monthRatings.length,
    //             avgRating: monthAvgRating
    //         };
    //     })
    // };

    /// Calculate chart data using real visitor history and feedback tables
    const getChartData = () => {
        if (historyLoading || !visitorHistory.length) {
            return data[view]; // Fallback to sample data
        }

        // Create a map for quick lookup of visitor counts
        const visitorMap = new Map();
        visitorHistory.forEach(item => {
            if (view === 'year') {
                // Use month name as key
                visitorMap.set(item.month || item.date, item.count);
            } else {
                // Use date string as key
                visitorMap.set(item.date, item.count);
            }
        });

        switch (view) {
            case 'week':
                // Create array for last 7 days
                return Array(7).fill(null).map((_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - 6 + i);
                    const dateStr = formatDate(date);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

                    // Get feedback data for this day
                    const dayRatings = feedbacks.slice(i * 10, (i + 1) * 10);
                    const dayAvgRating = dayRatings.length > 0
                        ? dayRatings.reduce((sum, f) => sum + (Number(f.rating) || 0), 0) / dayRatings.length
                        : 0;

                    return {
                        day: dayName,
                        visitors: visitorMap.get(dateStr) || 0,
                        feedbacks: dayRatings.length,
                        avgRating: dayAvgRating
                    };
                });

            case 'month':
                // Create array for last 30 days
                return Array(30).fill(null).map((_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - 29 + i);
                    const dateStr = formatDate(date);
                    const dayNum = date.getDate();

                    // Get feedback data for this day
                    const dayRatings = feedbacks.slice(i * 3, (i + 1) * 3);
                    const dayAvgRating = dayRatings.length > 0
                        ? dayRatings.reduce((sum, f) => sum + (Number(f.rating) || 0), 0) / dayRatings.length
                        : 0;

                    return {
                        day: `Day ${dayNum}`,
                        visitors: visitorMap.get(dateStr) || 0,
                        feedbacks: dayRatings.length,
                        avgRating: dayAvgRating
                    };
                });

            case 'year':
                // Create array for last 12 months
                return Array(12).fill(null).map((_, i) => {
                    const date = new Date();
                    date.setMonth(date.getMonth() - 11 + i);
                    const monthName = date.toLocaleString('default', { month: 'short' });

                    // Get feedback data for this month
                    const monthRatings = feedbacks.slice(i * 100, (i + 1) * 100);
                    const monthAvgRating = monthRatings.length > 0
                        ? monthRatings.reduce((sum, f) => sum + (Number(f.rating) || 0), 0) / monthRatings.length
                        : 0;

                    return {
                        month: monthName,
                        // Use month name to get visitor count
                        visitors: visitorMap.get(monthName) || 0,
                        feedbacks: monthRatings.length,
                        avgRating: monthAvgRating
                    };
                });

            default:
                return data[view];
        }
    };

    // Helper function to format date as YYYY-MM-DD
    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const chartData = getChartData();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-800 dark:border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 fade-in">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Visitors Card - Now using real data */}
                <Card className="bg-white/60 backdrop-blur-lg border border-gray-200 shadow-md rounded-2xl 
                hover:shadow-xl transition-all duration-300 group cursor-pointer">
                    <CardContent className="p-6 flex flex-col justify-center items-center gap-4">
                        <div className="p-3 rounded-full bg-indigo-100 group-hover:bg-indigo-200 transition">
                            <Users className="text-indigo-600" size={28} />
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-500">Total Visitors</p>
                            <p className="text-3xl font-semibold text-gray-800 transition duration-300 
                            group-hover:scale-105">
                                {visitorCount?.toLocaleString() || 'Loading...'}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Feedbacks Card - Using real data */}
                <Card className="bg-white/60 backdrop-blur-lg border border-gray-200 shadow-md rounded-2xl 
                hover:shadow-xl transition-all duration-300 group cursor-pointer">
                    <CardContent className="p-6 flex flex-col justify-center items-center gap-4">
                        <div className="p-3 rounded-full bg-pink-100 group-hover:bg-pink-200 transition">
                            <MessageSquare className="text-pink-600" size={28} />
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-500">Feedback Forms Filled</p>
                            <p className="text-3xl font-semibold text-gray-800 transition duration-300 
                            group-hover:scale-105">
                                {totalFeedbacksCount}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Average Rating Card - Using real data */}
                <Card className="bg-white/60 backdrop-blur-lg border border-gray-200 shadow-md rounded-2xl 
hover:shadow-xl transition-all duration-300 group cursor-pointer">
                    <CardContent className="p-4 h-full flex flex-col sm:flex-row justify-center items-center gap-4">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <div className="text-center sm:text-left">
                                <p className="text-sm text-gray-500">Average Rating</p>
                                <div className="flex items-center justify-center sm:justify-start space-x-2 group-hover:scale-105 transition-all">
                                    <p className="text-3xl font-semibold text-gray-800">
                                        {averageRating.toFixed(1)}
                                    </p>
                                    <Star className="text-yellow-500" fill="currentColor" size={24} />
                                </div>
                            </div>

                            {/* Chart with real data */}
                            <div className="relative w-[100px] h-[100px] group-hover:scale-110 transition-all sm:ml-0 mr-10">
                                <RadialBarChart
                                    width={100}
                                    height={100}
                                    innerRadius="40%"
                                    outerRadius="120%"
                                    data={radialChartData}
                                    startAngle={0}
                                    endAngle={360}
                                >
                                    <PolarAngleAxis type="number" domain={[0, 250]} angleAxisId={0} tick={false} />
                                    <RadialBar background dataKey="count" />
                                    <Legend
                                        iconSize={10}
                                        layout="vertical"
                                        verticalAlign="middle"
                                        wrapperStyle={{
                                            color: "#6b7280",
                                            fontSize: "0.75rem",
                                            right: "-50px",
                                        }}
                                    />
                                </RadialBarChart>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Controls Row: Metric Selector + View Switcher */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
                {/* Metric Selector buttons (left side) */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all cursor-pointer 
                ${showAll
                                ? "bg-green-100 text-green-700 border-green-300 shadow"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                            }`}
                    >
                        Show All
                    </button>
                    {["visitors", "feedbacks", "avgRating"].map(metric => {
                        const isActive = selectedMetric === metric && !showAll;
                        const metricKey = metric as "visitors" | "feedbacks" | "avgRating";

                        // Determine color classes
                        let activeBg = "", activeText = "", activeBorder = "";
                        if (metricKey === "visitors") {
                            activeBg = "bg-indigo-100";
                            activeText = "text-indigo-700";
                            activeBorder = "border-indigo-300";
                        } else if (metricKey === "feedbacks") {
                            activeBg = "bg-pink-100";
                            activeText = "text-pink-700";
                            activeBorder = "border-pink-300";
                        } else if (metricKey === "avgRating") {
                            activeBg = "bg-yellow-100";
                            activeText = "text-yellow-700";
                            activeBorder = "border-yellow-300";
                        }

                        return (
                            <button
                                key={metricKey}
                                onClick={() => {
                                    setSelectedMetric(metricKey);
                                    setShowAll(false);
                                }}
                                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all cursor-pointer
                ${isActive
                                        ? `${activeBg} ${activeText} ${activeBorder} shadow`
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                    }`}
                            >
                                {metricKey === "visitors" && "Visitors"}
                                {metricKey === "feedbacks" && "Feedbacks"}
                                {metricKey === "avgRating" && "Avg Rating"}
                            </button>
                        );
                    })}
                </div>

                {/* View Switcher (right side) */}
                <Tabs defaultValue="week" onValueChange={(v) => setView(v as "week" | "month" | "year")}>
                    <TabsList className="flex justify-center gap-2 bg-white p-1 rounded-xl shadow-inner border border-gray-200">
                        <TabsTrigger
                            value="week"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all 
                    hover:bg-gray-100 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 
                    data-[state=active]:shadow cursor-pointer"
                        >
                            <Users size={16} /> Weekly
                        </TabsTrigger>
                        <TabsTrigger
                            value="month"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all 
                    hover:bg-gray-100 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 
                    data-[state=active]:shadow cursor-pointer"
                        >
                            <CalendarIcon size={16} /> Monthly
                        </TabsTrigger>
                        <TabsTrigger
                            value="year"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all 
                    hover:bg-gray-100 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 
                    data-[state=active]:shadow cursor-pointer"
                        >
                            <BarChart2 size={16} /> Yearly
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Bar Chart with real data */}
            <div className="w-full h-[420px] bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-md 
            hover:shadow-2xl transition-all duration-300">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
                        barGap={6}
                    >
                        <XAxis
                            dataKey={view === "year" ? "month" : "day"}
                            tick={{ fill: "#64748b", fontSize: 12 }}
                            axisLine={{ stroke: "#e5e7eb" }}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fill: "#64748b", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: "0.875rem", color: "#6b7280" }} />

                        {(showAll || selectedMetric === "visitors") && (
                            <Bar
                                dataKey="visitors"
                                fill="url(#colorVisitors)"
                                shape={<AnimatedBar />}
                                name="Visitors"
                            />
                        )}
                        {(showAll || selectedMetric === "feedbacks") && (
                            <Bar
                                dataKey="feedbacks"
                                fill="url(#colorFeedbacks)"
                                shape={<AnimatedBar />}
                                name="Feedbacks"
                            />
                        )}
                        {(showAll || selectedMetric === "avgRating") && (
                            <Bar
                                dataKey="avgRating"
                                fill="url(#colorRating)"
                                shape={<AnimatedBar />}
                                name="Avg Rating"
                            />
                        )}

                        {/* Gradients */}
                        <defs>
                            <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                                <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.95} />
                            </linearGradient>

                            <linearGradient id="colorFeedbacks" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ec4899" stopOpacity={1} />
                                <stop offset="100%" stopColor="#db2777" stopOpacity={0.95} />
                            </linearGradient>

                            <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#facc15" stopOpacity={1} />
                                <stop offset="100%" stopColor="#fde047" stopOpacity={0.9} />
                            </linearGradient>
                        </defs>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard;