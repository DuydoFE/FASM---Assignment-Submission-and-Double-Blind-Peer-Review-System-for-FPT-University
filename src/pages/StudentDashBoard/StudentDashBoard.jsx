import React from 'react';
// 👉 1. Import useSelector và selectUser
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/features/userSlice'; //  <== Hãy chắc chắn đường dẫn này đúng với cấu trúc dự án của bạn

import { ChevronRight, Upload, FileText, Calendar, CheckCircle, MessageSquare, Clock, Bell } from 'lucide-react';
import AssignmentCard from '../../component/MiniDashBoard/AssignmentCard';
import CourseCard from '../../component/MiniDashBoard/CourseCard';

const StudentDashBoard = () => {
  // 👉 2. Lấy thông tin người dùng từ Redux store
  const currentUser = useSelector(selectUser);

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="p-8">

        <div className="mb-8">
          {/* 👉 3. Thay thế tên tĩnh bằng tên từ currentUser */}
          <h1 className="text-3xl font-bold text-gray-800">Welcome , {currentUser?.firstName}! </h1>
          {/* <p className="text-gray-600">Hôm nay bạn có 3 assignments cần hoàn thành và 2 thông báo mới.</p> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
   
          <div className="lg:col-span-2 space-y-8">
  
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Assignments are about to expire</h2>
                <a href="#" className="text-sm font-semibold text-orange-600 flex items-center">
                  Xem tất cả <ChevronRight className="w-4 h-4 ml-1" />
                </a>
              </div>
              <div>
                <AssignmentCard color="red" title="Mobile App Development - Final Project" subject="PRM391" dueDate="25/12/2024 23:59" remaining="2 days" />
                <AssignmentCard color="yellow" title="Database Design Report" subject="DBI202" dueDate="28/12/2024 23:59" remaining="5 days" />
                <AssignmentCard color="green" title="Software Engineering Documentation" subject="SWE201" dueDate="02/01/2025 23:59" remaining="10 days" />
              </div>
            </div>

        
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-4" />
                  <div>
                    <p className="text-gray-800">Assignment submitted: <span className="font-semibold">Web Development Lab 5</span></p>
                    <p className="text-sm text-gray-500">2 hours ago • PRN231</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <MessageSquare className="w-5 h-5 text-blue-500 mt-1 mr-4" />
                  <div>
                    <p className="text-gray-800">Get feedback from instructors <span className="font-semibold">Database Lab 3</span></p>
                    <p className="text-sm text-gray-500">5 hours ago • DBI202 • Grade: 8.5/10</p>
                  </div>
                </li>
                 <li className="flex items-start">
                  <Clock className="w-5 h-5 text-red-500 mt-1 mr-4" />
                  <div>
                    <p className="text-gray-800">Deadline reminder: <span className="font-semibold">Mobile App Final Project</span></p>
                    <p className="text-sm text-gray-500">1 day ago • PRN231</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>


          <div className="space-y-8">
            {/* Thao tác nhanh */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick action</h2>
              <div className="space-y-3">
                 <button className="w-full flex items-center justify-center p-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors">
                   <Upload className="w-5 h-5 mr-2" /> Submit new assignment
                 </button>
                 <button className="w-full flex items-center justify-center p-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                   <FileText className="w-5 h-5 mr-2" /> View scores
                 </button>
                 <button className="w-full flex items-center justify-center p-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                   <Calendar className="w-5 h-5 mr-2" /> Submission schedule
                 </button>
              </div>
            </div>


            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Peer Review</h2>
                    <Bell className="text-orange-600" />
                </div>
                <div className="space-y-3">
                    <div className="bg-red-50 p-3 rounded-lg flex items-start">
                        <div className="text-center mr-3">
                            <p className="font-bold text-red-700 text-lg">25</p>
                            <p className="text-xs text-red-600">T12</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">PRM391</p>
                            <p className="text-xs text-gray-500">PRN231 • 14:00</p>
                        </div>
                    </div>
                     <div className="bg-yellow-50 p-3 rounded-lg flex items-start">
                        <div className="text-center mr-3">
                            <p className="font-bold text-yellow-700 text-lg">28</p>
                            <p className="text-xs text-yellow-600">T12</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">Database Report Due</p>
                            <p className="text-xs text-gray-500">DBI202 • 23:59</p>
                        </div>
                    </div>
                     <div className="bg-green-50 p-3 rounded-lg h-16" />
                </div>
            </div>
          </div>
        </div>
        

        <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800">Your class</h2>
            <p className="text-gray-600 mb-4">The classes you are taking</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         
                <CourseCard title="Mobile App Development" code="PRM391" teacher="Nguyễn Văn A" students={45} campus="Hồ Chí Minh" />
                <CourseCard title="Database Design" code="DBI202" teacher="Trần Thị B" students={38} campus="Hồ Chí Minh" />
                <CourseCard title="Software Engineering" code="SWE201" teacher="Lê Văn C" students={42} campus="Hồ Chí Minh" />
            </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashBoard;