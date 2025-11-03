import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Award, ArrowLeft, Star, MessageSquare, ListChecks } from 'lucide-react';

// Giả sử bạn sẽ có một service để lấy điểm
// import { scoreService } from '../../service/scoreService';

// Dữ liệu giả để hiển thị giao diện mẫu
const mockScoreData = {
    assignmentTitle: 'Basic Java Exercises',
    finalScore: 88,
    instructorFeedback: "Good effort overall. Your understanding of core concepts is solid. Try to improve on code commenting and handling edge cases in your next assignments.",
    peerReviewScore: 85,
    autoGraderScore: 92,
};

const ViewScorePage = () => {
    const { courseId, assignmentId } = useParams();
    const navigate = useNavigate();

    // Tích hợp API thật ở đây
    // const { data: scoreData, isLoading, isError } = useQuery({
    //     queryKey: ['finalScore', assignmentId],
    //     queryFn: () => scoreService.getFinalScore(assignmentId),
    //     enabled: !!assignmentId,
    // });
    
    // Sử dụng dữ liệu giả
    const isLoading = false;
    const isError = false;
    const scoreData = mockScoreData;


    if (isLoading) {
        return <div className="p-8 text-center">Loading scores...</div>;
    }

    if (isError) {
        return <div className="p-8 text-center text-red-500">Could not load scores.</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                {/* Breadcrumbs */}
                <div className="mb-6 flex items-center text-sm text-gray-600">
                    <Link to="/my-assignments" className="hover:underline">My Assignments</Link>
                    <ChevronRight className="w-4 h-4 mx-1" />
                    <Link to={`/assignment/${courseId}`} className="hover:underline">Assignments</Link>
                    <ChevronRight className="w-4 h-4 mx-1" />
                    <span className="font-semibold text-gray-800">Final Score</span>
                </div>

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{scoreData.assignmentTitle}</h1>
                        <p className="text-gray-500">Here is your final score and feedback for this assignment.</p>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center px-4 py-2 border rounded-md font-semibold text-gray-700 hover:bg-gray-100"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Back
                    </button>
                </div>
                
                {/* Score Display */}
                <div className="bg-white p-8 rounded-lg shadow-md border text-center">
                    <Award className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-gray-700">Your Final Score</p>
                    <p className="text-7xl font-extrabold text-blue-600 my-2">{scoreData.finalScore}<span className="text-4xl text-gray-400">/100</span></p>
                </div>

                {/* Score Breakdown */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md border">
                         <h3 className="font-bold text-lg mb-4 flex items-center"><ListChecks className="mr-2 text-blue-500" />Score Breakdown</h3>
                         <div className="space-y-3 text-gray-700">
                             <div className="flex justify-between"><span>Peer Review Score:</span><span className="font-bold">{scoreData.peerReviewScore}/100</span></div>
                             <div className="flex justify-between"><span>Auto-Grader Score:</span><span className="font-bold">{scoreData.autoGraderScore}/100</span></div>
                         </div>
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow-md border">
                         <h3 className="font-bold text-lg mb-4 flex items-center"><MessageSquare className="mr-2 text-green-500" />Instructor's Feedback</h3>
                         <p className="text-gray-600 italic">"{scoreData.instructorFeedback}"</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewScorePage;