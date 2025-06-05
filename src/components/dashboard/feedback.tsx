// src\components\dashboard\feedback.tsx
import { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter
} from '@/components/ui/card';
import {
    Star,
    MessageSquare,
    ClipboardList,
    Award,
    ChevronRight,
    X,
    BarChart2,
    User,
    Mail,
    Check,
    XCircle
} from 'lucide-react';

const feedbackData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', rating: 5, message: 'The course exceeded my expectations in every way. The content was thoughtfully structured, each module building upon the last in a meaningful progression. I particularly appreciated the interactive elements that kept me engaged throughout. Would definitely recommend!' },
    { id: 2, name: 'Sandilya Baruah', email: 'sandilya@example.com', rating: 4, message: 'Very informative and user-friendly. I liked how clearly the topics were explained and supported with examples. A little more depth in some sections would make it even better, but overall a great learning experience.' },
    { id: 3, name: 'Subhrajyoti Goswami', email: 'subhrajyoti@example.com', rating: 4, message: 'A great effort in putting together relevant and updated material. It gave me good insights and I learned things I didn’t know before. Some sections could be more detailed, but I’m satisfied with the course.' },
    { id: 4, name: 'Ritanjit Das', email: 'ritanjit@example.com', rating: 5, message: 'Absolutely loved the visual aids and real-life examples! They made learning enjoyable and easy to grasp. The flow was smooth and intuitive. Thank you for such quality content!' },
    { id: 5, name: 'Kumar Jigyas Pritam', email: 'kumar@example.com', rating: 5, message: 'Fantastic delivery! The instructor’s clarity and the platform’s interface worked perfectly together to make a smooth experience. Every topic felt like a step up without being overwhelming.' },
    { id: 6, name: 'Rajjyoti Das', email: 'rajjyoti@example.com', rating: 4, message: 'Good balance of theory and practical use-cases. I found myself referring back to notes often. A few segments felt slightly rushed, but the overall approach was strong.' },
    { id: 7, name: 'Subrata Goswami', email: 'subrata@example.com', rating: 5, message: 'This was one of the most well-organized courses I’ve taken. Every slide, video, and resource was useful. I appreciate the effort that went into designing this program. Great job!' },
    { id: 8, name: 'Prasurjya Goswami', email: 'prasurjya@example.com', rating: 4, message: 'A reliable source of information for beginners. I liked the pace and how it gradually introduced new concepts. A little more advanced content would help learners progress further.' },
    { id: 9, name: 'Deepak Kalita', email: 'deepak@example.com', rating: 4, message: 'Useful and concise. I liked the mix of visual explanations and quick quizzes. It helped me retain what I learned. A few glitches in the interface were distracting, though.' },
    { id: 10, name: 'Vikram Mehta', email: 'vikram@example.com', rating: 5, message: 'Really impressed by the quality of examples used. The storytelling kept the sessions memorable. It’s clear a lot of thought went into crafting this course for learners like us.' },
    { id: 11, name: 'Emily Johnson', email: 'emily@example.com', rating: 5, message: 'I found the sessions highly engaging. The flow of information and supporting materials helped me connect the dots better than any textbook. Kudos to the creators!' },
    { id: 12, name: 'Rahul Verma', email: 'rahul@example.com', rating: 4, message: 'I gained clarity on several difficult concepts thanks to this course. The instructor’s tone was motivating and easy to follow. I’d suggest a few improvements to the navigation layout.' },
    { id: 13, name: 'Sara Fernandes', email: 'sara@example.com', rating: 4, message: 'An effective way to learn new skills. I liked how practical the sessions felt. The examples were close to real-life problems and helped me apply knowledge immediately.' },
    { id: 14, name: 'Nikhil Das', email: 'nikhil@example.com', rating: 5, message: 'This was such an enlightening experience! Everything was broken down logically, and the hands-on parts made a huge difference in my understanding. Highly recommended!' },
    { id: 15, name: 'Aditi Banerjee', email: 'aditi@example.com', rating: 4, message: 'Great initiative with a lot of potential. I appreciated the smooth UI and prompt support responses. Including a few more advanced case studies would have made it even better.' }
];

const questionnaireData = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        attempted: true,
        correct: 8,
        wrong: 2,
        collectedCertificate: true,
    },
    {
        id: 2,
        name: 'Sandilya Barauh',
        email: 'sandilya@example.com',
        attempted: true,
        correct: 6,
        wrong: 4,
        collectedCertificate: false,
    },
    {
        id: 3,
        name: 'Ritanjit Das',
        email: 'ritanjit@example.com',
        attempted: true,
        correct: 9,
        wrong: 1,
        collectedCertificate: false,
    },
    {
        id: 4,
        name: 'Subhrajyoti Goswami',
        email: 'subhrajyoti@example.com',
        attempted: true,
        correct: 8,
        wrong: 2,
        collectedCertificate: true,
    },
    {
        id: 5,
        name: 'Kumar Jigyas Pritam',
        email: 'kumar@example.com',
        attempted: true,
        correct: 4,
        wrong: 6,
        collectedCertificate: true,
    },
    {
        id: 6,
        name: 'Subrata Goswami',
        email: 'subrata@example.com',
        attempted: true,
        correct: 5,
        wrong: 5,
        collectedCertificate: true,
    },
    {
        id: 7,
        name: 'Prasurjya Goswami',
        email: 'prasurjya@example.com',
        attempted: true,
        correct: 5,
        wrong: 5,
        collectedCertificate: false,
    },
    {
        id: 8,
        name: 'Rajjyoti Das',
        email: 'rajjyoti@example.com',
        attempted: true,
        correct: 10,
        wrong: 0,
        collectedCertificate: true,
    },
    {
        id: 9,
        name: 'Deepak Kalita',
        email: 'deepak@example.com',
        attempted: true,
        correct: 6,
        wrong: 4,
        collectedCertificate: true,
    },
];

