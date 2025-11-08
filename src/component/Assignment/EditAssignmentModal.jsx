import React, { useState, useEffect } from 'react';
import { X, Save, FileText, AlertCircle } from 'lucide-react';
import { getRubricTemplatesByUserId } from '../../service/rubricService';
import { toast } from 'react-toastify';
import { getCurrentAccount } from '../../utils/accountUtils';

const EditAssignmentModal = ({ isOpen, onClose, onSubmit, assignment }) => {
  const [formData, setFormData] = useState({
    assignmentId: 0,
    rubricTemplateId: '',
    title: '',
    description: '',
    guidelines: '',
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

  const [errors, setErrors] = useState({});
  const [rubrics, setRubrics] = useState([]);
  const [loadingRubrics, setLoadingRubrics] = useState(false);
  const currentUser = getCurrentAccount();

  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

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
    if (isOpen && assignment) {
      // Populate form with existing assignment data
      setFormData({
        assignmentId: assignment.assignmentId || 0,
        rubricTemplateId: assignment.rubricTemplateId || assignment.rubricId || '',
        title: assignment.title || '',
        description: assignment.description || '',
        guidelines: assignment.guidelines || '',
        startDate: assignment.startDate ? formatDateTimeLocal(assignment.startDate) : '',
        deadline: assignment.deadline ? formatDateTimeLocal(assignment.deadline) : '',
        reviewDeadline: assignment.reviewDeadline ? formatDateTimeLocal(assignment.reviewDeadline) : '',
        finalDeadline: assignment.finalDeadline ? formatDateTimeLocal(assignment.finalDeadline) : '',
        numPeerReviewsRequired: assignment.numPeerReviewsRequired || '',
        missingReviewPenalty: assignment.missingReviewPenalty || 0,
        allowCrossClass: assignment.allowCrossClass || false,
        isBlindReview: assignment.isBlindReview || false,
        instructorWeight: assignment.instructorWeight || '',
        peerWeight: assignment.peerWeight || '',
        gradingScale: assignment.gradingScale || 'Scale10',
        passThreshold: assignment.passThreshold ? String(assignment.passThreshold) : '',
        includeAIScore: assignment.includeAIScore || false
      });
      fetchRubrics();
    }
  }, [isOpen, assignment]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let newValue = value;

    if (type === 'checkbox') {
      newValue = checked;
    } else if (type === 'number') {
      newValue = value === '' ? '' : Number(value);
    } else if (name === 'rubricTemplateId') {
      newValue = value;
    } else if (name === 'passThreshold') {
      newValue = value;
    } else if (name === 'gradingScale') {
      // Reset passThreshold when changing grading scale
      setFormData(prev => ({
        ...prev,
        gradingScale: value,
        passThreshold: '' // Clear passThreshold when switching
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
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

    if (!formData.numPeerReviewsRequired || formData.numPeerReviewsRequired === '') {
      newErrors.numPeerReviewsRequired = 'Number of peer reviews is required';
    }

    // Only validate passThreshold if gradingScale is PassFail
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
      const submitData = {
        assignmentId: formData.assignmentId,
        rubricTemplateId: parseInt(formData.rubricTemplateId),
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

      // Always include passThreshold
      if (formData.gradingScale === 'PassFail') {
        submitData.passThreshold = parseFloat(formData.passThreshold);
      } else {
        submitData.passThreshold = 0;
      }

      console.log('Updating assignment:', submitData);

      await onSubmit(submitData);
      toast.success('Assignment updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating assignment:', error);
      toast.error('Failed to update assignment. Please try again.');
    }
  };

  if (!isOpen || !assignment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Assignment</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-5 bg-blue-500 rounded"></div>
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
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="Enter grading guidelines"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rubric <span className="text-gray-400">(Cannot be changed)</span>
                </label>
                {loadingRubrics ? (
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600">
                    Loading rubrics...
                  </div>
                ) : (
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700">
                    {rubrics.find(r => String(r.templateId) === String(formData.rubricTemplateId))?.title || 
                     `Rubric #${formData.rubricTemplateId}` || 
                     'No rubric selected'}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">The rubric cannot be changed after assignment creation</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-5 bg-blue-500 rounded"></div>
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
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
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                      errors.deadline ? 'border-red-500' : 'border-gray-300'
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
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                      errors.reviewDeadline ? 'border-red-500' : 'border-gray-300'
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
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                      errors.finalDeadline ? 'border-red-500' : 'border-gray-300'
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

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-5 bg-blue-500 rounded"></div>
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                        errors.passThreshold ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select pass threshold</option>
                      <option value="0">≥ 0.0</option>
                      <option value="40">≥ 4.0</option>
                      <option value="50">≥ 5.0</option>
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
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                      errors.instructorWeight ? 'border-red-500' : 'border-gray-300'
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
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                      errors.peerWeight ? 'border-red-500' : 'border-gray-300'
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

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-5 bg-blue-500 rounded"></div>
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
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                      errors.numPeerReviewsRequired ? 'border-red-500' : 'border-gray-300'
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                    className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">Allow Cross-Class Review</span>
                    <p className="text-xs text-gray-500">Students can review submissions from other classes</p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="isBlindReview"
                    checked={formData.isBlindReview}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">Blind Review</span>
                    <p className="text-xs text-gray-500">Hide student identities during peer review</p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="includeAIScore"
                    checked={formData.includeAIScore}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">Include AI Score</span>
                    <p className="text-xs text-gray-500">Use AI-assisted grading in final score calculation</p>
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
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 transition-colors"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAssignmentModal;