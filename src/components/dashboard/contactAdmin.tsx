// ContactAdmin.tsx
import React, { useState, useEffect } from "react";
import {
    FaEnvelope,
    FaUser,
    FaPhone,
    FaClock,
    FaReply,
    FaTrash,
    FaEye,
    FaFilter,
    FaSearch,
    FaStar,
    FaDownload,
    FaTimes
} from "react-icons/fa";
import {
    getAllContactSubmissions,
    updateContactSubmission,
    sendReplyEmail,
    deleteContactSubmission as deleteSubmissionApi
} from "@/actions/contact";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Import autoTable separately

interface ContactSubmission {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    message: string;
    created_at: string;
    status: 'new' | 'read' | 'replied';
    starred: boolean;
}

const ContactAdmin = () => {
    const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
    const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [replySubject, setReplySubject] = useState('Re: Your inquiry about manuscript access');
    const [replyMessage, setReplyMessage] = useState('');

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const data = await getAllContactSubmissions();
            setSubmissions(data);
        } catch (error) {
            console.error("Failed to fetch submissions", error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            case 'read': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
            case 'replied': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredSubmissions = submissions.filter(submission => {
        const matchesFilter = filterStatus === 'all' || submission.status === filterStatus;
        const matchesSearch = submission.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            submission.message.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const updateStatus = async (id: string, status: 'new' | 'read' | 'replied') => {
        try {
            await updateContactSubmission(id, { status });
            setSubmissions(prev => prev.map(sub =>
                sub.id === id ? { ...sub, status } : sub
            ));
            if (selectedSubmission?.id === id) {
                setSelectedSubmission({ ...selectedSubmission, status });
            }
        } catch (error) {
            console.error("Update failed", error);
        }
    };

    const toggleStarred = async (id: string, starred: boolean) => {
        try {
            await updateContactSubmission(id, { starred });
            setSubmissions(prev => prev.map(sub =>
                sub.id === id ? { ...sub, starred } : sub
            ));
            if (selectedSubmission?.id === id) {
                setSelectedSubmission({ ...selectedSubmission, starred });
            }
        } catch (error) {
            console.error("Star update failed", error);
        }
    };

    const handleSendReply = async () => {
        if (!selectedSubmission) return;

        try {
            await sendReplyEmail({
                to: selectedSubmission.email,
                subject: replySubject,
                message: replyMessage
            });
            await updateStatus(selectedSubmission.id, "replied");
            setShowReplyModal(false);
        } catch (error) {
            console.error("Failed to send email", error);
        }
    };

    const deleteSubmission = async (id: string) => {
        try {
            await deleteSubmissionApi(id);
            setSubmissions(prev => prev.filter(sub => sub.id !== id));
            if (selectedSubmission?.id === id) {
                setSelectedSubmission(null);
            }
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    // Generate PDF report
    const exportToPDF = () => {
        const doc = new jsPDF();
        const date = new Date().toLocaleDateString();

        // Title
        doc.setFontSize(18);
        doc.text("Contact Submissions Report", 14, 15);
        doc.setFontSize(10);
        doc.text(`Generated on: ${date}`, 14, 22);

        // Table data
        const tableData = submissions.map(sub => [
            sub.fullName,
            sub.email,
            sub.phone,
            sub.message,
            new Date(sub.created_at).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            sub.status,
            sub.starred ? "Yes" : "No"
        ]);

        // Table headers
        const headers = [
            "Name",
            "Email",
            "Phone",
            "Message",
            "Date",
            "Status",
            "Starred"
        ];

        // Use autoTable directly
        autoTable(doc, {
            head: [headers],
            body: tableData,
            startY: 25,
            theme: "grid",
            styles: {
                fontSize: 9,
                cellPadding: 2,
                valign: "middle"
            },
            headStyles: {
                fillColor: [206, 17, 38], // Red color
                textColor: 255,
                fontStyle: "bold"
            },
            columnStyles: {
                0: { cellWidth: 25 },
                1: { cellWidth: 40 },
                2: { cellWidth: 30 },
                3: { cellWidth: 50 },
                4: { cellWidth: 30 },
                5: { cellWidth: 20 },
                6: { cellWidth: 15 }
            }
        });

        // Save PDF
        doc.save(`contact-submissions-${date.replace(/\//g, '-')}.pdf`);
    };

    const handleOpenEmailClient = () => {
        if (!selectedSubmission) return;

        // Encode subject and message for mailto link
        const encodedSubject = encodeURIComponent(replySubject);
        const encodedBody = encodeURIComponent(replyMessage);

        // Create mailto link
        const mailtoLink = `mailto:${selectedSubmission.email}?subject=${encodedSubject}&body=${encodedBody}`;

        // Open email client
        window.location.href = mailtoLink;

        // Update status to replied
        updateStatus(selectedSubmission.id, "replied");

        // Close the modal
        setShowReplyModal(false);
    };


    return (
        <div className="bg-stone-100 dark:bg-gray-950 min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 mb-6 border border-red-200 dark:border-gray-700">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-red-900 dark:text-amber-500 mb-2">
                                Contact Submissions Dashboard
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Manage and respond to visitor inquiries and research requests
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={exportToPDF}
                                className="flex items-center gap-2 px-4 py-2 bg-red-900 hover:bg-red-800 text-white rounded-lg transition-colors"
                            >
                                <FaDownload className="w-4 h-4" />
                                Export
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 mb-6 border border-red-200 dark:border-gray-700">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or message..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-red-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-red-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-red-900 dark:focus:ring-amber-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-3 border border-red-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-red-900 dark:text-white focus:ring-2 focus:ring-red-900 dark:focus:ring-amber-500"
                            >
                                <option value="all">All Status</option>
                                <option value="new">New</option>
                                <option value="read">Read</option>
                                <option value="replied">Replied</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    {[
                        { label: 'Total Submissions', value: submissions.length, color: 'bg-red-900 dark:bg-amber-600', icon: <FaEnvelope /> },
                        { label: 'New', value: submissions.filter(s => s.status === 'new').length, color: 'bg-red-600', icon: <FaClock /> },
                        { label: 'Replied', value: submissions.filter(s => s.status === 'replied').length, color: 'bg-green-600', icon: <FaReply /> },
                        { label: 'Starred', value: submissions.filter(s => s.starred).length, color: 'bg-orange-600', icon: <FaStar /> },
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-red-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
                                    <p className="text-2xl font-bold text-red-900 dark:text-amber-500 mt-1">{stat.value}</p>
                                </div>
                                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Submissions List */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-red-200 dark:border-gray-700">
                        <div className="p-6 border-b border-red-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-red-900 dark:text-amber-500">
                                Submissions ({filteredSubmissions.length})
                            </h2>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {filteredSubmissions.map((submission) => (
                                <div
                                    key={submission.id}
                                    onClick={() => setSelectedSubmission(submission)}
                                    className={`p-6 border-b border-red-100 dark:border-gray-800 cursor-pointer hover:bg-red-50 dark:hover:bg-gray-800 transition-colors ${selectedSubmission?.id === submission.id ? 'bg-red-50 dark:bg-gray-800 border-l-4 border-l-red-900 dark:border-l-amber-500' : ''
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-red-900 dark:bg-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                                                {submission.fullName.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-red-900 dark:text-white">{submission.fullName}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{submission.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                                                {submission.status}
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleStarred(submission.id, !submission.starred);
                                                }}
                                                className="text-amber-500 hover:text-amber-600 transition-colors"
                                                title={submission.starred ? "Unstar" : "Star"}
                                            >
                                                <FaStar className={`w-4 h-4 ${submission.starred ? 'fill-current' : 'text-gray-300'}`} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2 mb-2">
                                        {submission.message}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <FaClock className="w-3 h-3" />
                                            {formatDate(submission.created_at)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FaPhone className="w-3 h-3" />
                                            {submission.phone}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {filteredSubmissions.length === 0 && (
                                <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                                    <FaEnvelope className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No submissions found matching your criteria</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Detail Panel */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-red-200 dark:border-gray-700">
                        {selectedSubmission ? (
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-red-900 dark:text-amber-500">Message Details</h2>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSelectedSubmission(null)}
                                            className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                            title="Close"
                                        >
                                            <FaTimes className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-gray-800 rounded-lg">
                                        <div className="w-12 h-12 bg-red-900 dark:bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                            {selectedSubmission.fullName.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-red-900 dark:text-white">{selectedSubmission.fullName}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{selectedSubmission.email}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{selectedSubmission.phone}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-red-900 dark:text-amber-500 mb-2">Message</h4>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                                {selectedSubmission.message}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                        <span>Received: {formatDate(selectedSubmission.created_at)}</span>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedSubmission.status)}`}>
                                                {selectedSubmission.status}
                                            </span>
                                            <button
                                                onClick={() => toggleStarred(selectedSubmission.id, !selectedSubmission.starred)}
                                                className="text-amber-500 hover:text-amber-600 transition-colors"
                                                title={selectedSubmission.starred ? "Unstar" : "Star"}
                                            >
                                                <FaStar className={`w-4 h-4 ${selectedSubmission.starred ? 'fill-current' : 'text-gray-300'}`} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <button
                                            onClick={() => updateStatus(selectedSubmission.id, "read")}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                        >
                                            <FaEye className="w-4 h-4" />
                                            Mark as Read
                                        </button>
                                        <button
                                            onClick={() => {
                                                setReplySubject(`Re: Your inquiry from ${selectedSubmission.fullName}`);
                                                setReplyMessage('');
                                                setShowReplyModal(true);
                                            }}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                        >
                                            <FaReply className="w-4 h-4" />
                                            Reply
                                        </button>
                                        <button
                                            onClick={() => deleteSubmission(selectedSubmission.id)}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                        >
                                            <FaTrash className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                                <FaEnvelope className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>Select a submission to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reply Modal */}
            {showReplyModal && selectedSubmission && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-red-200 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-red-900 dark:text-amber-500">
                                Reply to {selectedSubmission.fullName}
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    value={replySubject}
                                    onChange={(e) => setReplySubject(e.target.value)}
                                    className="w-full border border-red-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800 text-red-900 dark:text-white focus:ring-2 focus:ring-red-900 dark:focus:ring-amber-500"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Message
                                </label>
                                <textarea
                                    rows={8}
                                    placeholder="Type your reply here..."
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    className="w-full border border-red-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800 text-red-900 dark:text-white focus:ring-2 focus:ring-red-900 dark:focus:ring-amber-500"
                                />
                            </div>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowReplyModal(false)}
                                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleOpenEmailClient}
                                    className="px-6 py-2 bg-red-900 hover:bg-red-800 text-white rounded-lg transition-colors"
                                >
                                    Send Reply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactAdmin;