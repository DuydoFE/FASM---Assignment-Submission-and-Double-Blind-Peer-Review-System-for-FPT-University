import React, { useState } from 'react';
import { ArrowLeft, Download, Eye, Star, ChevronDown, Sparkles } from 'lucide-react';

const InstructorGradingDetail = () => {
    const [score, setScore] = useState(8.5);
    const [showAllReviews, setShowAllReviews] = useState(false);

    const peerReviews = [
        {
            id: 1,
            name: 'Tran Thi Binh',
            studentId: '2021002',
            date: '24/12/2024',
            score: 8.2,
            comment: 'The work meets the requirements: Beautiful and coherent layout. However, typography can be improved to increase readability. Overall: Design: 8/10 UX: 8/10 Technical: 7/10',
        },
        {
            id: 2,
            name: 'Le Minh Cuong',
            studentId: '2021003',
            date: '22/12/2024',
            score: 7.8,
            comment: 'Good design concept with creative ideas. Suitable color scheme but needs better spacing between elements. Code implementation is quite stable.',
        },
        {
            id: 3,
            name: 'Pham Thu Duyen',
            studentId: '2021004',
            date: '23/12/2024',
            score: 7.5,
            comment: 'The work has good potential, logical design and detailed user journey analysis. However, visual design can be better in terms of UI and performance optimization.',
        }
    ];

    const visibleReviews = showAllReviews ? peerReviews : peerReviews.slice(0, 3);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center gap-3">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-lg font-semibold text-gray-800">Submission Details</h1>
                        <p className="text-sm text-gray-500">Assignment: Mobile App Interface Design</p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-6">
                <div className="grid grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="col-span-2 space-y-6">
                        {/* Student Info */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-sm font-semibold text-gray-700 mb-3">Student Information</h2>
                            <div className="space-y-1 text-sm">
                                <p className="text-gray-800">Full Name: <span className="font-medium">Nguyen Van An</span></p>
                                <p className="text-gray-600">Student ID: SE174488</p>
                                <p className="text-gray-600">Class: SE1718</p>
                            </div>
                        </div>

                        {/* Submission Status */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-sm font-semibold text-gray-700 mb-3">Submission Status</h2>
                            <div className="flex items-start gap-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                    Submitted
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                    On Time
                                </div>
                            </div>
                            <div className="mt-3 text-sm text-gray-600 space-y-1">
                                <p>Submission Time: <span className="font-medium">23/12/2024 - 14:30</span></p>
                                <p>Deadline: <span className="font-medium">25/12/2024 - 23:59</span></p>
                            </div>
                        </div>

                        {/* File Submission */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-sm font-semibold text-gray-700 mb-3">Submitted File</h2>
                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">mobile-app-design.pdf</p>
                                        <p className="text-xs text-gray-500">8.2 MB • Uploaded: 23/12/2024 - 14:30</p>
                                        <p className="text-xs text-green-600 mt-1">Checked: 23/12/2024 - 16:30</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
                                        <Eye className="w-4 h-4 text-gray-600" />
                                        <span className="text-xs text-gray-600 ml-1">Preview</span>
                                    </button>
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center gap-2">
                                        <Download className="w-4 h-4" />
                                        Download
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Peer Reviews */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                    </svg>
                                    <h2 className="text-sm font-semibold text-gray-700">Peer Review (Classmate Evaluations)</h2>
                                </div>
                                <span className="text-sm text-gray-500">Average Score: <span className="font-semibold text-blue-600">7.8</span></span>
                            </div>

                            <p className="text-sm text-gray-600 mb-4">5 evaluations from classmates</p>

                            <div className="space-y-4">
                                {visibleReviews.map((review) => (
                                    <div key={review.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                    {review.name.split(' ')[0][0]}{review.name.split(' ')[review.name.split(' ').length - 1][0]}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800 text-sm">{review.name} <span className="text-gray-400">({review.studentId})</span></p>
                                                    <p className="text-xs text-gray-500">Evaluated: {review.date}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span className="text-sm font-semibold text-gray-800">{review.score}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                                    </div>
                                ))}
                            </div>

                            {!showAllReviews && peerReviews.length > 3 && (
                                <button
                                    onClick={() => setShowAllReviews(true)}
                                    className="w-full mt-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1"
                                >
                                    View More Reviews
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* AI Feedback */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5 text-purple-500" />
                                <h2 className="text-sm font-semibold text-gray-700">AI Feedback</h2>
                            </div>
                            <p className="text-xs text-gray-500 mb-4">Automatic Analysis by AI</p>
                            <div className="space-y-4 text-sm text-gray-700">
                                <div>
                                    <h3 className="font-medium text-gray-800 mb-2">Strengths:</h3>
                                    <ul className="list-disc pl-4 space-y-1 text-gray-600">
                                        <li>Clear and intuitive wireframe structure</li>
                                        <li>Good use of color scheme and typography</li>
                                        <li>Smooth user journey and logical flow</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-800 mb-2">Areas for Improvement:</h3>
                                    <ul className="list-disc pl-4 space-y-1 text-gray-600">
                                        <li>Improve visual hierarchy</li>
                                        <li>Optimize spacing between elements</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Overall Score */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-sm font-semibold text-gray-700 mb-4">Current Overall Score</h2>
                            <div className="flex items-center justify-center mb-4">
                                <div className="relative">
                                    <svg className="w-24 h-24 transform -rotate-90">
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="40"
                                            stroke="#e5e7eb"
                                            strokeWidth="8"
                                            fill="none"
                                        />
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="40"
                                            stroke="#10b981"
                                            strokeWidth="8"
                                            fill="none"
                                            strokeDasharray={`${(score / 10) * 251.2} 251.2`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-3xl font-bold text-green-600">{score}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center text-sm text-gray-600">
                                <p className="font-medium">Score: 8.2/10</p>
                            </div>
                        </div>

                        {/* Score Input */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-lg">📊</span>
                                <h3 className="text-sm font-semibold text-gray-700">Score</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setScore(Math.max(0, score - 0.5))}
                                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 font-semibold transition-colors"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={score}
                                    onChange={(e) => {
                                        let value = parseFloat(e.target.value);
                                        if (isNaN(value)) value = 0;
                                        value = Math.round(value * 10) / 10;
                                        setScore(Math.min(10, Math.max(0, value)));
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-center font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    step="0.1"  
                                    min="0"
                                    max="10"
                                />

                                <button
                                    onClick={() => setScore(Math.min(10, score + 0.5))}
                                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 font-semibold transition-colors"
                                >
                                    +
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 text-center mt-2">Maximum Score: 10</p>
                        </div>

                        {/* Detailed Criteria */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-lg">📋</span>
                                <h3 className="text-sm font-semibold text-gray-700">Detailed Comments</h3>
                            </div>
                            <textarea
                                placeholder="Enter detailed comments on the student's work..."
                                className="w-full min-h-[200px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 resize-y"
                                defaultValue=""
                            />
                            <p className="text-xs text-gray-500 mt-2">Suggestion: Clearly state strengths, areas for improvement, and overall evaluation</p>
                        </div>

                        {/* Grading Criteria */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Grading Criteria</h3>
                            <div className="space-y-3">
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-medium text-gray-800">Wireframe Design</p>
                                        <span className="text-xs font-semibold text-gray-600">40%</span>
                                    </div>
                                    <p className="text-xs text-gray-600">Wireframe structure and layout, clarity and coherence in design, layout feasibility</p>
                                </div>

                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-medium text-gray-800">Interactive Prototype</p>
                                        <span className="text-xs font-semibold text-gray-600">30%</span>
                                    </div>
                                    <p className="text-xs text-gray-600">Level of interaction, smoothness of transitions, correct logical functionality, user experience</p>
                                </div>

                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-medium text-gray-800">UX Analysis Report</p>
                                        <span className="text-xs font-semibold text-gray-600">30%</span>
                                    </div>
                                    <p className="text-xs text-gray-600">Depth and quality of user feedback analysis, specific user journey research, proposed solutions</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
                                Grade Submission
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InstructorGradingDetail;