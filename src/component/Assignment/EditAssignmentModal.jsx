import React, { useState, useEffect } from 'react';
import { Save, FileText, AlertCircle, Upload, File, X } from 'lucide-react';
import { getRubricTemplatesByUserId } from '../../service/rubricService';
import { toast } from 'react-toastify';
import { getCurrentAccount } from '../../utils/accountUtils';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Input, Select, Checkbox, Modal, Button } from 'antd';

const { TextArea } = Input;

const EditAssignmentModal = ({ isOpen, onClose, onSubmit, assignment, courseInstanceId }) => {
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [initialFormData, setInitialFormData] = useState(null);
  const [fileRemoved, setFileRemoved] = useState(false);
  const currentUser = getCurrentAccount();

  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return '';
    // Parse the datetime string directly without timezone conversion
    // Expected format: "2025-12-25T00:00:00" or "2025-12-25T00:00:00.000Z"
    const cleanedString = dateString.replace('Z', '').split('.')[0];
    return cleanedString;
  };

  const fetchRubrics = async () => {
    setLoadingRubrics(true);
    try {
      const data = await getRubricTemplatesByUserId(currentUser.id, courseInstanceId);
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
      // Check if the file was previously marked for removal
      // Use the fileRemoved state to determine if file should be shown
      if (assignment.fileName && !fileRemoved) {
        const existingFile = {
          name: assignment.fileName,
          size: assignment.fileSize || 0,
          type: assignment.fileType || ''
        };
        setSelectedFile(existingFile);
        setInitialFormData(initialData);
      } else {
        // If assignment has no file or if we previously marked it for removal, set to null
        setSelectedFile(null);
        setInitialFormData(initialData);
        // Reset the fileRemoved flag when the modal is opened with no file
        if (!assignment.fileName) {
          setFileRemoved(false);
        }
      }
      fetchRubrics();
    } else if (!isOpen) {
      // Reset file state when modal is closed
      setSelectedFile(null);
      // Also reset the fileRemoved flag when modal closes
      setFileRemoved(false);
    }
  }, [isOpen, assignment, fileRemoved]);

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
          if (num < 1) num = 1;
          if (num > 10) num = 10;
          num = Math.floor(num);
          newValue = num;
        }
      }

      // Handle instructor weight and auto-calculate peer weight
      else if (name === "instructorWeight") {
        if (value === "") {
          newValue = "";
          setFormData(prev => ({
            ...prev,
            instructorWeight: "",
            peerWeight: ""
          }));
          if (errors.instructorWeight || errors.peerWeight) {
            setErrors(prev => ({ ...prev, instructorWeight: '', peerWeight: '' }));
          }
          return;
        } else {
          let num = Number(value);
          if (num < 0) num = 0;
          if (num > 100) num = 100;
          newValue = num;
          const peerWeightValue = 100 - num;
          
          setFormData(prev => ({
            ...prev,
            instructorWeight: num,
            peerWeight: peerWeightValue
          }));
          if (errors.instructorWeight || errors.peerWeight) {
            setErrors(prev => ({ ...prev, instructorWeight: '', peerWeight: '' }));
          }
          return;
        }
      }

      // Handle peer weight and auto-calculate instructor weight
      else if (name === "peerWeight") {
        if (value === "") {
          newValue = "";
          setFormData(prev => ({
            ...prev,
            instructorWeight: "",
            peerWeight: ""
          }));
          if (errors.instructorWeight || errors.peerWeight) {
            setErrors(prev => ({ ...prev, instructorWeight: '', peerWeight: '' }));
          }
          return;
        } else {
          let num = Number(value);
          if (num < 0) num = 0;
          if (num > 100) num = 100;
          newValue = num;
          const instructorWeightValue = 100 - num;
          
          setFormData(prev => ({
            ...prev,
            instructorWeight: instructorWeightValue,
            peerWeight: num
          }));
          if (errors.instructorWeight || errors.peerWeight) {
            setErrors(prev => ({ ...prev, instructorWeight: '', peerWeight: '' }));
          }
          return;
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
    }
  };

  const removeFile = () => {
    setSelectedFile({ name: '', size: 0, type: '', removed: true });
    // Also update the initialFormData to reflect the file removal
    setInitialFormData(prev => ({
      ...prev,
      fileName: null
    }));
    // Mark that the file has been removed
    setFileRemoved(true);
  };

  const now = new Date();

  const handleDateTimeChange = (name, date) => {
    if (date) {
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

  const hasFormChanged = () => {
    if (!initialFormData) return false;
    
    const fileChanged = (selectedFile && !selectedFile.removed && !assignment.fileName) || // New file uploaded
                        (selectedFile && selectedFile.removed) || // Existing file removed
                        (!selectedFile && assignment.fileName && assignment.fileName !== ''); // Existing file was present but now cleared
    
    if (fileChanged) return true;
    
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

      let fileToSend = null;
      if (selectedFile && selectedFile.removed) {
        fileToSend = { removed: true };
      } else if (selectedFile && selectedFile.name && selectedFile.removed === undefined) {
        fileToSend = selectedFile;
      }

      const result = await onSubmit(submitData, fileToSend);
      
      if (result !== false) {
        // Reset the fileRemoved flag after successful submission
        setFileRemoved(false);
        onClose();
      }
    } catch (error) {
      console.error('Error updating assignment:', error);
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

              {/* FILE UPLOAD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document <span className="text-gray-400">(Optional)</span>
                </label>
                {!selectedFile || (selectedFile && selectedFile.removed && selectedFile.name === '') ? (
                  <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-600">Click to upload file</span>
                    </div>
                    <Input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept="all"
                    />
                  </label>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <File className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{selectedFile.name || assignment.fileName}</p>
                        <p className="text-xs text-gray-500">
                          {selectedFile.size ? `${(selectedFile.size / 1024).toFixed(2)} KB` :
                           assignment.fileSize ? `${(assignment.fileSize / 1024).toFixed(2)} KB` : ''}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={removeFile}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                )}
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
                {/* Left Column - Grading Scale and Pass Threshold */}
                <div className="space-y-4">
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
                          { label: '≥ 4.0', value: '4' },
                          { label: '≥ 5.0', value: '5' }
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
                </div>

                {/* Right Column - Instructor Weight and Peer Weight */}
                <div className="space-y-4">
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
                      className={`w-full px-4 py-2 ${errors.instructorWeight ? 'border-red-500' : 'border-gray-300'
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
                    <Input
                      type="number"
                      name="peerWeight"
                      value={formData.peerWeight}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className={`w-full px-4 py-2 ${errors.peerWeight ? 'border-red-500' : 'border-gray-300'
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