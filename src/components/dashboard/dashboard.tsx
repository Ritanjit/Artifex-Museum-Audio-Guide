import React, { useState } from "react";
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
import useVisitCounter from "../visitorCounter/VisitorCounter";

const data = {
    week: [
        { day: "Mon", visitors: 120, feedbacks: 45, avgRating: 4.2 },
        { day: "Tue", visitors: 160, feedbacks: 60, avgRating: 4.4 },
        { day: "Wed", visitors: 130, feedbacks: 50, avgRating: 4.0 },
        { day: "Thu", visitors: 140, feedbacks: 70, avgRating: 4.5 },
        { day: "Fri", visitors: 180, feedbacks: 90, avgRating: 4.6 },
        { day: "Sat", visitors: 200, feedbacks: 110, avgRating: 4.7 },
        { day: "Sun", visitors: 150, feedbacks: 60, avgRating: 4.3 }
    ],
    month: [...Array(30).keys()].map(i => ({ day: `Day ${i + 1}`, visitors: 100 + i * 3, feedbacks: 50 + i, avgRating: 4 + (i % 5) * 0.1 })),
    year: [
        { month: "Jan", visitors: 3000, feedbacks: 1200, avgRating: 4.3 },
        { month: "Feb", visitors: 2800, feedbacks: 1150, avgRating: 4.1 },
        { month: "Mar", visitors: 3500, feedbacks: 1400, avgRating: 4.4 },
        { month: "Apr", visitors: 3700, feedbacks: 1500, avgRating: 4.5 },
        { month: "May", visitors: 3900, feedbacks: 1600, avgRating: 4.6 },
        { month: "Jun", visitors: 4100, feedbacks: 1700, avgRating: 4.7 },
        { month: "Jul", visitors: 4200, feedbacks: 1750, avgRating: 4.6 },
        { month: "Aug", visitors: 4300, feedbacks: 1800, avgRating: 4.7 },
        { month: "Sep", visitors: 4000, feedbacks: 1650, avgRating: 4.5 },
        { month: "Oct", visitors: 3800, feedbacks: 1600, avgRating: 4.4 },
        { month: "Nov", visitors: 3600, feedbacks: 1500, avgRating: 4.3 },
        { month: "Dec", visitors: 3900, feedbacks: 1700, avgRating: 4.6 }
    ]
};

const ratingBreakdown = [
    { name: "1★", count: 150, fill: "#f87171" },
    { name: "2★", count: 180, fill: "#fb923c" },
    { name: "3★", count: 200, fill: "#facc15" },
    { name: "4★", count: 230, fill: "#4ade80" },
    { name: "5★", count: 210, fill: "#22d3ee" }
];

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

