import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Download, Eye, RotateCcw, Save, Send } from 'lucide-react';
import { reviewService } from '../../service/reviewService';
import CriterionForm from '../../component/Review/CriterionForm'; // Import component con

const PeerReviewPage = () => {
  const { courseId, assignmentId } = useParams();
  const navigate = useNavigate();

  // State quản lý dữ liệu và giao diện
  const [reviewData, setReviewData] = useState(null);
  const [scores, setScores] = useState({});
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviewData = async () => {
      if (!assignmentId) {
        setError("Không tìm thấy ID của assignment.");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const data = await reviewService.getPeerReviewAssignment(assignmentId);

        // *** SỬA LỖI QUAN TRỌNG: Kiểm tra cấu trúc dữ liệu trước khi set state ***
        if (data && data.rubric && Array.isArray(data.rubric.criteria)) {
          setReviewData(data);
          // Khởi tạo state scores với giá trị 0 cho mỗi tiêu chí một cách an toàn
          const initialScores = data.rubric.criteria.reduce((acc, criterion) => {
            acc[criterion.criteriaId] = 0;
            return acc;
          }, {});
          setScores(initialScores);
        } else {
          // Ném lỗi nếu dữ liệu trả về không hợp lệ
          throw new Error("Dữ liệu chấm điểm trả về không hợp lệ hoặc không có tiêu chí.");
        }
      } catch (err) {
        console.error(err);
        setError("Không thể tải bài làm để chấm. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviewData();
  }, [assignmentId]);

  // Hàm cập nhật điểm cho một tiêu chí
  const handleScoreChange = (criteriaId, newScore) => {
    setScores(prevScores => ({
      ...prevScores,
      [criteriaId]: newScore,
    }));
  };

  // Tính tổng điểm sử dụng useMemo để tối ưu hóa và an toàn hơn
  const totalScore = useMemo(() => {
    // Sử dụng optional chaining để tránh lỗi
    const criteria = reviewData?.rubric?.criteria;
    if (!criteria || Object.keys(scores).length === 0) return 0;
    
    const total = criteria.reduce((acc, criterion) => {
      const score = scores[criterion.criteriaId] || 0;
      const weightedScore = (score / criterion.maxScore) * (criterion.weight / 100);
      return acc + weightedScore;
    }, 0);

    return Math.round(total * 100); // Trả về điểm trên thang 100
  }, [scores, reviewData]);

  // Render các trạng thái khác nhau
  if (isLoading) return <div className="p-8 text-center text-xl">Đang tìm bài làm để chấm...</div>;
  if (error) return <div className="p-8 text-center text-red-500 text-xl">{error}</div>;
  
  // Giao diện chính
  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
            <div className="flex items-center text-sm text-gray-600 mb-4">
                <Link to={`/assignment/${courseId}/${assignmentId}`} className="hover:underline">Dashboard</Link>
                <ChevronRight className="w-4 h-4 mx-1" />
                <span className="font-semibold text-gray-800">Chấm chéo bài làm</span>
            </div>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Chấm chéo bài làm - {reviewData.assignmentTitle}</h1>
                    <p className="text-gray-500 mt-1">Mobile UI/UX Design Fundamentals</p>
                </div>
                <button onClick={() => navigate(-1)} className="flex items-center px-4 py-2 border rounded-md font-semibold text-gray-700 hover:bg-gray-100">
                    <ArrowLeft size={16} className="mr-2" />
                    Quay lại
                </button>
            </div>
        </div>

        {/* Submission Info */}
        <div className="bg-white p-4 rounded-lg border flex justify-between items-center mb-6">
            <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-600 text-white flex items-center justify-center rounded-full font-bold text-xl mr-4">
                    {/* Sử dụng optional chaining và fallback value */}
                    {(reviewData.studentName ?? 'A').charAt(0).toUpperCase()}
                </div>
                <div>
                    <p className="font-semibold">Bài làm của sinh viên - {reviewData.studentName ?? 'Anonymous'}</p>
                    <p className="text-sm text-gray-500">Nộp lúc: {new Date(reviewData.assignedAt).toLocaleTimeString('vi-VN')} - ID bài làm: {reviewData.submissionId}</p>
                </div>
            </div>
            <div className="px-3 py-1 text-sm font-semibold bg-yellow-100 text-yellow-700 rounded-full">
                Chưa chấm
            </div>
        </div>
        <div className="bg-white p-4 rounded-lg border flex items-center text-sm mb-8">
            <p className="font-semibold mr-4">{reviewData.fileName ?? 'submission.pdf'}</p>
            <span className="text-gray-500">2.3 MB • 4 trang</span>
            <div className="ml-auto flex space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-full"><Eye size={18}/></button>
                <button className="p-2 hover:bg-gray-100 rounded-full"><Download size={18}/></button>
            </div>
        </div>

        {/* Grading Form */}
        <div className="bg-white p-6 rounded-lg border mb-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Form chấm điểm</h3>
                <button className="flex items-center px-4 py-2 border rounded-md font-semibold text-gray-700 hover:bg-gray-100 text-sm">
                    <RotateCcw size={14} className="mr-2"/>
                    Reset
                </button>
            </div>
            {/* Sử dụng optional chaining ở đây để đảm bảo không bị crash */}
            {reviewData?.rubric?.criteria?.map(criterion => (
                <CriterionForm 
                    key={criterion.criteriaId}
                    criterion={criterion}
                    score={scores[criterion.criteriaId] || 0}
                    onScoreChange={handleScoreChange}
                />
            ))}
        </div>
        
        {/* Total Score & Comments */}
        <div className="bg-white p-6 rounded-lg border mb-8">
            <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg">
                <span className="text-xl font-bold text-blue-800">Tổng điểm</span>
                <span className="text-3xl font-extrabold text-blue-600">{totalScore}/100</span>
            </div>
            <div className="mt-6">
                <label className="font-bold text-gray-800 mb-2 block">Nhận xét chi tiết</label>
                <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-3 border rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập nhận xét cho sinh viên..."
                />
            </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-end space-x-3">
             <button className="flex items-center px-6 py-3 border rounded-md font-semibold text-gray-700 hover:bg-gray-100">
                <Save size={18} className="mr-2"/>
                Lưu nháp
            </button>
            <button className="flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
                <Send size={18} className="mr-2"/>
                Gửi điểm
            </button>
        </div>
      </div>
    </div>
  );
};

export default PeerReviewPage;