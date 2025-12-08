import React, { useState, useEffect } from 'react';
import { X, Save, FileText, AlertCircle } from 'lucide-react';
import { getRubricTemplatesByUserId } from '../../service/rubricService';
import { toast } from 'react-toastify';
import { getCurrentAccount } from '../../utils/accountUtils';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
    missingReviewPenalty: '',
    allowCrossClass: false,
    crossClassTag: '',
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
  const [uploadedFile, setUploadedFile] = useState(null);
  const [initialFormData, setInitialFormData] = useState(null);
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
      const initialData = {
        assignmentId: assignment.assignmentId || 0,
        rubricTemplateId: assignment.rubricTemplateId || assignment.rubricId || '',
        title: assignment.title || '',
        description: assignment.description || '',
        guidelines: assignment.guidelines || '',
        startDate: assignment.startDate ? formatDateTimeLocal(assignment.startDate) : '',
        deadline: assignment.deadline ? formatDateTimeLocal(assignment.deadline) : '',
        reviewDeadline: assignment.reviewDeadline ? formatDateTimeLocal(assignment.reviewDeadline) : '',
        finalDeadline: assignment.finalDeadline ? formatDateTimeLocal(assignment.finalDeadline) : '',
        numPeerReviewsRequired: assignment.numPeerReviewsRequired !== undefined && assignment.numPeerReviewsRequired !== null
          ? String(assignment.numPeerReviewsRequired)
          : '',
        missingReviewPenalty:
          assignment.missingReviewPenalty === 0
            ? '0'
            : assignment.missingReviewPenalty
              ? String(assignment.missingReviewPenalty)
              : '',
        allowCrossClass: assignment.allowCrossClass || false,
        crossClassTag: assignment.crossClassTag || '',
        isBlindReview: assignment.isBlindReview || false,
        instructorWeight: assignment.instructorWeight !== undefined && assignment.instructorWeight !== null
          ? String(assignment.instructorWeight)
          : '',
        peerWeight: assignment.peerWeight !== undefined && assignment.peerWeight !== null
          ? String(assignment.peerWeight)
          : '',
        gradingScale: assignment.gradingScale || 'Scale10',
        passThreshold: assignment.passThreshold !== undefined && assignment.passThreshold !== null
          ? String(assignment.passThreshold)
          : '',
        includeAIScore: assignment.includeAIScore || false
      };
      setFormData(initialData);
      setInitialFormData(initialData);
      setUploadedFile(null);
      fetchRubrics();
    }
  }, [isOpen, assignment]);

  // REPLACED handleChange – same behavior as Create version:
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
          if (isNaN(num)) {
            newValue = "";
          } else {
            if (num < 1) num = 1;
            if (num > 10) num = 10;
            num = Math.floor(num);
            newValue = String(num);
          }
        }
      }

      else if (name === "missingReviewPenalty") {
        if (value === "") {
          newValue = "";
        } else {
          let num = Number(value);
          if (isNaN(num)) {
            newValue = "";
          } else {
            if (num < 1) num = 1;
            if (num > 10) num = 10;
            num = Math.floor(num);
            newValue = String(num);
          }
        }
      }

      else {
        newValue = value === "" ? "" : String(Number(value));
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
      setUploadedFile(file);
    }
  };

  // Get current time to prevent past dates/times
  const now = new Date();

  const handleDateTimeChange = (name, date) => {
    if (date) {
      // Format without UTC conversion to preserve local time
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const isoString = `${year}-${month}-${day}T${hours}:${minutes}`;
      
      setFormData(prev => ({
        ...prev,
        [name]: isoString
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Check if form data has changed
  const hasFormChanged = () => {
    if (!initialFormData) return false;
    if (uploadedFile) return true; // If file is uploaded, consider as changed
    
    // Compare all form fields
    return JSON.stringify(formData) !== JSON.stringify(initialFormData);
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
    } else {
      const num = Number(formData.numPeerReviewsRequired);
      if (isNaN(num) || num < 1 || num > 10) {
        newErrors.numPeerReviewsRequired = 'Number of peer reviews must be between 1 and 10';
      }
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

    // missingReviewPenalty validation (required)
    if (!formData.missingReviewPenalty || formData.missingReviewPenalty === '') {
      newErrors.missingReviewPenalty = 'Missing review penalty is required';
    } else {
      const mp = Number(formData.missingReviewPenalty);
      if (isNaN(mp) || mp < 1 || mp > 10) {
        newErrors.missingReviewPenalty = 'Missing review penalty must be between 1 and 10';
      }
    }

    // crossClassTag validation (required when allowCrossClass is true)
    if (formData.allowCrossClass && !formData.crossClassTag.trim()) {
      newErrors.crossClassTag = 'Cross-class tag is required when cross-class review is enabled';
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
        crossClassTag: formData.allowCrossClass ? formData.crossClassTag : '',
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

      console.log('Updating assignment:', submitData);

      // Call onSubmit and wait for result
      const result = await onSubmit(submitData, uploadedFile);
      
      // Only close modal if the edit was successful
      // The backend notification (success/error) is handled by the parent component
      if (result !== false) {
        onClose();
      }
      // If result is false, modal stays open and error is already shown by parent
    } catch (error) {
      console.error('Error updating assignment:', error);
      // Don't close modal on error - let the error notification show
      // Parent component should handle the error toast
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File <span className="text-gray-400">(Optional)</span>
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-gray-500">
                        {uploadedFile ? (
                          <span className="font-medium text-blue-600">{uploadedFile.name}</span>
                        ) : (
                          <>
                            <span className="font-medium">Click to upload</span> or drag and drop
                          </>
                        )}
                      </p>
                    </div>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
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
                  <DatePicker
                    selected={formData.startDate ? new Date(formData.startDate) : null}
                    onChange={(date) => handleDateTimeChange('startDate', date)}
                    showTimeSelect
                    timeIntervals={1}
                    dateFormat="MMM d, yyyy h:mm aa"
                    minDate={now}
                    className={`w-full px-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
                    placeholderText="Select start date and time"
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
                  <DatePicker
                    selected={formData.deadline ? new Date(formData.deadline) : null}
                    onChange={(date) => handleDateTimeChange('deadline', date)}
                    showTimeSelect
                    timeIntervals={1}
                    dateFormat="MMM d, yyyy h:mm aa"
                    minDate={now}
                    className={`w-full px-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors.deadline ? 'border-red-500' : 'border-gray-300'}`}
                    placeholderText="Select deadline and time"
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
                  <DatePicker
                    selected={formData.reviewDeadline ? new Date(formData.reviewDeadline) : null}
                    onChange={(date) => handleDateTimeChange('reviewDeadline', date)}
                    showTimeSelect
                    timeIntervals={1}
                    dateFormat="MMM d, yyyy h:mm aa"
                    minDate={now}
                    className={`w-full px-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors.reviewDeadline ? 'border-red-500' : 'border-gray-300'}`}
                    placeholderText="Select review deadline and time"
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
                  <DatePicker
                    selected={formData.finalDeadline ? new Date(formData.finalDeadline) : null}
                    onChange={(date) => handleDateTimeChange('finalDeadline', date)}
                    showTimeSelect
                    timeIntervals={1}
                    dateFormat="MMM d, yyyy h:mm aa"
                    minDate={now}
                    className={`w-full px-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors.finalDeadline ? 'border-red-500' : 'border-gray-300'}`}
                    placeholderText="Select final deadline and time"
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
                    max="10"
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
                    Missing Review Penalty <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="missingReviewPenalty"
                    value={formData.missingReviewPenalty}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    step="1"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                      errors.missingReviewPenalty ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.missingReviewPenalty && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.missingReviewPenalty}</span>
                    </div>
                  )}
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

                {formData.allowCrossClass && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cross-Class Tag <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="crossClassTag"
                      value={formData.crossClassTag}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                        errors.crossClassTag ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter cross-class tag"
                    />
                    {errors.crossClassTag && (
                      <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.crossClassTag}</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Tag to identify related assignments across classes</p>
                  </div>
                )}
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
            disabled={!hasFormChanged()}
            className={`px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors ${
              hasFormChanged()
                ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAssignmentModal