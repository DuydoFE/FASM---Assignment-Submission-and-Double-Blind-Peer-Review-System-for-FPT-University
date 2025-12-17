import React, { useState, useEffect } from 'react';
import { Save, FileText, AlertCircle } from 'lucide-react';
import { getRubricTemplatesByUserId } from '../../service/rubricService';
import { toast } from 'react-toastify';
import { getCurrentAccount } from '../../utils/accountUtils';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Input, Select, Checkbox, Modal, Button } from 'antd';

const { TextArea } = Input;

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
      // Format as local datetime string without timezone conversion
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      const localDateTimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      
      setFormData(prev => ({
        ...prev,
        [name]: localDateTimeString
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
        startDate: formData.startDate || null,
        deadline: formData.deadline,
        reviewDeadline: formData.reviewDeadline,
        finalDeadline: formData.finalDeadline,
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

  if (!assignment) return null;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      width={800}
      title={
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-2xl font-bold text-gray-900">Edit Assignment</span>
        </div>
      }
      footer={
        <div className="flex gap-3 justify-end">
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={!hasFormChanged()}
            icon={<Save className="w-5 h-5" />}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save Changes
          </Button>
        </div>
      }
      styles={{
        body: { maxHeight: 'calc(90vh - 200px)', overflowY: 'auto' }
      }}
    >
      <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-5 bg-blue-500 rounded"></div>
                Basic Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  status={errors.title ? 'error' : ''}
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
                <TextArea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter assignment description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guidelines
                </label>
                <TextArea
                  name="guidelines"
                  value={formData.guidelines}
                  onChange={handleChange}
                  rows={3}
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
                  <Select
                    value={formData.gradingScale}
                    onChange={(value) => handleChange({ target: { name: 'gradingScale', value } })}
                    className="w-full"
                    size="large"
                    options={[
                      { label: 'Scale 10', value: 'Scale10' },
                      { label: 'Pass/Fail', value: 'PassFail' }
                    ]}
                  />
                </div>

                {formData.gradingScale === 'PassFail' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pass Threshold <span className="text-red-500">*</span>
                    </label>
                    <Select
                      placeholder="Select pass threshold"
                      value={formData.passThreshold || undefined}
                      onChange={(value) => handleChange({ target: { name: 'passThreshold', value } })}
                      status={errors.passThreshold ? 'error' : ''}
                      className="w-full"
                      size="large"
                      options={[
                        { label: '≥ 0.0', value: '0' },
                        { label: '≥ 4.0', value: '40' },
                        { label: '≥ 5.0', value: '50' }
                      ]}
                    />
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
                  <Input
                    type="number"
                    name="instructorWeight"
                    value={formData.instructorWeight}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    status={errors.instructorWeight ? 'error' : ''}
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
                  <Input
                    type="number"
                    name="peerWeight"
                    value={formData.peerWeight}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    status={errors.peerWeight ? 'error' : ''}
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
                  <Input
                    type="number"
                    name="numPeerReviewsRequired"
                    value={formData.numPeerReviewsRequired}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    status={errors.numPeerReviewsRequired ? 'error' : ''}
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
                  <Input
                    type="number"
                    name="missingReviewPenalty"
                    value={formData.missingReviewPenalty}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    step="1"
                    status={errors.missingReviewPenalty ? 'error' : ''}
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
                <Checkbox
                  name="allowCrossClass"
                  checked={formData.allowCrossClass}
                  onChange={(e) => handleChange(e)}
                >
                  <div>
                    <span className="text-sm font-medium text-gray-900">Allow Cross-Class Review</span>
                    <p className="text-xs text-gray-500">Students can review submissions from other classes</p>
                  </div>
                </Checkbox>

                {formData.allowCrossClass && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cross-Class Tag <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      name="crossClassTag"
                      value={formData.crossClassTag}
                      onChange={handleChange}
                      status={errors.crossClassTag ? 'error' : ''}
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
    </Modal>
  );
};

export default EditAssignmentModal