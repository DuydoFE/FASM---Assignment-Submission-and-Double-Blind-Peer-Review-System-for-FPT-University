import React from 'react';
import { Loader, AlertTriangle } from 'lucide-react';
import { Modal, Button } from 'antd';

const DeleteCriterionModal = ({ isOpen, onClose, onConfirm, criterionTitle, isDeleting }) => {
    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            width={500}
            title={
                <h2 className="text-2xl font-bold text-gray-900">Delete Criterion</h2>
            }
            footer={
                <div className="flex justify-end gap-3">
                    <Button
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        danger
                        onClick={onConfirm}
                        disabled={isDeleting}
                        loading={isDeleting}
                        icon={isDeleting ? <Loader className="w-4 h-4 animate-spin" /> : null}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>
            }
        >
            <div>
                    <div className="mb-6">
                        <p className="text-gray-700 text-base leading-relaxed">
                            Are you sure you want to delete{' '}
                            <span className="font-semibold text-gray-900">{criterionTitle}</span>{' '}
                            criterion?
                        </p>
                        <p className="text-sm text-gray-600 mt-3">
                            This action cannot be undone.
                        </p>
                    </div>
                </div>
        </Modal>
    );
};

export default DeleteCriterionModal;