import React from "react";
import { Treemap, ResponsiveContainer } from "recharts";

const data = [
    {
        name: "Zone 1 - Arrival Atrium",
        color: "#3b82f6",
        children: [
            { name: "Theatre", size: 300, color: "#facc15" },       // Yellow
            { name: "Visitor Center", size: 200, color: "#34d399" }, // Emerald
            { name: "Reception & Gift Shop", size: 150, color: "#f472b6" }, // Pink
            { name: "Traveling Exhibit Space", size: 250, color: "#a78bfa" }, // Purple
        ],
    },
    {
        name: "Zone 2 - The Mine Experience",
        color: "#f97316",
        children: [
            { name: "Mine Experience", size: 600, color: "#10b981" }, // Teal
            { name: "Assaying", size: 100, color: "#f43f5e" },        // Rose
            { name: "Intro Film", size: 120, color: "#eab308" },      // Gold
        ],
    },
    {
        name: "Zone 3 - Rossland & Area Exhibition",
        color: "#ef4444",
        children: [
            { name: "Community History", size: 500, color: "#3b82f6" }, // Blue
            { name: "Hunter Bros. Store", size: 150, color: "#38bdf8" }, // Sky
            { name: "Natural History", size: 180, color: "#c084fc" },    // Violet
            { name: "Recreation", size: 180, color: "#fb923c" },         // Orange
            { name: "Skiing", size: 200, color: "#22d3ee" },             // Cyan
        ],
    },
    {
        name: "Geology Wing",
        color: "#0ea5e9",
        children: [
            { name: "Geology", size: 120, color: "#f87171" },     // Light Red
            { name: "Cominco / Teck", size: 140, color: "#4ade80" }, // Green
            { name: "WKPL", size: 100, color: "#fcd34d" },          // Amber
            { name: "Kids Zone", size: 90, color: "#a3e635" },      // Lime
        ],
    },
];


const CustomizedContent = (props: any) => {
    const { depth, x, y, width, height, name, index, colors, value, root, color } = props;
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{ fill: color || "#8884d8", stroke: "#fff", strokeWidth: 2 }}
            />
            {width > 60 && height > 30 && (
                <text
                    x={x + width / 2}
                    y={y + height / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={12}
                    fill="#fff"
                >
                    {name}
                </text>
            )}
        </g>
    );
};

const VisitPage = () => {
    return (
        <div className="bg-gray-100 h-full">
            <div className="px-50 pb-50 mb-50 w-full h-screen bg-gray-100">
                <h1 className="pt-40 text-2xl font-bold mb-4">Museum Visit Layout</h1>
                <div className="bg-white shadow rounded-xl p-4 w-full h-[75vh]">
                    <ResponsiveContainer width="100%" height="100%">
                        <Treemap
                            width={730}
                            height={250}
                            data={data}
                            dataKey="size"
                            content={<CustomizedContent />}
                        />
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default VisitPage;