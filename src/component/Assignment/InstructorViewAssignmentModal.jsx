import React, { useState, useEffect } from 'react';
import { FileText, File, Eye } from 'lucide-react';
import { getRubricTemplatesByUserId } from '../../service/rubricService';
import { toast } from 'react-toastify';
import { getCurrentAccount } from '../../utils/accountUtils';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Input, Select, Checkbox, Modal, Button } from 'antd';

const { TextArea } = Input;

const InstructorViewAssignmentModal = ({ isOpen, onClose, assignment, courseInstanceId }) => {
  const [assignmentData, setAssignmentData] = useState(null);
  const [rubrics, setRubrics] = useState([]);
  const [loadingRubrics, setLoadingRubrics] = useState(false);
  const currentUser = getCurrentAccount();

  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return '';
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
      const data = {
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
        includeAIScore: assignment.includeAIScore || false,
        fileName: assignment.fileName || '',
        fileSize: assignment.fileSize || 0,
        fileType: assignment.fileType || ''
      };
      
      setAssignmentData(data);
      fetchRubrics();
    }
  }, [isOpen, assignment]);

  if (!assignmentData) return null;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      width={800}
      title={
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Eye className="w-6 h-6 text-purple-600" />
          </div>
          <span className="text-2xl font-bold text-gray-900">View Assignment Details</span>
        </div>
      }
      footer={
        <div className="flex gap-3 justify-end">
          <Button onClick={onClose} type="primary">
            Close
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
            <div className="w-1 h-5 bg-purple-500 rounded"></div>
            Basic Information
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <Input
              type="text"
              value={assignmentData.title}
              disabled
              className="bg-white"
              style={{ color: '#1f2937', cursor: 'not-allowed' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <TextArea
              value={assignmentData.description}
              disabled
              rows={3}
              className="bg-white"
              style={{ color: '#1f2937', cursor: 'not-allowed' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Guidelines
            </label>
            <TextArea
              value={assignmentData.guidelines}
              disabled
              rows={3}
              className="bg-white"
              style={{ color: '#1f2937', cursor: 'not-allowed' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rubric
            </label>
            {loadingRubrics ? (
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600">
                Loading rubrics...
              </div>
            ) : (
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium">
                {rubrics.find(r => String(r.templateId) === String(assignmentData.rubricTemplateId))?.title ||
                 `Rubric #${assignmentData.rubricTemplateId}` ||
                 'No rubric selected'}
              </div>
            )}
          </div>

          {assignmentData.fileName && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document
              </label>
              <div className="flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <File className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{assignmentData.fileName}</p>
                    <p className="text-xs text-gray-500">
                      {assignmentData.fileSize ? `${(assignmentData.fileSize / 1024).toFixed(2)} KB` : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-1 h-5 bg-purple-500 rounded"></div>
            Important Dates
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <DatePicker
                selected={assignmentData.startDate ? new Date(assignmentData.startDate) : null}
                disabled
                showTimeSelect
                timeIntervals={1}
                dateFormat="MMM d, yyyy h:mm aa"
                className="w-full px-10 py-2 border border-gray-300 rounded-lg bg-gray-50 outline-none"
                placeholderText="Not set"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline
              </label>
              <DatePicker
                selected={assignmentData.deadline ? new Date(assignmentData.deadline) : null}
                disabled
                showTimeSelect
                timeIntervals={1}
                dateFormat="MMM d, yyyy h:mm aa"
                className="w-full px-10 py-2 border border-gray-300 rounded-lg bg-gray-50 outline-none"
                placeholderText="Not set"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Deadline
              </label>
              <DatePicker
                selected={assignmentData.reviewDeadline ? new Date(assignmentData.reviewDeadline) : null}
                disabled
                showTimeSelect
                timeIntervals={1}
                dateFormat="MMM d, yyyy h:mm aa"
                className="w-full px-10 py-2 border border-gray-300 rounded-lg bg-gray-50 outline-none"
                placeholderText="Not set"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Final Deadline
              </label>
              <DatePicker
                selected={assignmentData.finalDeadline ? new Date(assignmentData.finalDeadline) : null}
                disabled
                showTimeSelect
                timeIntervals={1}
                dateFormat="MMM d, yyyy h:mm aa"
                className="w-full px-10 py-2 border border-gray-300 rounded-lg bg-gray-50 outline-none"
                placeholderText="Not set"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-1 h-5 bg-purple-500 rounded"></div>
            Grading Configuration
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructor Weight (%)
              </label>
              <Input
                type="number"
                value={assignmentData.instructorWeight}
                disabled
                className="bg-white"
                style={{ color: '#1f2937', cursor: 'not-allowed' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peer Weight (%)
              </label>
              <Input
                type="number"
                value={assignmentData.peerWeight}
                disabled
                className="bg-white"
                style={{ color: '#1f2937', cursor: 'not-allowed' }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-1 h-5 bg-purple-500 rounded"></div>
            Review Settings
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Peer Reviews Required
              </label>
              <Input
                type="number"
                value={assignmentData.numPeerReviewsRequired}
                disabled
                className="bg-white"
                style={{ color: '#1f2937', cursor: 'not-allowed' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Missing Review Penalty
              </label>
              <Input
                type="number"
                value={assignmentData.missingReviewPenalty}
                disabled
                className="bg-white"
                style={{ color: '#1f2937', cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Checkbox
              checked={assignmentData.allowCrossClass}
              disabled
            >
              <div>
                <span className="text-sm font-medium text-gray-900">Allow Cross-Class Review</span>
                <p className="text-xs text-gray-500">Students can review submissions from other classes</p>
              </div>
            </Checkbox>

            {assignmentData.allowCrossClass && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cross-Class Tag
                </label>
                <Input
                  type="text"
                  value={assignmentData.crossClassTag}
                  disabled
                  className="bg-white"
                  style={{ color: '#1f2937', cursor: 'not-allowed' }}
                />
                <p className="text-xs text-gray-500 mt-1">Tag to identify related assignments across classes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default InstructorViewAssignmentModal;