export default function FeedbackAdmin() {
    const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
    const [showQuestionnaire, setShowQuestionnaire] = useState(false);
    const [activeTab, setActiveTab] = useState('feedback');
    const [searchTerm, setSearchTerm] = useState('');
    const [certificateSearchTerm, setCertificateSearchTerm] = useState('');

    // Calculate statistics
    const totalFeedback = feedbackData.length;
    const averageRating = (
        feedbackData.reduce((sum, f) => sum + f.rating, 0) / totalFeedback
    ).toFixed(1);

    const totalQuestionnaires = questionnaireData.length;
    const certificatesCollected = questionnaireData.filter(q => q.collectedCertificate).length;
    const avgScore = (questionnaireData.reduce((sum, q) => sum + q.correct, 0) / (totalQuestionnaires * 10) * 100).toFixed(1);

    // Filter feedback data based on search
    const filteredFeedback = feedbackData.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredQuestionnaires = questionnaireData.filter(q =>
        q.name.toLowerCase().includes(certificateSearchTerm.toLowerCase()) ||
        q.email.toLowerCase().includes(certificateSearchTerm.toLowerCase())
    );

    // Rating distribution
    const ratingDistribution = [0, 0, 0, 0, 0];
    feedbackData.forEach(f => {
        ratingDistribution[f.rating - 1]++;
    });

    return (
        <div className="p-6 bg-stone-100 dark:bg-gray-950 min-h-screen transition-all">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6 ">
                    <h1 className="text-3xl font-bold text-red-900 dark:text-amber-500 flex items-center gap-2">
                        <BarChart2 size={28} />
                        Feedback & Certificates Dashboard
                    </h1>

                    <div className="flex gap-2">
                        {/* Show certificate search when in questionnaire tab */}
                        {activeTab === 'questionnaire' && (
                            <div className="w-72">
                                <input
                                    type="text"
                                    placeholder="Search certificates..."
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-red-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent transition-all duration-200"
                                    value={certificateSearchTerm}
                                    onChange={(e) => setCertificateSearchTerm(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                            <button
                                className={`px-4 py-2 font-medium transition-colors ${activeTab === 'feedback' ? 'bg-red-900 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                onClick={() => {
                                    setActiveTab('feedback');
                                    setShowQuestionnaire(false);
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <MessageSquare size={18} />
                                    Feedback
                                </div>
                            </button>
                            <button
                                className={`px-4 py-2 font-medium transition-colors ${activeTab === 'questionnaire' ? 'bg-red-900 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                onClick={() => {
                                    setActiveTab('questionnaire');
                                    setShowQuestionnaire(true);
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <Award size={18} />
                                    Certificates
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {!showQuestionnaire ? (
                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <Card className="bg-white dark:bg-gray-900 border border-red-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-gray-600 dark:text-gray-400">Total Feedback</p>
                                            <h3 className="text-3xl font-bold mt-2 text-red-900 dark:text-white">{totalFeedback}</h3>
                                        </div>
                                        <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                                            <MessageSquare className="text-red-900 dark:text-red-300" size={24} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white dark:bg-gray-900 border border-red-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-gray-600 dark:text-gray-400">Average Rating</p>
                                            <div className="flex items-center mt-2">
                                                <h3 className="text-3xl font-bold text-red-900 dark:text-white mr-2">{averageRating}</h3>
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={20}
                                                            className={`${i < Math.floor(Number(averageRating)) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
                                            <Star className="text-amber-600 dark:text-amber-300" size={24} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white dark:bg-gray-900 border border-red-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-gray-600 dark:text-gray-400">Questionnaires</p>
                                            <h3 className="text-3xl font-bold mt-2 text-red-900 dark:text-white">{totalQuestionnaires}</h3>
                                        </div>
                                        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                                            <ClipboardList className="text-blue-900 dark:text-blue-300" size={24} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white dark:bg-gray-900 border border-red-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-gray-600 dark:text-gray-400">Certificates Issued</p>
                                            <h3 className="text-3xl font-bold mt-2 text-red-900 dark:text-white">{certificatesCollected}</h3>
                                        </div>
                                        <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                                            <Award className="text-green-900 dark:text-green-300" size={24} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Rating Distribution */}
                        <Card className="bg-white dark:bg-gray-900 border border-red-200 dark:border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-red-900 dark:text-amber-500">Rating Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {[5, 4, 3, 2, 1].map((rating, index) => (
                                        <div key={rating} className="flex items-center">
                                            <div className="w-10 text-right mr-2 text-gray-700 dark:text-gray-300">{rating} ★</div>
                                            <div className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-full h-4">
                                                <div
                                                    className="bg-amber-500 h-4 rounded-full"
                                                    style={{
                                                        width: `${(ratingDistribution[rating - 1] / totalFeedback) * 100}%`
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="w-16 text-right ml-2 text-gray-700 dark:text-gray-300">
                                                {ratingDistribution[rating - 1]} ({((ratingDistribution[rating - 1] / totalFeedback) * 100).toFixed(1)}%)
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Feedback List */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card className="lg:col-span-2 bg-white dark:bg-gray-900 border border-red-200 dark:border-gray-700">
                                <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-6 pt-6">
                                    <CardTitle className="text-red-900 dark:text-amber-500 text-lg">
                                        Feedback Entries <span className="font-normal text-gray-500 dark:text-gray-400">({filteredFeedback.length})</span>
                                    </CardTitle>

                                    <div className="w-full lg:w-72">
                                        <input
                                            type="text"
                                            placeholder="Search by name or email"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-red-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent transition-all duration-200"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-y-auto max-h-[500px]">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-800">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rating</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Feedback</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                                {filteredFeedback.map((f) => (
                                                    <tr
                                                        key={f.id}
                                                        className={`hover:bg-red-50 dark:hover:bg-gray-800 cursor-pointer ${selectedFeedback?.id === f.id ? 'bg-red-50 dark:bg-gray-800' : ''}`}
                                                        onClick={() => setSelectedFeedback(f)}
                                                    >
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-full mr-3">
                                                                    <User size={16} className="text-red-900 dark:text-red-300" />
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium text-red-900 dark:text-white">{f.name}</div>
                                                                    <div className="text-sm text-gray-500 dark:text-gray-400">{f.email}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        size={16}
                                                                        className={`${i < f.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300 dark:text-gray-600'}`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 max-w-xs">
                                                            <div className="line-clamp-2">{f.message}</div>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                            <ChevronRight size={18} className="text-gray-400" />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Feedback Detail */}
                            <div>
                                {selectedFeedback ? (
                                    <Card className="bg-white dark:bg-gray-900 border border-red-200 dark:border-gray-700 h-full">
                                        <CardHeader className="border-b border-red-200 dark:border-gray-700">
                                            <div className="flex justify-between items-center">
                                                <CardTitle className="text-red-900 dark:text-amber-500">
                                                    Feedback Details
                                                </CardTitle>
                                                <button
                                                    onClick={() => setSelectedFeedback(null)}
                                                    className="text-gray-500 hover:text-red-900 dark:hover:text-amber-500"
                                                >
                                                    <X size={20} />
                                                </button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-6">
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
                                                        <User size={24} className="text-red-900 dark:text-red-300" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">User</h4>
                                                        <p className="text-lg font-semibold text-red-900 dark:text-white">{selectedFeedback.name}</p>
                                                        <p className="text-gray-600 dark:text-gray-400">{selectedFeedback.email}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="bg-amber-100 dark:bg-amber-900/20 p-3 rounded-full">
                                                        <Star size={24} className="text-amber-600 dark:text-amber-300" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Rating</h4>
                                                        <div className="flex items-center">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    size={20}
                                                                    className={`${i < selectedFeedback.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300 dark:text-gray-600'}`}
                                                                />
                                                            ))}
                                                            <span className="ml-2 text-lg font-semibold text-red-900 dark:text-white">{selectedFeedback.rating}/5</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Feedback</h4>
                                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                                        <p className="text-gray-700 dark:text-gray-300 italic">"{selectedFeedback.message}"</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="border-t border-red-200 dark:border-gray-700 pt-4">
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                Received on: {new Date().toLocaleDateString()}
                                            </div>
                                        </CardFooter>
                                    </Card>
                                ) : (
                                    <Card className="bg-white dark:bg-gray-900 border border-red-200 dark:border-gray-700 h-full flex flex-col items-center justify-center py-16">
                                        <MessageSquare size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                                        <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400">Select a Feedback</h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-center mt-2 max-w-xs">
                                            Click on a feedback entry to view detailed information
                                        </p>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Certificate Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="bg-white dark:bg-gray-900 border border-red-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-gray-600 dark:text-gray-400">Total Questionnaires</p>
                                            <h3 className="text-3xl font-bold mt-2 text-red-900 dark:text-white">{totalQuestionnaires}</h3>
                                        </div>
                                        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                                            <ClipboardList className="text-blue-900 dark:text-blue-300" size={24} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white dark:bg-gray-900 border border-red-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-gray-600 dark:text-gray-400">Certificates Collected</p>
                                            <h3 className="text-3xl font-bold mt-2 text-red-900 dark:text-white">{certificatesCollected}</h3>
                                        </div>
                                        <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                                            <Award className="text-green-900 dark:text-green-300" size={24} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white dark:bg-gray-900 border border-red-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-gray-600 dark:text-gray-400">Average Score</p>
                                            <h3 className="text-3xl font-bold mt-2 text-red-900 dark:text-white">{avgScore}%</h3>
                                        </div>
                                        <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
                                            <BarChart2 className="text-amber-600 dark:text-amber-300" size={24} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Certificate Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredQuestionnaires.map((user) => {
                                const percentage = ((user.correct / 10) * 100).toFixed(1);
                                const passed = user.correct >= 6;

                                return (
                                    <Card
                                        key={user.id}
                                        className={`bg-white dark:bg-gray-900 border ${passed ? 'border-green-200 dark:border-green-900/50' : 'border-amber-200 dark:border-amber-900/50'} shadow-md hover:shadow-lg transition-shadow`}
                                    >
                                        <CardHeader>
                                            <CardTitle className="text-red-900 dark:text-amber-500">
                                                <div className="flex justify-between items-center">
                                                    <span>{user.name}</span>
                                                    <div className={`p-1 rounded-full ${user.collectedCertificate ? 'bg-green-100 dark:bg-green-900/20' : 'bg-amber-100 dark:bg-amber-900/20'}`}>
                                                        {user.collectedCertificate ? (
                                                            <Check size={18} className="text-green-600 dark:text-green-300" />
                                                        ) : (
                                                            <XCircle size={18} className="text-amber-600 dark:text-amber-300" />
                                                        )}
                                                    </div>
                                                </div>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-full">
                                                    <Mail size={18} className="text-red-900 dark:text-red-300" />
                                                </div>
                                                <p className="text-gray-700 dark:text-gray-300">{user.email}</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-lg">
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Correct</p>
                                                    <p className="text-xl font-bold text-green-700 dark:text-green-300">{user.correct}</p>
                                                </div>

                                                <div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-lg">
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Wrong</p>
                                                    <p className="text-xl font-bold text-red-700 dark:text-red-300">{user.wrong}</p>
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Score</span>
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{percentage}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5">
                                                    <div
                                                        className={`h-2.5 rounded-full ${passed ? 'bg-green-600' : 'bg-amber-500'}`}
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                                <p className={`mt-2 text-sm font-medium ${passed ? 'text-green-700 dark:text-green-300' : 'text-amber-700 dark:text-amber-300'}`}>
                                                    {passed ? 'Passed' : 'Not Passed'}
                                                </p>
                                            </div>

                                            <div className={`flex items-center justify-between p-3 rounded-lg ${user.collectedCertificate ? 'bg-green-50 dark:bg-green-900/10' : 'bg-amber-50 dark:bg-amber-900/10'}`}>
                                                <div className="flex items-center gap-2">
                                                    <Award size={18} className={user.collectedCertificate ? 'text-green-600 dark:text-green-300' : 'text-amber-600 dark:text-amber-300'} />
                                                    <span className={user.collectedCertificate ? 'text-green-700 dark:text-green-300' : 'text-amber-700 dark:text-amber-300'}>
                                                        Certificate {user.collectedCertificate ? 'Collected' : 'Not Collected'}
                                                    </span>
                                                </div>
                                                {!user.collectedCertificate && (
                                                    <button className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-2 py-1 rounded">
                                                        Send Reminder
                                                    </button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}