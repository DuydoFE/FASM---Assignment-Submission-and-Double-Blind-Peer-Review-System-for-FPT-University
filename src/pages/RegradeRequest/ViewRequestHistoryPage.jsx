import { useState, useEffect } from "react";
import { Scale, Clock, CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { Tag } from "antd";

// Giả lập dữ liệu API
const mockRequests = [
  {
    id: 1,
    assignmentName: "Assignment 1: React Basics",
    courseName: "Frontend Development",
    requestDate: "2024-10-28",
    status: "Approved",
    reason: "I believe there was a miscalculation in the grading of question 3.",
    response: "After review, you are correct. The grade has been updated.",
  },
  {
    id: 2,
    assignmentName: "Midterm Project",
    courseName: "Software Engineering",
    requestDate: "2024-10-25",
    status: "Rejected",
    reason: "The rubric for the UI/UX part was not followed correctly in my opinion.",
    response: "The grading was consistent with the provided rubric. No changes will be made.",
  },
  {
    id: 3,
    assignmentName: "Lab 5: API Integration",
    courseName: "Advanced Web Development",
    requestDate: "2024-10-22",
    status: "Pending",
    reason: "My submission was not graded for the bonus part.",
    response: null,
  },
  {
    id: 4,
    assignmentName: "Assignment 3: State Management",
    courseName: "Frontend Development",
    requestDate: "2024-10-20",
    status: "Approved",
    reason: "The functionality for state persistence was implemented but not credited.",
    response: "You are right, we have re-evaluated and updated your score.",
  },
];

// Component để hiển thị tag trạng thái với màu sắc và icon tương ứng
const StatusTag = ({ status }) => {
  switch (status) {
    case "Approved":
      return (
        <Tag icon={<CheckCircle className="w-4 h-4" />} color="success">
          Approved
        </Tag>
      );
    case "Rejected":
      return (
        <Tag icon={<XCircle className="w-4 h-4" />} color="error">
          Rejected
        </Tag>
      );
    case "Pending":
      return (
        <Tag icon={<Clock className="w-4 h-4" />} color="processing">
          Pending
        </Tag>
      );
    default:
      return (
        <Tag icon={<HelpCircle className="w-4 h-4" />} color="default">
          Unknown
        </Tag>
      );
  }
};

const ViewRequestHistoryPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Giả lập việc fetch data từ API
  useEffect(() => {
    // Trong thực tế, bạn sẽ gọi API ở đây
    // ví dụ: regradeService.getHistory().then(data => setRequests(data));
    setTimeout(() => {
      setRequests(mockRequests);
      setLoading(false);
    }, 1000); // Giả lập độ trễ mạng
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <Scale className="w-8 h-8 mr-3 text-orange-500" />
          Regrade Request History
        </h1>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-center p-8">Loading request history...</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {requests.map((request) => (
                <li key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="flex-1 mb-4 md:mb-0">
                      <p className="text-lg font-semibold text-orange-600">
                        {request.assignmentName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {request.courseName}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Requested on: {request.requestDate}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <StatusTag status={request.status} />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="font-semibold text-gray-700">Your Reason:</p>
                    <p className="text-gray-600 italic">"{request.reason}"</p>
                    {request.response && (
                      <div className="mt-3">
                        <p className="font-semibold text-gray-700">Instructor's Response:</p>
                        <p className="text-gray-600 bg-gray-100 p-3 rounded-md">
                          {request.response}
                        </p>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewRequestHistoryPage;