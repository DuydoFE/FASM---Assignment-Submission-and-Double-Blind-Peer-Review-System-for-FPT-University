import React, { useState, useEffect } from 'react';
import { X, Plus, FileText, AlertCircle, Upload, File } from 'lucide-react';
import { getRubricTemplatesByUserId } from '../../service/rubricService';
import { toast } from 'react-toastify';
import { getCurrentAccount } from '../../utils/accountUtils';

const CreateAssignmentModal = ({ isOpen, onClose, onSubmit, courseInstanceId }) => {
  const [formData, setFormData] = useState({
    courseInstanceId: courseInstanceId || 0,
    rubricTemplateId: '',
    title: '',
    description: '',
    guidelines: '',
    files: null,
    startDate: '',
    deadline: '',
    reviewDeadline: '',
    finalDeadline: '',
    numPeerReviewsRequired: '',
    missingReviewPenalty: '',
    allowCrossClass: false,
    instructorWeight: '',
    peerWeight: '',
    gradingScale: 'Scale10',
    passThreshold: '',
  });

  const [errors, setErrors] = useState({});
  const [rubrics, setRubrics] = useState([]);
  const [loadingRubrics, setLoadingRubrics] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const currentUser = getCurrentAccount();


  const fetchRubrics = async () => {
    setLoadingRubrics(true);
    try {
      const data = await getRubricTemplatesByUserId(currentUser.id);
      if (data && data.length > 0) {
        setRubrics(data);
      } else {
        setRubrics([]);
      }
    } catch (error) {
      console.error('Error fetching rubrics:', error);
      setRubrics([]);
      toast.error('Failed to load rubrics');
    } finally {
      setLoadingRubrics(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRubrics();
    }
  }, [isOpen]);

  // 🔥 FIXED HANDLECHANGE
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let newValue = value;

    if (type === 'checkbox') {
      newValue = checked;
    }

    else if (type === 'number') {

      if (name === "numPeerReviewsRequired") {
        if (value === "") {
          newValue = "";
        } else {
          let num = Number(value);
          if (num < 1) num = 1;
          if (num > 10) num = 10;
          num = Math.floor(num);
          newValue = num;
        }
      }

      else if (name === "missingReviewPenalty") {
        if (value === "") {
          newValue = "";
        } else {
          let num = Number(value);
          if (num < 0) num = 0;
          if (num > 10) num = 10;
          num = Math.floor(num);
          newValue = num;
        }
      }

      // Other numeric inputs
      else {
        newValue = value === "" ? "" : Number(value);
      }
    }

    else if (name === 'rubricTemplateId') {
      newValue = value;
    } 
    
    else if (name === 'passThreshold') {
      newValue = value;
    }

    else if (name === 'gradingScale') {
      setFormData(prev => ({
        ...prev,
        gradingScale: value,
        passThreshold: ''
      }));
      if (errors.passThreshold) {
        setErrors(prev => ({ ...prev, passThreshold: '' }));
      }
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFormData(prev => ({ ...prev, files: file }));
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFormData(prev => ({ ...prev, files: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    const now = new Date();

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.rubricTemplateId || formData.rubricTemplateId === '' || formData.rubricTemplateId === 'null') {
      newErrors.rubricTemplateId = 'Please select a rubric';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    }

    if (!formData.reviewDeadline) {
      newErrors.reviewDeadline = 'Review deadline is required';
    }

    if (!formData.finalDeadline) {
      newErrors.finalDeadline = 'Final deadline is required';
    }

    const startDate = formData.startDate ? new Date(formData.startDate) : null;
    const deadline = formData.deadline ? new Date(formData.deadline) : null;
    const reviewDeadline = formData.reviewDeadline ? new Date(formData.reviewDeadline) : null;
    const finalDeadline = formData.finalDeadline ? new Date(formData.finalDeadline) : null;

    if (startDate && !isNaN(startDate.getTime()) && startDate <= now) {
      newErrors.startDate = 'Start date must be in the future';
    }

    if (deadline && !isNaN(deadline.getTime())) {
      if (deadline <= now) {
        newErrors.deadline = 'Deadline must be in the future';
      } else if (startDate && deadline <= startDate) {
        newErrors.deadline = 'Deadline must be after start date';
      }
    }

    if (reviewDeadline && !isNaN(reviewDeadline.getTime())) {
      if (reviewDeadline <= now) {
        newErrors.reviewDeadline = 'Review deadline must be in the future';
      } else if (deadline && reviewDeadline <= deadline) {
        newErrors.reviewDeadline = 'Review deadline must be after submission deadline';
      }
    }

    if (finalDeadline && !isNaN(finalDeadline.getTime())) {
      if (finalDeadline <= now) {
        newErrors.finalDeadline = 'Final deadline must be in the future';
      } else if (reviewDeadline && finalDeadline <= reviewDeadline) {
        newErrors.finalDeadline = 'Final deadline must be after review deadline';
      }
    }

    if (!formData.numPeerReviewsRequired || formData.numPeerReviewsRequired === '') {
      newErrors.numPeerReviewsRequired = 'Number of peer reviews is required';
    }

    if (formData.gradingScale === 'PassFail') {
      if (formData.passThreshold === '' || !formData.passThreshold) {
        newErrors.passThreshold = 'Please select a pass threshold';
      }
    }

    const totalWeight = Number(formData.instructorWeight || 0) + Number(formData.peerWeight || 0);
    if (totalWeight !== 100) {
      newErrors.instructorWeight = 'Instructor and Peer weights must add up to 100%';
      newErrors.peerWeight = 'Instructor and Peer weights must add up to 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const rubricId = parseInt(formData.rubricTemplateId);

      if (!rubricId || isNaN(rubricId)) {
        toast.error('Please select a valid rubric');
        return;
      }

      const submitData = {
        courseInstanceId: parseInt(courseInstanceId),
        rubricTemplateId: rubricId,
        title: formData.title,
        description: formData.description || null,
        guidelines: formData.guidelines || null,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        deadline: new Date(formData.deadline).toISOString(),
        reviewDeadline: new Date(formData.reviewDeadline).toISOString(),
        finalDeadline: new Date(formData.finalDeadline).toISOString(),
        numPeerReviewsRequired: parseInt(formData.numPeerReviewsRequired),
        missingReviewPenalty: parseInt(formData.missingReviewPenalty) || 0,
        allowCrossClass: formData.allowCrossClass,
        isBlindReview: formData.isBlindReview,
        instructorWeight: parseInt(formData.instructorWeight),
        peerWeight: parseInt(formData.peerWeight),
        gradingScale: formData.gradingScale,
        includeAIScore: formData.includeAIScore
      };

      if (formData.gradingScale === 'PassFail') {
        submitData.passThreshold = parseFloat(formData.passThreshold);
      } else {
        submitData.passThreshold = 0;
      }

      console.log('Submitting data:', submitData);

      await onSubmit(submitData, selectedFile);

      setFormData({
        courseInstanceId: courseInstanceId || 0,
        rubricTemplateId: '',
        title: '',
        description: '',
        guidelines: '',
        files: null,
        startDate: '',
        deadline: '',
        reviewDeadline: '',
        finalDeadline: '',
        numPeerReviewsRequired: '',
        missingReviewPenalty: 0,
        allowCrossClass: false,
        isBlindReview: false,
        instructorWeight: '',
        peerWeight: '',
        gradingScale: 'Scale10',
        passThreshold: '',
        includeAIScore: false
      });
      setSelectedFile(null);
      setErrors({});

      onClose();
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast.error('Failed to create assignment. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Create New Assignment</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            
            {/* BASIC INFORMATION */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-5 bg-orange-500 rounded"></div>
                Basic Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter assignment title"
                />
                {errors.title && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.title}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                  placeholder="Enter assignment description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guidelines
                </label>
                <textarea
                  name="guidelines"
                  value={formData.guidelines}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                  placeholder="Enter grading guidelines"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rubric <span className="text-red-500">*</span>
                </label>
                {loadingRubrics ? (
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    Loading rubrics...
                  </div>
                ) : (
                  <select
                    name="rubricTemplateId"
                    value={formData.rubricTemplateId}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${errors.rubricTemplateId ? 'border-red-500' : 'border-gray-300'
                      }`}
                  >
                    <option value="">Select a rubric</option>
                    {rubrics.map((rubric) => (
                      <option key={rubric.templateId} value={String(rubric.templateId)}>
                        {rubric.title || `Rubric #${rubric.templateId}`}
                      </option>
                    ))}
                  </select>
                )}
                {errors.rubricTemplateId && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.rubricTemplateId}</span>
                  </div>
                )}
              </div>

              {/* FILE UPLOAD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document <span className="text-gray-400">(Optional)</span>
                </label>
                {!selectedFile ? (
                  <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-600">Click to upload file</span>
                      <span className="text-xs text-gray-400">PDF, DOC, DOCX, PPT, PPTX</span>
                    </div>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                    />
                  </label>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <File className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* IMPORTANT DATES */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-5 bg-orange-500 rounded"></div>
                Important Dates
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                  {errors.startDate && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.startDate}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deadline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${errors.deadline ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.deadline && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.deadline}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Deadline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="reviewDeadline"
                    value={formData.reviewDeadline}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${errors.reviewDeadline ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.reviewDeadline && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.reviewDeadline}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Final Deadline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="finalDeadline"
                    value={formData.finalDeadline}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${errors.finalDeadline ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.finalDeadline && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.finalDeadline}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* GRADING */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-5 bg-orange-500 rounded"></div>
                Grading Configuration
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grading Scale <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gradingScale"
                    value={formData.gradingScale}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  >
                    <option value="Scale10">Scale 10</option>
                    <option value="PassFail">Pass/Fail</option>
                  </select>
                </div>

                {formData.gradingScale === 'PassFail' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pass Threshold <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="passThreshold"
                      value={formData.passThreshold}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${errors.passThreshold ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                      <option value="">Select pass threshold</option>
                      <option value="0">≥ 0.0</option>
                      <option value="4">≥ 4.0</option>
                      <option value="5">≥ 5.0</option>
                    </select>
                    {errors.passThreshold && (
                      <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.passThreshold}</span>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructor Weight (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="instructorWeight"
                    value={formData.instructorWeight}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${errors.instructorWeight ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.instructorWeight && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.instructorWeight}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peer Weight (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="peerWeight"
                    value={formData.peerWeight}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${errors.peerWeight ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.peerWeight && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.peerWeight}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* REVIEW SETTINGS */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-5 bg-orange-500 rounded"></div>
                Review Settings
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Peer Reviews Required <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="numPeerReviewsRequired"
                    value={formData.numPeerReviewsRequired}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${errors.numPeerReviewsRequired ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.numPeerReviewsRequired && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.numPeerReviewsRequired}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Missing Review Penalty <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    name="missingReviewPenalty"
                    value={formData.missingReviewPenalty}
                    onChange={handleChange}
                    min="0"
                    max="10"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="allowCrossClass"
                    checked={formData.allowCrossClass}
                    onChange={handleChange}
                    className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 group-hover:text-orange-600">Allow Cross-Class Review</span>
                    <p className="text-xs text-gray-500">Students can review submissions from other classes</p>
                  </div>
                </label>
              </div>
            </div>

          </div>
        </div>

        <div className="border-t border-gray-200 p-6 bg-gray-50 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Assignment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAssignmentModal;
