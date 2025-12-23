import React, { useState, useEffect } from 'react';
import { Plus, FileText, AlertCircle, Upload, File, X } from 'lucide-react';
import { getRubricTemplatesByUserId } from '../../service/rubricService';
import { toast } from 'react-toastify';
import { getCurrentAccount } from '../../utils/accountUtils';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Input, Select, Checkbox, Modal, Button } from "antd";

const { TextArea } = Input;


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
    crossClassTag: '',
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
    if (isOpen && courseInstanceId) {
      fetchRubrics();
    }
  }, [isOpen, courseInstanceId]);

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

    if (!formData.missingReviewPenalty || formData.missingReviewPenalty === '') {
      newErrors.missingReviewPenalty = 'Missing review penalty is required';
    }

    if (formData.allowCrossClass && !formData.crossClassTag.trim()) {
      newErrors.crossClassTag = 'Cross-class tag is required when cross-class review is enabled';
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

      submitData.passThreshold = 0;

      console.log('Submitting data:', submitData);

      // Wait for onSubmit to complete successfully before resetting form
      await onSubmit(submitData, selectedFile);

      // Only reset form and close modal if submission was successful
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
        crossClassTag: '',
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
    }
  };

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
          <span className="text-2xl font-bold text-gray-900">Create New Assignment</span>
        </div>
      }
      footer={
        <div className="flex gap-3 justify-end">
          <Button
            onClick={onClose}
            className="px-6 py-2.5"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            icon={<Plus className="w-5 h-5" />}
            className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600"
          >
            Create Assignment
          </Button>
        </div>
      }
      styles={{
        body: { maxHeight: 'calc(90vh - 200px)', overflowY: 'auto' }
      }}
    >
      <div className="space-y-6">

            {/* BASIC INFORMATION */}
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
                  className={`w-full px-4 py-2 ${errors.title ? 'border-red-500' : 'border-gray-300'
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
                <TextArea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2"
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
                  className="w-full px-4 py-2"
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
                  <Select
                    placeholder="Select a rubric"
                    value={formData.rubricTemplateId || undefined}
                    onChange={(value) => handleChange({ target: { name: 'rubricTemplateId', value } })}
                    status={errors.rubricTemplateId ? 'error' : ''}
                    className="w-full"
                    size="large"
                    options={rubrics.map((rubric) => ({
                      label: rubric.title || `Rubric #${rubric.templateId}`,
                      value: String(rubric.templateId)
                    }))}
                  />
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
                        <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
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

            {/* IMPORTANT DATES */}
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
                    className={`w-full px-10 py-2 border rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-transparent outline-none ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
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
                    className={`w-full px-10 py-2 border rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-transparent outline-none ${errors.deadline ? 'border-red-500' : 'border-gray-300'}`}
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
                    className={`w-full px-10 py-2 border rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-transparent outline-none ${errors.reviewDeadline ? 'border-red-500' : 'border-gray-300'}`}
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
                    className={`w-full px-10 py-2 border rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-transparent outline-none ${errors.finalDeadline ? 'border-red-500' : 'border-gray-300'}`}
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

            {/* GRADING */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-5 bg-blue-500 rounded"></div>
                Grading Configuration
              </h3>

              <div className="grid grid-cols-2 gap-4">
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

            {/* REVIEW SETTINGS */}
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
                    className={`w-full px-4 py-2 ${errors.numPeerReviewsRequired ? 'border-red-500' : 'border-gray-300'
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
                  <Input
                    type="number"
                    name="missingReviewPenalty"
                    value={formData.missingReviewPenalty}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    step="1"
                    className={`w-full px-4 py-2 ${errors.missingReviewPenalty ? 'border-red-500' : 'border-gray-300'
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
                <Checkbox
                  name="allowCrossClass"
                  checked={formData.allowCrossClass}
                  onChange={(e) => handleChange(e)}
                >
                  <div>
                    <span className="text-sm font-medium text-gray-900">Allow Cross-Class Review</span>
                    <p className="text-xs text-gray-500">Students can peer review submissions from other classes</p>
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
                      className={`w-full px-4 py-2 ${errors.crossClassTag ? 'border-red-500' : 'border-gray-300'
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
    </Modal>
  );
};

export default CreateAssignmentModal;
