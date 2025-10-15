import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Pencil, Trash2, Loader } from 'lucide-react';
import { getAllRubrics, updateRubric } from '../../service/rubricService';
import { toast } from 'react-toastify';

const InstructorManageRubric = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rubrics, setRubrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRubric, setEditingRubric] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    const fetchRubrics = async () => {
      try {
        setLoading(true);
        const data = await getAllRubrics();
        
        const formattedRubrics = data.map(rubric => ({
          ...rubric,
          id: rubric.id, 
          rubricId: rubric.rubricId || rubric.id, 
          title: rubric.title,
          criteriaCount: rubric.criteriaCount || rubric.criteria?.length || 0,
          createdDate: rubric.createdDate || new Date().toISOString()
        }));
        
        setRubrics(formattedRubrics);
      } catch (error) {
        console.error('Failed to fetch rubrics:', error);
        toast.error('Failed to load rubrics');
      } finally {
        setLoading(false);
      }
    };

    fetchRubrics();
  }, []);

  const templates = [
    {
      title: 'Chuẩn học thuật',
      subtitle: '8 tiêu chí đánh giá',
      tag: 'Software Engineer',
      tagColor: 'bg-blue-100 text-blue-600',
      criteria: [
        'Kiến thức chuyên môn',
        'Kỹ năng thực hành',
        'Tư duy phân biện',
        'Giao tiếp và trình bày'
      ]
    },
    {
      title: 'Thiết kế UI/UX',
      subtitle: '12 tiêu chí đánh giá',
      tag: 'Graphic Design',
      tagColor: 'bg-blue-100 text-blue-600',
      criteria: [
        'Nguyên lý thiết kế',
        'Tính thẩm mỹ',
        'Trải nghiệm người dùng',
        'Tính tương tác'
      ]
    },
    {
      title: 'Lập trình',
      subtitle: '10 tiêu chí đánh giá',
      tag: 'Software Engineer',
      tagColor: 'bg-blue-100 text-blue-600',
      criteria: [
        'Logic và thuật toán',
        'Chất lượng code',
        'Kiểm thử và debug',
        'Documentation'
      ]
    },
    {
      title: 'Kỹ năng mềm',
      subtitle: '6 tiêu chí đánh giá',
      tag: 'Soft Skills',
      tagColor: 'bg-purple-100 text-purple-600',
      criteria: [
        'Làm việc nhóm',
        'Giao tiếp hiệu quả',
        'Tư duy sáng tạo',
        'Lãnh đạo'
      ]
    }
  ];

  const filteredRubrics = rubrics.filter(rubric => 
    rubric.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditClick = (rubric) => {
    setEditingRubric(rubric);
    setEditTitle(rubric.title);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    const trimmedNewTitle = editTitle.trim();

    if (!trimmedNewTitle) {
      toast.error('Title cannot be empty');
      return;
    }

    if (!editingRubric?.rubricId) {
      toast.error('Could not identify rubric');
      return;
    }

   
    if (trimmedNewTitle === editingRubric.title.trim()) {
      toast.info('No changes made to the title');
      setIsEditModalOpen(false);
      setEditingRubric(null);
      setEditTitle('');
      return;
    }

    try {
      await updateRubric(editingRubric.rubricId, { title: trimmedNewTitle });
      
      setRubrics(rubrics.map(r => 
        r.rubricId === editingRubric.rubricId ? { ...r, title: editTitle.trim() } : r
      ));
      
      toast.success('Rubric updated successfully');
      setIsEditModalOpen(false);
      setEditingRubric(null);
      setEditTitle('');
    } catch (error) {
      console.error('Failed to update rubric:', error);
      toast.error(error.response?.data?.message || 'Failed to update rubric');
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingRubric(null);
    setEditTitle('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Quản lý Rubric đánh giá</h1>
          <p className="text-gray-600">Tạo và quản lý các rubric đánh giá cho môn học</p>
        </div>

        {/* Search and Create Button */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm rubric..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors">
            <Plus className="w-5 h-5" />
            Tạo Rubric
          </button>
        </div>

        {/* Template Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Template Rubric có sẵn</h2>
          <p className="text-gray-600 mb-6">Chọn template phù hợp để tạo rubric nhanh chóng</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{template.title}</h3>
                  <p className="text-sm text-gray-500">{template.subtitle}</p>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${template.tagColor}`}>
                  {template.tag}
                </span>
                <ul className="space-y-2">
                  {template.criteria.map((criterion, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      {criterion}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* My Rubrics Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Rubric của tôi</h2>
          <p className="text-gray-600 mb-6">Các rubric đã tạo và đang sử dụng</p>
          
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700 text-sm">
              <div className="col-span-5">Title</div>
              <div className="col-span-2">Total Criteria</div>
              <div className="col-span-3">Created Date</div>
              <div className="col-span-2">Actions</div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="px-6 py-8 text-center">
                <Loader className="w-6 h-6 animate-spin mx-auto mb-2 text-orange-500" />
                <p className="text-gray-500">Loading rubrics...</p>
              </div>
            ) : filteredRubrics.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-gray-500">No rubrics found</p>
              </div>
            ) : (
              /* Table Rows */
              filteredRubrics.map((rubric, index) => (
                <div key={rubric.rubricId} className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-gray-200 hover:bg-gray-50 transition-colors items-center">
                  <div className="col-span-5">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {rubric.title}
                    </h3>
                    <div className="text-xs text-gray-500">ID: {rubric.rubricId}</div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-2xl text-base text-gray-900">
                      {rubric.criteriaCount || 0}
                    </span>
                  </div>
                  <div className="col-span-3">
                    <span className="text-sm text-gray-600">
                      {new Date(rubric.createdDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="col-span-2 flex gap-2">
                    <button 
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                      title="View"
                      onClick={() => console.log('View rubric:', rubric.id)}
                    >
                      <Eye className="w-5 h-5 text-gray-600" />
                    </button>
                    <button 
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                      title="Edit"
                      onClick={() => handleEditClick(rubric)}
                    >
                      <Pencil className="w-5 h-5 text-gray-600" />
                    </button>
                    <button 
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors" 
                      title="Delete"
                      onClick={() => console.log('Delete rubric:', rubric.id)}
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Rubric Title</h3>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rubric Title
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter rubric title"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={!editTitle.trim()}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorManageRubric;