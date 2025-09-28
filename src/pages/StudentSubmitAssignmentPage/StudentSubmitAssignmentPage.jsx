
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Clock, BarChart2, Calendar, AlertTriangle, FileText, Download, Upload, Info, CheckCircle, File, ExternalLink, Eye, RefreshCw, BookOpen, Users } from 'lucide-react';

const course = {
  code: 'SE1741',
  title: 'PRM391 Mobile Development Lab',
  instructor: 'Nguyễn Minh Sang',
};

const assignment = {
  id: 1, 
  title: 'Assignment 1: Mobile UI/UX Design Fundamentals',
  description: 'Thiết kế giao diện và trải nghiệm người dùng cho ứng dụng mobile',
  deadline: '25/12/2024 - 23:59',
  timeLeft: 'Còn 1 ngày 14 giờ',
  weight: '20%',
  details: 'Sinh viên cần thiết kế wireframe cho 5 màn hình chính của một ứng dụng mobile, bao gồm prototype tương tác và viết báo cáo phân tích UX tối thiểu 1000 từ. Định dạng nộp bài: PDF + Figma link.',
};

const gradingCriteria = [
    { title: '1. Thiết kế Wireframe', weight: '40%', details: ['Độ chi tiết và chính xác của wireframe', 'Tính logic trong bố cục giao diện', 'Tuân thủ nguyên tắc thiết kế mobile'] },
    { title: '2. Prototype tương tác', weight: '30%', details: ['Mức độ tương tác và chuyển đổi màn hình', 'Tính khả thi của prototype', 'Trải nghiệm người dùng mượt mà'] },
    { title: '3. Báo cáo phân tích UX', weight: '30%', details: ['Chiều sâu và chất lượng phân tích', 'Tính hợp lý của các quyết định thiết kế', 'Độ dài tối thiểu 1000 từ'] },
];



const AssignmentInfo = ({ assignment }) => (
  <div className="p-6 rounded-lg border bg-red-50 border-red-200">
    <div className="flex justify-between items-start">
      <div className="flex items-start">
        <AlertTriangle className="w-6 h-6 text-red-500 mr-4 mt-1 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-lg text-gray-800">{assignment.title}</h3>
          <p className="text-sm text-gray-600">{assignment.description}</p>
        </div>
      </div>
      <div className="px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-700">
        Sắp hết hạn
      </div>
    </div>
    <div className="flex items-center space-x-6 text-sm text-gray-600 mt-4 ml-10">
      <div className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" />Deadline: <span className="font-semibold ml-1">{assignment.deadline}</span><span className="text-red-600 ml-2">{assignment.timeLeft}</span></div>
      <div className="flex items-center"><BarChart2 className="w-4 h-4 mr-1.5" />Trọng số: <span className="font-semibold ml-1">{assignment.weight}</span></div>
    </div>
    <div className="mt-4 ml-10 pt-4 border-t border-red-200">
      <p className="font-semibold mb-2">Mô tả chi tiết:</p>
      <p className="text-sm text-gray-700 mb-4">{assignment.details}</p>
      <div className="flex items-center space-x-3">
        <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 text-sm"><FileText className="w-4 h-4 mr-2" />Xem chi tiết</button>
        <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 text-sm"><Download className="w-4 h-4 mr-2" />Tải file đính kèm</button>
      </div>
    </div>
  </div>
);

const GradingCriteria = ({ criteria }) => (
  <div className="p-6 rounded-lg border bg-blue-50 border-blue-200">
    <div className="flex items-center mb-4">
        <Info className="w-6 h-6 text-blue-600 mr-3"/>
        <h3 className="font-bold text-lg text-gray-800">Tiêu chí chấm điểm</h3>
    </div>
    <div className="space-y-4">
        {criteria.map((item, index) => (
            <div key={index} className="flex justify-between items-start p-3 bg-white rounded-md">
                <div>
                    <p className="font-semibold">{item.title}</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                        {item.details.map((detail, i) => <li key={i}>{detail}</li>)}
                    </ul>
                </div>
                <div className="font-bold text-blue-600 text-lg">{item.weight}</div>
            </div>
        ))}
    </div>
  </div>
);

const SubmissionStatus = () => (
    <div className="p-6 rounded-lg border bg-green-50 border-green-200">
        <div className="flex items-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600 mr-3"/>
            <h3 className="font-bold text-lg text-gray-800">Bài đã nộp thành công</h3>
        </div>
        <div className="text-sm text-gray-600 mb-4">
            <p>Nộp lúc: 24/12/2024 - 15:30</p>
            <p>Định dạng: PDF, 2.4 MB</p>
        </div>
        <div className="flex justify-end space-x-3 mb-4">
            <button className="px-4 py-2 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-600 text-sm flex items-center"><Eye className="w-4 h-4 mr-2"/>Xem bài</button>
            <button className="px-4 py-2 bg-white border border-gray-300 font-semibold rounded-md hover:bg-gray-50 text-sm flex items-center"><Download className="w-4 h-4 mr-2"/>Tải xuống</button>
        </div>
        <div className="space-y-3">
             <div className="flex items-center justify-between p-3 bg-white rounded-md border">
                 <div className="flex items-center text-sm">
                    <File className="w-5 h-5 mr-3 text-gray-500"/>
                    <span className="font-medium text-gray-800">mobile_ui_design_final.pdf</span>
                 </div>
             </div>
             <div className="flex items-center justify-between p-3 bg-white rounded-md border">
                 <div className="flex items-center text-sm">
                    <ExternalLink className="w-5 h-5 mr-3 text-gray-500"/>
                    <a href="#" className="font-medium text-blue-600 hover:underline">https://figma.com/design/abc123</a>
                 </div>
                 <ExternalLink className="w-4 h-4 text-gray-500 cursor-pointer"/>
             </div>
        </div>
    </div>
);

