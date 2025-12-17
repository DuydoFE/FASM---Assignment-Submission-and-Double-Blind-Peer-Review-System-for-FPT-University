import React, { useState, useEffect } from 'react';
import { Input, Modal, Button } from 'antd';

function EditRubricModal({ isOpen, onClose, onSubmit, rubric, isSubmitting }) {
    const [title, setTitle] = useState('');
    const [originalTitle, setOriginalTitle] = useState('');

    useEffect(() => {
        if (rubric) {
            setTitle(rubric.title || '');
            setOriginalTitle(rubric.title || '');
        }
    }, [rubric]);

    // Check if value has changed from original
    const hasChanged = title.trim() !== originalTitle.trim();
    const isValidTitle = title.trim().length > 0;
    const canSubmit = isValidTitle && hasChanged;

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!canSubmit) {
            return;
        }

        onSubmit({
            rubricId: rubric.rubricId,
            title: title.trim()
        });
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setTitle('');
            setOriginalTitle('');
            onClose();
        }
    };

    return (
        <Modal
            open={isOpen}
            onCancel={handleClose}
            width={500}
            title={
                <h2 className="text-xl font-semibold text-gray-900">Edit Rubric</h2>
            }
            footer={
                <div className="flex justify-end gap-3">
                    <Button
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !canSubmit}
                        loading={isSubmitting}
                        className="bg-blue-500 hover:bg-blue-600"
                    >
                        {isSubmitting ? 'Editing...' : 'Edit Rubric'}
                    </Button>
                </div>
            }
        >
            <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rubric Title <span className="text-red-500">*</span>
                            </label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter rubric title"
                                disabled={isSubmitting}
                                required
                                size="large"
                            />
                        </div>
                    </div>
                </form>
        </Modal>
    );
}

export default EditRubricModal;