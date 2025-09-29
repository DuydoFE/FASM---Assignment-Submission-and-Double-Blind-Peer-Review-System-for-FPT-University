import React, { useState } from 'react';
import { ArrowLeft, Download, Eye, Star, ChevronDown, Sparkles } from 'lucide-react';

const IntructorGradingDetail = () => {
  const [score, setScore] = useState(8.5);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const peerReviews = [
    {
      id: 1,
      name: 'Trần Thị Bình',
      studentId: '2021002',
      date: '24/12/2024',
      score: 8.2,
      comment: 'Bài làm đề bài: Layout đẹp và mạch lạc bài hóa. Tuy nhiên cũ thể cải thiện thêm về typography để tăng tính readable. Overall all âm tương tự Design: 8/10  UX: 8/10  Technical: 7/10',
      badges: ['UI Design: 8/10', 'UX: 8/10', 'Technical: 7/10']
    },
    {
      id: 2,
      name: 'Lê Minh Cường',
      studentId: '2021003',
      date: '22/12/2024',
      score: 7.8,
      comment: 'Design concept tốt và có ý tưởng sáng tạo. Color scheme phù hợp nhưng cần cải ý hơn về spacing giữa các elements. Code implementation còng khá ổn.',
      badges: ['UI Design: 8/10', 'UX: 7/10', 'Technical: 8/10']
    },
    {
      id: 3,
      name: 'Phạm Thu Duyên',
      studentId: '2021004',
      date: '23/12/2024',
      score: 7.5,
      comment: 'Bài làm có potential tốt, thiết kế logic và user journey được pay night tỷ. Tuy nhiên visual design có thể tôtd hơn cả về UI optimal performance.',
      badges: ['UI Design: 7/10', 'UX: 8/10', 'Technical: 7/10']
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
            <h1 className="text-lg font-semibold text-gray-800">Chi tiết bài làm</h1>
            <p className="text-sm text-gray-500">Bài tập: Thiết kế giao diện ứdụng mobile</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="col-span-2 space-y-6">
            {/* Student Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Thông tin sinh viên</h2>
              <div className="space-y-1 text-sm">
                <p className="text-gray-800">Họ và tên: <span className="font-medium">Nguyễn Văn An</span></p>
                <p className="text-gray-600">MSSV: SE174488</p>
                <p className="text-gray-600">Lớp: SE1718</p>
              </div>
            </div>

            {/* Submission Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Trạng thái nộp bài</h2>
              <div className="flex items-start gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Đã nộp
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Đúng hạn
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p>Thời gian nộp: <span className="font-medium">23/12/2024 - 14:30</span></p>
                <p>Deadline: <span className="font-medium">25/12/2024 - 23:59</span></p>
              </div>
            </div>

            {/* File Submission */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">File đã nộp</h2>
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
                    <p className="text-xs text-green-600 mt-1">Đã kiểm: 23/12/2024 - 16:30</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
                    <Eye className="w-4 h-4 text-gray-600" />
                    <span className="text-xs text-gray-600 ml-1">Xem trước</span>
                  </button>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Tải xuống
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
                  <h2 className="text-sm font-semibold text-gray-700">Peer Review (Đánh giá từ bạn cùng lớp)</h2>
                </div>
                <span className="text-sm text-gray-500">Điểm TB: <span className="font-semibold text-blue-600">7.8</span></span>
              </div>

              <p className="text-sm text-gray-600 mb-4">5 đánh giá từ bạn cùng lớp</p>

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
                          <p className="text-xs text-gray-500">Đánh giá: {review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-semibold text-sm">{review.score}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{review.comment}</p>
                    <div className="flex flex-wrap gap-2">
                      {review.badges.map((badge, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {!showAllReviews && peerReviews.length > 3 && (
                <button 
                  onClick={() => setShowAllReviews(true)}
                  className="w-full mt-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  Xem thêm 2 đánh giá
                  <ChevronDown className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* AI Summary */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  AI Summary & Analysis
                </h2>
                <button className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Tạo AI Summary
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-800">📊 Phân tích tổng quan:</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Bài làm thể hiện kỹ năng thiết kế tốt với layout hợp lý và màu sắc bắt mắt. Màu, logic sinh viên đã dụng đúng các nguyên tắc thiết kế UI/UX cơ bản.
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-gray-700">
                    <li>• <span className="font-medium">Điểm mạnh:</span></li>
                    <li className="ml-4">- Sử dụng typography nhất quán</li>
                    <li className="ml-4">- Color palette phù hợp với chủ đề</li>
                    <li className="ml-4">- Layout rõ ràng</li>
                  </ul>
                  <ul className="mt-2 space-y-1 text-sm text-gray-700">
                    <li>• <span className="font-medium">Cần cải thiện:</span></li>
                    <li className="ml-4">- Tăng contrast cho accessibility</li>
                    <li className="ml-4">- Cân thiện visual hierarchy</li>
                    <li className="ml-4">- Optimize spacing between elements</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Điểm tổng kết hiện tại</h2>
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
                <p className="font-medium">Điểm: 8.2/10</p>
                <p className="text-xs mt-1">23 học sinh</p>
                <p className="text-xs">đã được chấm</p>
              </div>
            </div>

            {/* Score Input */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">📊</span>
                <h3 className="text-sm font-semibold text-gray-700">Điểm số</h3>
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
                  onChange={(e) => setScore(Math.min(10, Math.max(0, parseFloat(e.target.value) || 0)))}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-center font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.5"
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
              <p className="text-xs text-gray-500 text-center mt-2">Điểm tối đa: 10đ</p>
            </div>

            {/* Detailed Criteria */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">📋</span>
                <h3 className="text-sm font-semibold text-gray-700">Nhận xét chi tiết</h3>
              </div>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-700 mb-2">Bài làm thể hiện khả năng thiết kế tốt với layout hợp lý và sử dụng màu sắc hài hòa. Wireframe được thiết kế tốt và phù hợp với yêu cầu.</p>
                  <p className="font-medium text-gray-800 mb-1">✅ Ưu điểm:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                    <li>Layout responsive và user-friendly</li>
                    <li>Sử dụng màu sắc bắt mắt hợp</li>
                    <li>Cấu trúc thông tin logic</li>
                  </ul>
                  <p className="font-medium text-gray-800 mb-1 mt-3">⚠️ Cần cải thiện:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                    <li>Cải cải thiện:</li>
                    <li>Tăng độ tương phản để dễ accessibility</li>
                    <li>Cải thiện visual hierarchy</li>
                    <li>Thiện màu sắc interactions</li>
                  </ul>
                </div>
                <p className="text-xs text-gray-500 italic">Tổng kết: Một bài làm tốt, đã hiểu hiểu cơ bản về UX/UI design. Tiếp tục phát triển để nâng cao accessibility và animation.</p>
              </div>
            </div>

            {/* Grading Criteria */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Tiêu chí chấm điểm</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-800">Thiết kế Wireframe</p>
                      <span className="text-xs font-semibold text-blue-600">40%</span>
                    </div>
                    <p className="text-xs text-gray-600">Cấu trúc và bố cục wireframe, sự rõ ràng và mạch lạc trong thiết kế, tính khả thi của layout</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg">✨</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-800">Prototype tương tác</p>
                      <span className="text-xs font-semibold text-yellow-600">30%</span>
                    </div>
                    <p className="text-xs text-gray-600">Mức độ tương tác, sự mượt mà của transitions, tính năng hoạt động đúng logic, trải nghiệm người dùng</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-800">Báo cáo phân tích UX</p>
                      <span className="text-xs font-semibold text-green-600">30%</span>
                    </div>
                    <p className="text-xs text-gray-600">Chiều sâu và chất lượng phân tích ý kiến người dùng, nghiên cứu user journey cụ thể, giải pháp được đề xuất</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                Hủy bỏ
              </button>
              <button className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
                Chấm bài điểm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IntructorGradingDetail;