const SubmissionPanel = () => {
    const [submitted, setSubmitted] = useState(true);

    return (
        <div className="space-y-6">
            <div className="p-6 rounded-lg border bg-white">
                 <div className="flex items-start">
                    <BookOpen className="w-6 h-6 text-blue-600 mr-4 mt-1"/>
                    <div>
                        <h4 className="font-bold text-lg">Xem hướng dẫn nộp bài</h4>
                        <p className="text-sm text-gray-600 mt-1">Hướng dẫn chi tiết về cách thức nộp bài, định dạng file và yêu cầu cần thiết cho assignment này.</p>
                        <button className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 text-sm flex items-center"><Eye className="w-4 h-4 mr-2"/>Xem hướng dẫn</button>
                    </div>
                </div>
            </div>

            <div className={`p-6 rounded-lg border ${submitted ? 'bg-green-50' : 'bg-white'}`}>
                <div className="flex items-start">
                    {submitted ? <CheckCircle className="w-6 h-6 text-green-600 mr-4 mt-1"/> : <Upload className="w-6 h-6 text-gray-600 mr-4 mt-1"/>}
                    <div>
                         <h4 className="font-bold text-lg">{submitted ? 'Đã nộp thành công' : 'Nộp bài'}</h4>
                         <p className="text-sm text-gray-600 mt-1">
                            {submitted ? 'Bạn có thể nộp lại để cập nhật bài làm' : 'Upload file bài làm của bạn. Hỗ trợ PDF, DOC, ZIP (tối đa 50MB). Có thể nộp lại nhiều lần.'}
                         </p>
                         <button className={`mt-4 px-4 py-2 text-white font-semibold rounded-md text-sm flex items-center ${submitted ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                            <RefreshCw className="w-4 h-4 mr-2"/>Nộp lại bài
                         </button>
                    </div>
                </div>
            </div>

            <div className="p-6 rounded-lg border bg-orange-50">
                <div className="flex items-start">
                    <Users className="w-6 h-6 text-orange-600 mr-4 mt-1"/>
                    <div>
                        <div className="flex justify-between items-center">
                            <h4 className="font-bold text-lg">Chấm chéo bất kì</h4>
                            <span className="px-2 py-0.5 text-xs font-semibold bg-orange-200 text-orange-800 rounded-full">Bắt buộc</span>
                        </div>
                         <p className="text-sm text-gray-600 mt-1">Chấm và đánh giá bài làm của đồng môn. Sinh viên cần chấm tối thiểu 2 bài.</p>
                         <p className="text-sm font-semibold mt-2">Đã chấm: 1/2 bài <span className="font-normal text-gray-600">| Còn lại: 1 bài</span></p>
                         <button className="mt-4 px-4 py-2 text-white font-semibold rounded-md text-sm flex items-center bg-orange-500 hover:bg-orange-600">
                            <Users className="w-4 h-4 mr-2"/>Chấm bài ngẫu nhiên
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Trang Chính ---

const StudentSubmitAssignmentPage = () => {
    const { courseId, assignmentId } = useParams();

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
       
                <div className="mb-6 flex items-center text-sm text-gray-600">
                    <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                    <ChevronRight className="w-4 h-4 mx-1" />
                    <Link to="/my-assignments" className="hover:underline">Assignment của tôi</Link>
                    <ChevronRight className="w-4 h-4 mx-1" />
                    <Link to={`/assignment/${courseId}`} className="hover:underline">{course.code}</Link>
                    <ChevronRight className="w-4 h-4 mx-1" />
                    <span className="font-semibold text-gray-800">{assignment.title}</span>
                </div>
                
 
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <p className="text-blue-600 font-semibold">{course.code}</p>
                        <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
                        <div className="flex items-center text-gray-500 mt-2">
                            <span>{course.instructor}</span>
                        </div>
                    </div>
                     <div className="flex items-center px-3 py-1 text-sm font-semibold bg-green-100 text-green-700 rounded-full">
                        <CheckCircle size={14} className="mr-1.5" />
                        Đã tham gia
                    </div>
                </div>

     
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
   
                    <div className="lg:col-span-2 space-y-6">
                        <AssignmentInfo assignment={assignment} />
                        <GradingCriteria criteria={gradingCriteria} />
                        <SubmissionStatus />
                    </div>


                    <div className="lg:col-span-1">
                       <SubmissionPanel />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentSubmitAssignmentPage;