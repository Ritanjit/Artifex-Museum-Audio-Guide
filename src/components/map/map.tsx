import React, { useState, useRef, useEffect } from 'react';
import {
    MapPin,
    Info,
    Clock,
    Users,
    Star,
    Navigation,
    Volume2,
    Eye,
    Headphones,
    GalleryHorizontalEnd,
    GalleryVerticalEnd,
    Search,
    Globe
} from 'lucide-react';

interface GalleryInfo {
    id: string;
    name: string;
    description: string;
    highlights: string[];
    estimatedTime: number;
    currentVisitors: number;
    rating: number;
    audioGuideAvailable: boolean;
    accessibility: boolean;
    category: 'ancient' | 'contemporary' | 'sculpture' | 'cultural' | 'temporary';
    color: string;
    artworkCount: number;
    markerPosition: { x: number; y: number };
    virtualTourUrl: string;
}

interface Facility {
    id: string;
    name: string;
    icon: React.ReactNode;
    position: { x: number; y: number };
    type: 'amenity' | 'service' | 'accessibility';
}

const InteractiveMuseumMap: React.FC = () => {
    const [selectedGallery, setSelectedGallery] = useState<string | null>(null);
    const [hoveredGallery, setHoveredGallery] = useState<string | null>(null);
    const [showFacilities, setShowFacilities] = useState(true);
    const [userLocation, setUserLocation] = useState<{ x: number; y: number } | null>(null);
    const [audioPlaying, setAudioPlaying] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showVirtualTour, setShowVirtualTour] = useState(false);
    const mapRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const galleries: GalleryInfo[] = [
        {
            id: 'ancient-artifacts',
            name: 'Ancient Artifacts Gallery',
            description: 'Discover millennia-old treasures showcasing the rich heritage of ancient civilizations. This gallery features artifacts from Mesopotamia, Egypt, and early Mediterranean cultures.',
            highlights: ['Mesopotamian tablets', 'Egyptian sarcophagi', 'Ancient pottery collection', 'Roman mosaics'],
            estimatedTime: 45,
            currentVisitors: 12,
            rating: 4.8,
            audioGuideAvailable: true,
            accessibility: true,
            category: 'ancient',
            color: '#8B4513',
            artworkCount: 127,
            markerPosition: { x: 255, y: 150 },
            virtualTourUrl: 'https://example.com/virtual-tours/ancient-artifacts'
        },
        {
            id: 'contemporary-art',
            name: 'Contemporary Art Wing',
            description: 'Experience cutting-edge contemporary works from local and international artists. This wing features rotating exhibitions of modern art, digital installations, and experimental media.',
            highlights: ['Digital light installations', 'Interactive sculptures', 'Modern paintings', 'Video art projections'],
            estimatedTime: 60,
            currentVisitors: 8,
            rating: 4.6,
            audioGuideAvailable: true,
            accessibility: true,
            category: 'contemporary',
            color: '#FF6B6B',
            artworkCount: 89,
            markerPosition: { x: 745, y: 150 },
            virtualTourUrl: 'https://example.com/virtual-tours/contemporary-art'
        },
        {
            id: 'sculpture-garden',
            name: 'Sculpture Garden',
            description: 'An indoor sculpture gallery featuring masterpieces from renowned sculptors. The garden-like setting provides a serene environment to appreciate three-dimensional art.',
            highlights: ['Classical marble sculptures', 'Bronze figurines', 'Modern kinetic installations', 'Glass art pieces'],
            estimatedTime: 35,
            currentVisitors: 15,
            rating: 4.9,
            audioGuideAvailable: true,
            accessibility: false,
            category: 'sculpture',
            color: '#4ECDC4',
            artworkCount: 52,
            markerPosition: { x: 500, y: 475 },
            virtualTourUrl: 'https://example.com/virtual-tours/sculpture-garden'
        },
        {
            id: 'cultural-heritage',
            name: 'Cultural Heritage Hall',
            description: 'Immerse yourself in the diverse cultural traditions and customs of the region. This hall showcases traditional crafts, ceremonial objects, and historical artifacts.',
            highlights: ['Traditional costumes', 'Folk art displays', 'Cultural ceremonies', 'Historical documents'],
            estimatedTime: 40,
            currentVisitors: 20,
            rating: 4.7,
            audioGuideAvailable: true,
            accessibility: true,
            category: 'cultural',
            color: '#FFD93D',
            artworkCount: 156,
            markerPosition: { x: 255, y: 675 },
            virtualTourUrl: 'https://example.com/virtual-tours/cultural-heritage'
        },
        {
            id: 'temporary-exhibitions',
            name: 'Temporary Exhibitions',
            description: 'Rotating exhibitions featuring special collections and guest artists. Currently showcasing "Photography Through the Ages" - a journey from early daguerreotypes to digital photography.',
            highlights: ['Vintage photography', 'Visiting artist works', 'Limited-time displays', 'Historical cameras'],
            estimatedTime: 30,
            currentVisitors: 6,
            rating: 4.5,
            audioGuideAvailable: false,
            accessibility: true,
            category: 'temporary',
            color: '#A8E6CF',
            artworkCount: 34,
            markerPosition: { x: 745, y: 675 },
            virtualTourUrl: 'https://example.com/virtual-tours/temporary-exhibitions'
        }
    ];

    const facilities: Facility[] = [
        { id: 'cafe', name: 'Museum Café', icon: <GalleryHorizontalEnd className="w-4 h-4" />, position: { x: 85, y: 85 }, type: 'amenity' },
        { id: 'giftshop', name: 'Gift Shop', icon: <GalleryVerticalEnd className="w-4 h-4" />, position: { x: 15, y: 85 }, type: 'service' },
        { id: 'infodesk', name: 'Information Desk', icon: <Info className="w-4 h-4" />, position: { x: 50, y: 15 }, type: 'service' },
        { id: 'accessibility', name: 'Accessibility Services', icon: <Headphones className="w-4 h-4" />, position: { x: 50, y: 50 }, type: 'accessibility' }
    ];

    const handleGalleryClick = (galleryId: string) => {
        const gallery = galleries.find(g => g.id === galleryId);
        if (gallery) {
            setSelectedGallery(galleryId);
            setUserLocation(gallery.markerPosition);
        }
    };

    const handleAudioToggle = (galleryId: string) => {
        if (audioPlaying === galleryId) {
            setAudioPlaying(null);
        } else {
            setAudioPlaying(galleryId);
            // In a real app, this would start playing the audio guide
            console.log(`Starting audio guide for gallery: ${galleryId}`);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        if (e.target.value) {
            const foundGallery = galleries.find(g =>
                g.name.toLowerCase().includes(e.target.value.toLowerCase())
            );
            if (foundGallery) {
                setSelectedGallery(foundGallery.id);
                setUserLocation(foundGallery.markerPosition);
            }
        }
    };

    const filteredGalleries = galleries.filter(gallery =>
        gallery.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedGalleryInfo = galleries.find(g => g.id === selectedGallery);

    return (
        <div className="w-full max-w-screen mx-auto bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] dark:from-amber-600 dark:to-amber-700 p-6 text-white pt-35 px-20">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Interactive Museum Map</h2>
                            <p className="text-white/80 text-sm">Explore our galleries and facilities</p>
                        </div>
                    </div>

                    <div className="w-full md:w-auto">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search galleries..."
                                className="w-full md:w-164 pl-10 pr-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* <button
                            onClick={() => setShowVirtualTour(!showVirtualTour)}
                            className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${showVirtualTour ? 'bg-amber-500' : 'bg-white/20 hover:bg-white/30'}`}
                        >
                            <Globe className="w-4 h-4" />
                            {showVirtualTour ? 'Exit Virtual Tour' : 'Virtual Tour'}
                        </button> */}
                        <button
                            onClick={() => setShowFacilities(!showFacilities)}
                            className={`px-4 py-2 rounded-lg text-sm transition-colors ${showFacilities ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'}`}
                        >
                            Facilities
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row h-full">
                {/* Map Area */}
                <div className="flex-1 relative bg-gray-50 dark:bg-gray-800" ref={mapRef}>
                    <svg
                        ref={svgRef}
                        viewBox="0 0 1000 800"
                        className="w-full max-h-[600px] min-h-[500px]"
                    >
                        {/* Museum Building Outline - More organic shape */}
                        <path
                            d="M 50,50 
                             C 50,150 50,250 100,300 
                             L 100,500 
                             C 50,550 50,650 100,700 
                             L 900,700 
                             C 950,650 950,550 900,500 
                             L 900,300 
                             C 950,250 950,150 900,50 
                             Z"
                            fill="none"
                            stroke="#374151"
                            strokeWidth="3"
                        />

                        {/* Entrance - Curved design */}
                        <path
                            d="M 450,45 
                             C 475,35 525,35 550,45"
                            stroke="#7f1d1d"
                            strokeWidth="8"
                            fill="none"
                        />
                        <text x="500" y="35" textAnchor="middle" className="fill-gray-700 dark:fill-gray-300 text-sm font-semibold">
                            MAIN ENTRANCE
                        </text>

                        {/* Central Atrium */}
                        <circle
                            cx="500"
                            cy="400"
                            r="150"
                            fill="#F3F4F6"
                            stroke="#D1D5DB"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                            className="dark:fill-gray-700"
                        />
                        <text x="500" y="400" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400 text-lg font-bold">
                            Central Atrium
                        </text>

                        {/* Gallery Areas - More organic shapes */}

                        {/* Ancient Artifacts Gallery - Top Left */}
                        <g>
                            <path
                                d="M 80,80 
                                 C 150,70 250,60 300,100 
                                 L 300,300 
                                 C 250,320 150,310 80,280 
                                 Z"
                                fill={hoveredGallery === 'ancient-artifacts' || selectedGallery === 'ancient-artifacts' ? '#8B4513' : '#D2B48C'}
                                stroke="#8B4513"
                                strokeWidth="2"
                                className="cursor-pointer transition-all duration-300"
                                onMouseEnter={() => setHoveredGallery('ancient-artifacts')}
                                onMouseLeave={() => setHoveredGallery(null)}
                                onClick={() => handleGalleryClick('ancient-artifacts')}
                            />
                            <text x="190" y="180" textAnchor="middle" className="fill-white text-lg font-bold pointer-events-none">
                                Ancient Artifacts
                            </text>
                            <text x="190" y="200" textAnchor="middle" className="fill-white text-sm pointer-events-none">
                                Gallery 1
                            </text>
                        </g>

                        {/* Contemporary Art Wing - Top Right */}
                        <g>
                            <path
                                d="M 920,80 
                                 C 850,70 750,60 700,100 
                                 L 700,300 
                                 C 750,320 850,310 920,280 
                                 Z"
                                fill={hoveredGallery === 'contemporary-art' || selectedGallery === 'contemporary-art' ? '#FF6B6B' : '#FFB3B3'}
                                stroke="#FF6B6B"
                                strokeWidth="2"
                                className="cursor-pointer transition-all duration-300"
                                onMouseEnter={() => setHoveredGallery('contemporary-art')}
                                onMouseLeave={() => setHoveredGallery(null)}
                                onClick={() => handleGalleryClick('contemporary-art')}
                            />
                            <text x="810" y="180" textAnchor="middle" className="fill-white text-lg font-bold pointer-events-none">
                                Contemporary Art
                            </text>
                            <text x="810" y="200" textAnchor="middle" className="fill-white text-sm pointer-events-none">
                                Gallery 2
                            </text>
                        </g>

                        {/* Sculpture Garden - Center */}
                        <g>
                            <rect
                                x="350"
                                y="350"
                                width="300"
                                height="200"
                                rx="20"
                                fill={hoveredGallery === 'sculpture-garden' || selectedGallery === 'sculpture-garden' ? '#4ECDC4' : '#A8E6CF'}
                                stroke="#4ECDC4"
                                strokeWidth="2"
                                className="cursor-pointer transition-all duration-300"
                                onMouseEnter={() => setHoveredGallery('sculpture-garden')}
                                onMouseLeave={() => setHoveredGallery(null)}
                                onClick={() => handleGalleryClick('sculpture-garden')}
                            />
                            <text x="500" y="450" textAnchor="middle" className="fill-white text-lg font-bold pointer-events-none">
                                Sculpture Garden
                            </text>
                            <text x="500" y="470" textAnchor="middle" className="fill-white text-sm pointer-events-none">
                                Gallery 3
                            </text>
                        </g>

                        {/* Cultural Heritage Hall - Bottom Left */}
                        <g>
                            <path
                                d="M 80,520 
                                 C 150,550 250,560 300,520 
                                 L 300,720 
                                 C 250,740 150,730 80,700 
                                 Z"
                                fill={hoveredGallery === 'cultural-heritage' || selectedGallery === 'cultural-heritage' ? '#FFD93D' : '#FFF176'}
                                stroke="#FFD93D"
                                strokeWidth="2"
                                className="cursor-pointer transition-all duration-300"
                                onMouseEnter={() => setHoveredGallery('cultural-heritage')}
                                onMouseLeave={() => setHoveredGallery(null)}
                                onClick={() => handleGalleryClick('cultural-heritage')}
                            />
                            <text x="190" y="620" textAnchor="middle" className="fill-gray-800 text-lg font-bold pointer-events-none">
                                Cultural Heritage
                            </text>
                            <text x="190" y="640" textAnchor="middle" className="fill-gray-800 text-sm pointer-events-none">
                                Gallery 4
                            </text>
                        </g>

                        {/* Temporary Exhibitions - Bottom Right */}
                        <g>
                            <path
                                d="M 920,520 
                                 C 850,550 750,560 700,520 
                                 L 700,720 
                                 C 750,740 850,730 920,700 
                                 Z"
                                fill={hoveredGallery === 'temporary-exhibitions' || selectedGallery === 'temporary-exhibitions' ? '#A8E6CF' : '#C8F7C5'}
                                stroke="#A8E6CF"
                                strokeWidth="2"
                                className="cursor-pointer transition-all duration-300"
                                onMouseEnter={() => setHoveredGallery('temporary-exhibitions')}
                                onMouseLeave={() => setHoveredGallery(null)}
                                onClick={() => handleGalleryClick('temporary-exhibitions')}
                            />
                            <text x="810" y="620" textAnchor="middle" className="fill-gray-800 text-lg font-bold pointer-events-none">
                                Temporary Exhibitions
                            </text>
                            <text x="810" y="640" textAnchor="middle" className="fill-gray-800 text-sm pointer-events-none">
                                Gallery 5
                            </text>
                        </g>

                        {/* Pathways - More organic curves */}
                        <path
                            d="M 500,50 
                             Q 500,200 500,300 
                             C 500,350 500,450 500,500"
                            stroke="#D1D5DB"
                            strokeWidth="4"
                            strokeDasharray="8,4"
                            fill="none"
                        />

                        <path
                            d="M 500,500 
                             Q 300,480 250,400 
                             Q 200,320 180,250"
                            stroke="#D1D5DB"
                            strokeWidth="4"
                            strokeDasharray="8,4"
                            fill="none"
                        />

                        <path
                            d="M 500,500 
                             Q 700,480 750,400 
                             Q 800,320 820,250"
                            stroke="#D1D5DB"
                            strokeWidth="4"
                            strokeDasharray="8,4"
                            fill="none"
                        />

                        <path
                            d="M 500,500 
                             Q 300,520 250,600 
                             Q 200,680 180,750"
                            stroke="#D1D5DB"
                            strokeWidth="4"
                            strokeDasharray="8,4"
                            fill="none"
                        />

                        <path
                            d="M 500,500 
                             Q 700,520 750,600 
                             Q 800,680 820,750"
                            stroke="#D1D5DB"
                            strokeWidth="4"
                            strokeDasharray="8,4"
                            fill="none"
                        />

                        {/* Facilities */}
                        {showFacilities && facilities.map((facility) => (
                            <g key={facility.id}>
                                <circle
                                    cx={facility.position.x * 10}
                                    cy={facility.position.y * 10}
                                    r="18"
                                    fill="#7f1d1d"
                                    stroke="white"
                                    strokeWidth="2"
                                    className="cursor-pointer hover:opacity-90 transition-opacity"
                                />
                                <foreignObject
                                    x={facility.position.x * 10 - 10}
                                    y={facility.position.y * 10 - 10}
                                    width="20"
                                    height="20"
                                    className="pointer-events-none"
                                >
                                    <div className="flex items-center justify-center w-full h-full text-white">
                                        {facility.icon}
                                    </div>
                                </foreignObject>
                                <text
                                    x={facility.position.x * 10}
                                    y={facility.position.y * 10 + 30}
                                    textAnchor="middle"
                                    className="fill-gray-700 dark:fill-gray-300 text-xs font-semibold"
                                >
                                    {facility.name}
                                </text>
                            </g>
                        ))}

                        {/* User Location */}
                        {userLocation && (
                            <g>
                                <circle
                                    cx={userLocation.x}
                                    cy={userLocation.y}
                                    r="10"
                                    fill="#10B981"
                                    stroke="white"
                                    strokeWidth="3"
                                    className="animate-pulse"
                                />
                                <text
                                    x={userLocation.x}
                                    y={userLocation.y - 20}
                                    textAnchor="middle"
                                    className="fill-gray-700 dark:fill-gray-300 text-xs font-semibold"
                                >
                                    You are here
                                </text>
                            </g>
                        )}
                    </svg>

                    {/* Legend */}
                    <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-600">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Legend</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                <span className="text-gray-700 dark:text-gray-300">Your Location</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-[#7f1d1d] rounded-full"></div>
                                <span className="text-gray-700 dark:text-gray-300">Facilities</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-gray-400 bg-gray-200 rounded"></div>
                                <span className="text-gray-700 dark:text-gray-300">Gallery Spaces</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Panel */}
                <div className="w-full lg:w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 p-6 overflow-y-auto max-h-[600px]">
                    {selectedGalleryInfo ? (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {selectedGalleryInfo.name}
                                </h3>
                                <button
                                    onClick={() => setSelectedGallery(null)}
                                    className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <p className="text-gray-600 dark:text-gray-300">
                                    {selectedGalleryInfo.description}
                                </p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Clock className="w-4 h-4 text-[#7f1d1d] dark:text-amber-500" />
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Duration</span>
                                        </div>
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {selectedGalleryInfo.estimatedTime} min
                                        </span>
                                    </div>

                                    {/* <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Users className="w-4 h-4 text-[#7f1d1d] dark:text-amber-500" />
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Visitors</span>
                                        </div>
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {selectedGalleryInfo.currentVisitors}
                                        </span>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Star className="w-4 h-4 text-[#7f1d1d] dark:text-amber-500" />
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Rating</span>
                                        </div>
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {selectedGalleryInfo.rating}/5
                                        </span>
                                    </div> */}

                                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Eye className="w-4 h-4 text-[#7f1d1d] dark:text-amber-500" />
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Artworks</span>
                                        </div>
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {selectedGalleryInfo.artworkCount}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Featured Highlights</h4>
                                    <ul className="space-y-1">
                                        {selectedGalleryInfo.highlights.map((highlight, index) => (
                                            <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                <span className="text-[#7f1d1d] dark:text-amber-500 mt-1">•</span>
                                                {highlight}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    {selectedGalleryInfo.audioGuideAvailable && (
                                        <span className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded">
                                            <Headphones className="w-3 h-3" />
                                            Audio Guide
                                        </span>
                                    )}
                                    {selectedGalleryInfo.accessibility && (
                                        <span className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                            </svg>
                                            Accessible
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    {selectedGalleryInfo.audioGuideAvailable && (
                                        <button
                                            onClick={() => handleAudioToggle(selectedGalleryInfo.id)}
                                            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${audioPlaying === selectedGalleryInfo.id
                                                ? 'bg-green-600 text-white'
                                                : 'bg-[#7f1d1d] dark:bg-amber-600 text-white hover:bg-[#991b1b] dark:hover:bg-amber-700'
                                                }`}
                                        >
                                            {audioPlaying === selectedGalleryInfo.id ? (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    Stop Audio Guide
                                                </>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                    </svg>
                                                    Start Audio Guide
                                                </>
                                            )}
                                        </button>
                                    )}

                                    {/* Waveform Visualization */}
                                    {/* <div className="flex items-center justify-center gap-0.5 h-8 opacity-80">
                                        {Array.from({ length: 40 }, (_, i) => {
                                            const isActive = i < (currentTime / (duration || 100)) * 40;
                                            return (
                                                <div
                                                    key={i}
                                                    className={`w-0.5 rounded-full transition-all duration-300 ${isActive
                                                        ? 'bg-gradient-to-t from-red-800 to-amber-600 dark:from-amber-500 dark:to-amber-300'
                                                        : 'bg-stone-950 dark:bg-zinc-500 opacity-30'
                                                        }`}
                                                    style={{
                                                        height: `${Math.random() * 16 + 4}px`,
                                                        animationDelay: `${i * 30}ms`
                                                    }}
                                                />
                                            );
                                        })}
                                    </div> */}

                                    {/* <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                        <Navigation className="w-4 h-4" />
                                        Get Directions
                                    </button> */}

                                    {/* {showVirtualTour && (
                                        <a
                                            href={selectedGalleryInfo.virtualTourUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                        >
                                            <Globe className="w-4 h-4" />
                                            Start Virtual Tour
                                        </a>
                                    )} */}

                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <MapPin className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Explore the Museum
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                {showVirtualTour
                                    ? "Click on any gallery to start a virtual tour experience"
                                    : "Click on any gallery to learn more about it and start your audio guide"}
                            </p>

                            <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900 dark:text-white text-left">Museum Overview</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                        <div className="text-2xl font-bold text-[#7f1d1d] dark:text-amber-500">5</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Galleries</div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                        <div className="text-2xl font-bold text-[#7f1d1d] dark:text-amber-500">458</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Artworks</div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                        <div className="text-2xl font-bold text-[#7f1d1d] dark:text-amber-500">61</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Visitors</div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                        <div className="text-2xl font-bold text-[#7f1d1d] dark:text-amber-500">4.7</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</div>
                                    </div>
                                </div>

                                {/* {showVirtualTour && (
                                    <div className="mt-6">
                                        <h4 className="font-semibold text-gray-900 dark:text-white text-left mb-2">Virtual Experience</h4>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm text-left mb-4">
                                            Explore our museum from anywhere in the world. Click on any gallery to start a 360° virtual tour with expert commentary.
                                        </p>
                                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                                            <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                                                <Globe className="w-12 h-12 text-gray-400" />
                                            </div>
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                Virtual tours available for all galleries
                                            </p>
                                        </div>
                                    </div>
                                )} */}

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InteractiveMuseumMap;