const Dashboard = () => {

    const visits = useVisitCounter();
    const [view, setView] = useState("week");

    const totalVisitors = data[view].reduce((sum, d) => sum + d.visitors, 0);
    const totalFeedbacks = data[view].reduce((sum, d) => sum + d.feedbacks, 0);
    const avgRating =
        data[view].reduce((sum, d) => sum + d.avgRating * d.feedbacks, 0) /
        data[view].reduce((sum, d) => sum + d.feedbacks, 0);

    const [selectedMetric, setSelectedMetric] = useState("visitors");

    const [showAll, setShowAll] = useState(true);

    return (
        <div className="p-6 space-y-6 fade-in">

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Visitors Card */}
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
                                {/* {totalVisitors} */}
                                {visits !== null ? visits.toLocaleString() : "Loading..."}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Feedbacks Card */}
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
                                {totalFeedbacks}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/60 backdrop-blur-lg border border-gray-200 shadow-md rounded-2xl 
                hover:shadow-xl transition-all duration-300 group cursor-pointer">
                    <CardContent className="p-4 mt-5 ml-15 flex items-center gap-4 relative">
                        <div className="flex flex-col justify-center">
                            <p className="text-sm text-gray-500">Average Rating</p>
                            <div className="flex items-center space-x-2 group-hover:scale-105 transition-all">
                                <p className="text-3xl font-semibold text-gray-800">
                                    {avgRating.toFixed(1)}
                                </p>
                                <Star className="text-yellow-500" fill="currentColor" size={24} />
                            </div>
                        </div>

                        {/* Chart + Hover Legend Wrapper */}
                        <div className="relative w-[100px] h-[100px] group-hover:scale-110 transition-all">
                            <RadialBarChart
                                width={100}
                                height={100}
                                innerRadius="50%"
                                outerRadius="100%"
                                data={ratingBreakdown}
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

                        // Determine color classes
                        let activeBg = "", activeText = "", activeBorder = "";
                        if (metric === "visitors") {
                            activeBg = "bg-indigo-100";
                            activeText = "text-indigo-700";
                            activeBorder = "border-indigo-300";
                        } else if (metric === "feedbacks") {
                            activeBg = "bg-pink-100";
                            activeText = "text-pink-700";
                            activeBorder = "border-pink-300";
                        } else if (metric === "avgRating") {
                            activeBg = "bg-yellow-100";
                            activeText = "text-yellow-700";
                            activeBorder = "border-yellow-300";
                        }

                        return (
                            <button
                                key={metric}
                                onClick={() => {
                                    setSelectedMetric(metric);
                                    setShowAll(false);
                                }}
                                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all cursor-pointer
                ${isActive
                                        ? `${activeBg} ${activeText} ${activeBorder} shadow`
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                    }`}
                            >
                                {metric === "visitors" && "Visitors"}
                                {metric === "feedbacks" && "Feedbacks"}
                                {metric === "avgRating" && "Avg Rating"}
                            </button>
                        );
                    })}
                </div>

                {/* View Switcher (right side) */}
                <Tabs defaultValue="week" onValueChange={setView}>
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

            {/* Bar Chart */}
            <div className="w-full h-[420px] bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-md 
            hover:shadow-2xl transition-all duration-300">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data[view]}
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
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #e5e7eb",
                                borderRadius: "0.5rem",
                                fontSize: "0.875rem",
                                color: "#374151",
                            }}
                        />
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
                                dataKey={(entry) => entry.avgRating * 20}
                                fill="url(#colorRating)"
                                shape={<AnimatedBar />}
                                name="Avg Rating (x20)"
                            />
                        )}

                        {/* Gradients */}
                        <defs>
                            <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />   {/* Strong Indigo */}
                                <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.95} /> {/* Deep Indigo */}
                            </linearGradient>

                            <linearGradient id="colorFeedbacks" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ec4899" stopOpacity={1} />   {/* Bold Pink */}
                                <stop offset="100%" stopColor="#db2777" stopOpacity={0.95} /> {/* Rich Fuchsia */}
                            </linearGradient>

                            <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#facc15" stopOpacity={1} />   {/* Bright Yellow */}
                                <stop offset="100%" stopColor="#fde047" stopOpacity={0.9} /> {/* Soft Lemon */}
                            </linearGradient>


                        </defs>
                    </BarChart>
                </ResponsiveContainer>
            </div>

        </div >
    );
};

export default Dashboard;


// import React, { useState } from "react";
// import {
//     BarChart,
//     Bar,
//     XAxis,
//     YAxis,
//     Tooltip,
//     Legend,
//     ResponsiveContainer,
//     RadialBarChart,
//     RadialBar,
//     PolarAngleAxis
// } from "recharts";
// import { Card, CardContent } from "../ui/card";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Star, Users, MessageSquare, BarChart2, CalendarIcon } from "lucide-react";
// import useVisitCounter from "@/lib/hooks/visitCounter";

// const data = {
//     week: [
//         { day: "Mon", visitors: 120, feedbacks: 45, avgRating: 4.2 },
//         { day: "Tue", visitors: 160, feedbacks: 60, avgRating: 4.4 },
//         { day: "Wed", visitors: 130, feedbacks: 50, avgRating: 4.0 },
//         { day: "Thu", visitors: 140, feedbacks: 70, avgRating: 4.5 },
//         { day: "Fri", visitors: 180, feedbacks: 90, avgRating: 4.6 },
//         { day: "Sat", visitors: 200, feedbacks: 110, avgRating: 4.7 },
//         { day: "Sun", visitors: 150, feedbacks: 60, avgRating: 4.3 }
//     ],
//     month: [...Array(30).keys()].map(i => ({ day: `Day ${i + 1}`, visitors: 100 + i * 3, feedbacks: 50 + i, avgRating: 4 + (i % 5) * 0.1 })),
//     year: [
//         { month: "Jan", visitors: 3000, feedbacks: 1200, avgRating: 4.3 },
//         { month: "Feb", visitors: 2800, feedbacks: 1150, avgRating: 4.1 },
//         { month: "Mar", visitors: 3500, feedbacks: 1400, avgRating: 4.4 },
//         { month: "Apr", visitors: 3700, feedbacks: 1500, avgRating: 4.5 },
//         { month: "May", visitors: 3900, feedbacks: 1600, avgRating: 4.6 },
//         { month: "Jun", visitors: 4100, feedbacks: 1700, avgRating: 4.7 },
//         { month: "Jul", visitors: 4200, feedbacks: 1750, avgRating: 4.6 },
//         { month: "Aug", visitors: 4300, feedbacks: 1800, avgRating: 4.7 },
//         { month: "Sep", visitors: 4000, feedbacks: 1650, avgRating: 4.5 },
//         { month: "Oct", visitors: 3800, feedbacks: 1600, avgRating: 4.4 },
//         { month: "Nov", visitors: 3600, feedbacks: 1500, avgRating: 4.3 },
//         { month: "Dec", visitors: 3900, feedbacks: 1700, avgRating: 4.6 }
//     ]
// };

// const ratingBreakdown = [
//     { name: "1★", count: 150, fill: "#f87171" },
//     { name: "2★", count: 180, fill: "#fb923c" },
//     { name: "3★", count: 200, fill: "#facc15" },
//     { name: "4★", count: 230, fill: "#4ade80" },
//     { name: "5★", count: 210, fill: "#22d3ee" }
// ];

// // Custom Bar component with hover effect
// const AnimatedBar = (props: any) => {
//     const { fill, x, y, width, height } = props;
//     return (
//         <g>
//             <rect
//                 x={x}
//                 y={y}
//                 width={width}
//                 height={height}
//                 rx={8}
//                 ry={8}
//                 fill={fill}
//                 style={{
//                     transition: "all 0.3s ease",
//                 }}
//                 className="group hover:scale-[1.06] hover:drop-shadow-md transform origin-bottom"
//             />
//         </g>
//     );
// };

// const Dashboard = () => {

//     const visits = useVisitCounter();
//     const [view, setView] = useState("week");

//     const totalVisitors = data[view].reduce((sum, d) => sum + d.visitors, 0);
//     const totalFeedbacks = data[view].reduce((sum, d) => sum + d.feedbacks, 0);
//     const avgRating =
//         data[view].reduce((sum, d) => sum + d.avgRating * d.feedbacks, 0) /
//         data[view].reduce((sum, d) => sum + d.feedbacks, 0);

//     return (
//         <div className="p-6 space-y-6">

//             {/* Stat Cards */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {/* Visitors Card */}
//                 <Card className="bg-white/60 backdrop-blur-lg border border-gray-200 shadow-md rounded-2xl
//                 hover:shadow-xl transition-all duration-300 group cursor-pointer">
//                     <CardContent className="p-6 flex flex-col justify-center items-center gap-4">
//                         <div className="p-3 rounded-full bg-indigo-100 group-hover:bg-indigo-200 transition">
//                             <Users className="text-indigo-600" size={28} />
//                         </div>
//                         <div className="text-center">
//                             <p className="text-sm text-gray-500">Total Visitors</p>
//                             <p className="text-3xl font-semibold text-gray-800 transition duration-300
//                             group-hover:scale-105">
//                                 {/* {totalVisitors} */}
//                                 {visits !== null ? visits.toLocaleString() : "Loading..."}
//                             </p>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 {/* Feedbacks Card */}
//                 <Card className="bg-white/60 backdrop-blur-lg border border-gray-200 shadow-md rounded-2xl
//                 hover:shadow-xl transition-all duration-300 group cursor-pointer">
//                     <CardContent className="p-6 flex flex-col justify-center items-center gap-4">
//                         <div className="p-3 rounded-full bg-pink-100 group-hover:bg-pink-200 transition">
//                             <MessageSquare className="text-pink-600" size={28} />
//                         </div>
//                         <div className="text-center">
//                             <p className="text-sm text-gray-500">Feedback Forms Filled</p>
//                             <p className="text-3xl font-semibold text-gray-800 transition duration-300
//                             group-hover:scale-105">
//                                 {totalFeedbacks}
//                             </p>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 <Card className="bg-white/60 backdrop-blur-lg border border-gray-200 shadow-md rounded-2xl
//                 hover:shadow-xl transition-all duration-300 group cursor-pointer">
//                     <CardContent className="p-4 mt-5 ml-15 flex items-center gap-4 relative">
//                         <div className="flex flex-col justify-center">
//                             <p className="text-sm text-gray-500">Average Rating</p>
//                             <div className="flex items-center space-x-2 group-hover:scale-105 transition-all">
//                                 <p className="text-3xl font-semibold text-gray-800">
//                                     {avgRating.toFixed(1)}
//                                 </p>
//                                 <Star className="text-yellow-500" fill="currentColor" size={24} />
//                             </div>
//                         </div>

//                         {/* Chart + Hover Legend Wrapper */}
//                         <div className="relative w-[100px] h-[100px] group-hover:scale-110 transition-all">
//                             <RadialBarChart
//                                 width={100}
//                                 height={100}
//                                 innerRadius="50%"
//                                 outerRadius="100%"
//                                 data={ratingBreakdown}
//                                 startAngle={0}
//                                 endAngle={360}
//                             >
//                                 <PolarAngleAxis type="number" domain={[0, 250]} angleAxisId={0} tick={false} />
//                                 <RadialBar background dataKey="count" />
//                                 <Legend
//                                     iconSize={10}
//                                     layout="vertical"
//                                     verticalAlign="middle"
//                                     wrapperStyle={{
//                                         color: "#6b7280",
//                                         fontSize: "0.75rem",
//                                         right: "-50px",
//                                     }}
//                                 />
//                             </RadialBarChart>
//                         </div>
//                     </CardContent>
//                 </Card>

//             </div>



//             {/* View Switcher */}
//             <Tabs defaultValue="week" onValueChange={setView}>
//                 <TabsList className="flex justify-center gap-2 bg-white p-1 rounded-xl shadow-inner border border-gray-200">
//                     <TabsTrigger
//                         value="week"
//                         className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all
//                         hover:bg-gray-100 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700
//                         data-[state=active]:shadow cursor-pointer"
//                     >
//                         <Users size={16} /> Weekly
//                     </TabsTrigger>
//                     <TabsTrigger
//                         value="month"
//                         className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all
//                         hover:bg-gray-100 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700
//                         data-[state=active]:shadow cursor-pointer"
//                     >
//                         <CalendarIcon size={16} /> Monthly
//                     </TabsTrigger>
//                     <TabsTrigger
//                         value="year"
//                         className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all
//                         hover:bg-gray-100 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700
//                         data-[state=active]:shadow cursor-pointer"
//                     >
//                         <BarChart2 size={16} /> Yearly
//                     </TabsTrigger>
//                 </TabsList>
//             </Tabs>


//             {/* Bar Chart */}
//             <div className="w-full h-[420px] bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-md
//             hover:shadow-2xl transition-all duration-300">
//                 <ResponsiveContainer width="100%" height="100%">
//                     <BarChart
//                         data={data[view]}
//                         margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
//                         barGap={6}
//                     >
//                         <XAxis
//                             dataKey={view === "year" ? "month" : "day"}
//                             tick={{ fill: "#64748b", fontSize: 12 }}
//                             axisLine={{ stroke: "#e5e7eb" }}
//                             tickLine={false}
//                         />
//                         <YAxis
//                             tick={{ fill: "#64748b", fontSize: 12 }}
//                             axisLine={false}
//                             tickLine={false}
//                         />
//                         <Tooltip
//                             contentStyle={{
//                                 backgroundColor: "white",
//                                 border: "1px solid #e5e7eb",
//                                 borderRadius: "0.5rem",
//                                 fontSize: "0.875rem",
//                                 color: "#374151",
//                             }}
//                         />
//                         <Legend wrapperStyle={{ fontSize: "0.875rem", color: "#6b7280" }} />

//                         <Bar
//                             dataKey="visitors"
//                             stackId="a"
//                             fill="url(#colorVisitors)"
//                             shape={<AnimatedBar />}
//                             name="Visitors"
//                         />
//                         <Bar
//                             dataKey="feedbacks"
//                             stackId="a"
//                             fill="url(#colorFeedbacks)"
//                             shape={<AnimatedBar />}
//                             name="Feedbacks"
//                         />
//                         <Bar
//                             dataKey={(entry) => entry.avgRating * 20}
//                             stackId="a"
//                             fill="url(#colorRating)"
//                             shape={<AnimatedBar />}
//                             name="Avg Rating (x20)"
//                         />

//                         {/* Gradients */}
//                         <defs>
//                             <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
//                                 <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />   {/* Strong Indigo */}
//                                 <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.95} /> {/* Deep Indigo */}
//                             </linearGradient>

//                             <linearGradient id="colorFeedbacks" x1="0" y1="0" x2="0" y2="1">
//                                 <stop offset="0%" stopColor="#ec4899" stopOpacity={1} />   {/* Bold Pink */}
//                                 <stop offset="100%" stopColor="#db2777" stopOpacity={0.95} /> {/* Rich Fuchsia */}
//                             </linearGradient>

//                             <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
//                                 <stop offset="0%" stopColor="#facc15" stopOpacity={1} />   {/* Bright Yellow */}
//                                 <stop offset="100%" stopColor="#fde047" stopOpacity={0.9} /> {/* Soft Lemon */}
//                             </linearGradient>


//                         </defs>
//                     </BarChart>
//                 </ResponsiveContainer>
//             </div>

//         </div >
//     );
// };

// export default Dashboard;
