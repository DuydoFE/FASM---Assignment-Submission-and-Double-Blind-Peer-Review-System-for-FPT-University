import React, { useState } from 'react';
import { Plus, FileText, Clock, Lock, Calendar, X, Trash2 } from 'lucide-react';

const InstructorManageAssignment = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedGradingScale, setSelectedGradingScale] = useState('percentage');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  const [rubricCriteria, setRubricCriteria] = useState([]);

  const gradingScales = {
    '100-point': { name: 'Thang 100 điểm (0-100)', showWeight: true },
    'letter': { name: 'Thang chữ (A, B, C, D, F)', showWeight: false },
    'percentage': { name: 'Thang % (0-100%)', showWeight: true },
    'pass-fail': { name: 'Thang Pass/Fail', showWeight: false }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateCriteriaWeight = (id, weight) => {
    setRubricCriteria(prev =>
      prev.map(criteria =>
        criteria.id === id ? { ...criteria, weight: parseInt(weight) || 0 } : criteria
      )
    );
  };

  const deleteCriteria = (id) => {
    setRubricCriteria(prev => prev.filter(criteria => criteria.id !== id));
  };

  const addNewCriteria = () => {
    const newId = rubricCriteria.length > 0 ? Math.max(...rubricCriteria.map(c => c.id)) + 1 : 1;
    setRubricCriteria(prev => [...prev, {
      id: newId,
      name: '',
      description: '',
      weight: 0,
      details: ['']
    }]);
  };

  const getTotalWeight = () => {
    return rubricCriteria.reduce((sum, criteria) => sum + criteria.weight, 0);
  };

  const assignments = [
    {
      id: 1,
      title: "Lab 1: Figma Basics",
      description: "Tạo wireframe cho trang web bán hàng",
      deadline: "25/12/2024",
      time: "23:59",
      submitted: 28,
      total: 35,
      status: "Đang mở",
      statusColor: "bg-green-100 text-green-800"
    },
    {
      id: 2,
      title: "Lab 2: User Research",
      description: "Phỏng vấn người dùng và tạo persona",
      deadline: "30/12/2024",
      time: "23:59",
      submitted: 15,
      total: 35,
      status: "Đang mở",
      statusColor: "bg-green-100 text-green-800"
    },
    {
      id: 3,
      title: "Assignment 1: Prototype",
      description: "Tạo prototype tương tác với Figma",
      deadline: "20/12/2024",
      time: "23:59",
      submitted: 35,
      total: 35,
      status: "Đã đóng",
      statusColor: "bg-red-100 text-red-800"
    },
    {
      id: 4,
      title: "Final Project",
      description: "Dự án cuối khóa - Thiết kế app hoàn chỉnh",
      deadline: "10/01/2025",
      time: "23:59",
      submitted: 2,
      total: 35,
      status: "Đang mở",
      statusColor: "bg-green-100 text-green-800"
    }
  ];

  const getDeadlineColor = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline.split('/').reverse().join('-'));
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "text-red-500";
    if (diffDays <= 3) return "text-orange-500";
    return "text-gray-900";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Assignment</h1>
          <div className="flex items-center space-x-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              WDU391
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              SE17TB
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowPopup(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Tạo Assignment</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Tổng Assignment</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">4</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Đang mở</p>
              <p className="text-3xl font-bold text-green-600 mt-1">3</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Đã đóng</p>
              <p className="text-3xl font-bold text-red-600 mt-1">1</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <Lock className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-12 gap-6 px-8 py-5 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
          <div className="col-span-4">Tên Assignment</div>
          <div className="col-span-2 text-center">Deadline</div>
          <div className="col-span-2 text-center">Nộp bài</div>
          <div className="col-span-2 text-center">Trạng thái</div>
          <div className="col-span-2 text-center">Thao tác</div>
        </div>

        {assignments.map((assignment) => (
          <div key={assignment.id} className="grid grid-cols-12 gap-6 px-8 py-8 border-b border-gray-100 hover:bg-gray-50 items-center transition-colors">
            <div className="col-span-4 space-y-2">
              <h3 className="font-semibold text-gray-900 text-base">{assignment.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{assignment.description}</p>
            </div>

            <div className="col-span-2 text-center space-y-1">
              <div className={`font-medium text-base ${getDeadlineColor(assignment.deadline)}`}>
                {assignment.deadline}
              </div>
              <div className="text-sm text-gray-500">{assignment.time}</div>
            </div>

            <div className="col-span-2 text-center">
              <div className="font-bold text-lg text-gray-900">
                {assignment.submitted}/{assignment.total}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round((assignment.submitted / assignment.total) * 100)}% hoàn thành
              </div>
            </div>

            <div className="col-span-2 flex justify-center">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${assignment.statusColor} flex items-center space-x-2`}>
                {assignment.status === "Đang mở" ? (
                  <Clock className="w-4 h-4" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                <span>{assignment.status}</span>
              </span>
            </div>

            <div className="col-span-2 flex justify-center items-center space-x-3">
              <button className="text-blue-600 hover:text-blue-800 p-3 hover:bg-blue-50 rounded-lg transition-colors">
                <Calendar className="w-5 h-5" />
              </button>
              <button className="text-green-600 hover:text-green-800 p-3 hover:bg-green-50 rounded-lg transition-colors">
                <FileText className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Assignment Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Popup Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <Plus className="w-5 h-5 text-gray-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Tạo bài tập mới</h2>
              </div>
              <div className="flex items-center space-x-3">
                <button className="text-gray-500 hover:text-gray-700 text-sm">
                  Lưu nháp
                </button>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Tạo
                </button>
                <button
                  onClick={() => setShowPopup(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Basic Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên bài tập <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Nhập tên bài tập..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Mô tả chi tiết về bài tập, yêu cầu và hướng dẫn thực hiện..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hạn nộp <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tài liệu <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        onChange={(e) => handleInputChange('file', e.target.files[0])}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Grading Scale Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tiêu chí thang điểm (Rubric)</h3>

                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-blue-800 font-medium mb-3">Chọn loại thang điểm cho rubric:</p>
                  <div className="space-y-2">
                    {Object.entries(gradingScales).map(([key, scale]) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="radio"
                          name="gradingScale"
                          value={key}
                          checked={selectedGradingScale === key}
                          onChange={(e) => setSelectedGradingScale(e.target.value)}
                          className="mr-3 text-orange-500"
                        />
                        <span className="text-sm text-blue-800">{scale.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rubric Criteria */}
                <div className="space-y-6">
                  {(selectedGradingScale === '100-point' || selectedGradingScale === 'percentage') && (
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Tiêu chí đánh giá</h4>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                          Tổng kết tỷ trọng: <span className={`font-medium ${getTotalWeight() === 100 ? 'text-green-600' : 'text-orange-600'}`}>
                            {getTotalWeight()}{selectedGradingScale === '100-point' ? ' điểm' : '%'}
                          </span>
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getTotalWeight() === 100 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                          {getTotalWeight() === 100 ?
                            (selectedGradingScale === '100-point' ? '100 điểm' : '100%') :
                            getTotalWeight() < 100 ?
                              `${100 - getTotalWeight()}${selectedGradingScale === '100-point' ? ' điểm' : '%'} còn lại` :
                              `Vượt quá 100${selectedGradingScale === '100-point' ? ' điểm' : '%'}`
                          }
                        </span>
                      </div>
                    </div>
                  )}

                  {(selectedGradingScale === 'letter' || selectedGradingScale === 'pass-fail') && (
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Tiêu chí đánh giá</h4>
                      <span className="text-sm text-gray-500">Không sử dụng tỷ trọng điểm</span>
                    </div>
                  )}

                  {rubricCriteria.map((criteria, index) => (
                    <div key={criteria.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">
                              {index + 1}
                            </span>
                            <input
                              type="text"
                              value={criteria.name}
                              onChange={(e) => {
                                setRubricCriteria(prev =>
                                  prev.map(c =>
                                    c.id === criteria.id ? { ...c, name: e.target.value } : c
                                  )
                                );
                              }}
                              placeholder="Tên tiêu chí đánh giá"
                              className="flex-1 font-medium text-gray-900 bg-transparent border-none p-0 focus:ring-0"
                            />
                            {(selectedGradingScale === '100-point' || selectedGradingScale === 'percentage') && (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  value={criteria.weight}
                                  onChange={(e) => updateCriteriaWeight(criteria.id, e.target.value)}
                                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                                  min="0"
                                  max="100"
                                />
                                {selectedGradingScale === 'percentage' && (
                                  <span className="text-sm text-gray-500">%</span>
                                )}
                              </div>
                            )}
                          </div>
                          <input
                            type="text"
                            value={criteria.description}
                            onChange={(e) => {
                              setRubricCriteria(prev =>
                                prev.map(c =>
                                  c.id === criteria.id ? { ...c, description: e.target.value } : c
                                )
                              );
                            }}
                            placeholder="Mô tả chi tiết về tiêu chí này"
                            className="w-full text-sm text-gray-600 bg-transparent border-none p-0 focus:ring-0"
                          />
                        </div>
                        <button
                          onClick={() => deleteCriteria(criteria.id)}
                          className="text-red-500 hover:text-red-700 p-1 ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        {criteria.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center space-x-2">
                            <span className="text-gray-400">•</span>
                            <input
                              type="text"
                              value={detail}
                              onChange={(e) => {
                                setRubricCriteria(prev =>
                                  prev.map(c =>
                                    c.id === criteria.id
                                      ? {
                                        ...c,
                                        details: c.details.map((d, i) =>
                                          i === detailIndex ? e.target.value : d
                                        )
                                      }
                                      : c
                                  )
                                );
                              }}
                              placeholder="Chi tiết yêu cầu"
                              className="flex-1 text-sm text-gray-700 bg-transparent border-none p-0 focus:ring-0"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addNewCriteria}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-orange-300 hover:text-orange-500 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Thêm tiêu chí đánh giá mới</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorManageAssignment;