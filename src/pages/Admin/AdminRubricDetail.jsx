import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { Table, Dropdown, Button, Modal, Form, Input, Tag } from "antd";
import { EditOutlined, DeleteOutlined, MoreOutlined, ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import {
    getRubricTemplateById,
    createCriteriaTemplate,
    updateCriteriaTemplate,
    deleteCriteriaTemplate,
    toggleRubricTemplatePublicStatus,
} from "../../service/adminService";

export default function AdminRubricDetail() {
    const [form] = Form.useForm();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingToggle, setPendingToggle] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const [rubric, setRubric] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentCriteria, setCurrentCriteria] = useState(null);
    const [criteriaForm, setCriteriaForm] = useState({
        title: "",
        description: "",
        weight: 0,
        maxScore: 10,
        scoringType: "Scale",
        scoreLabel: "0-10",
    });
    const [confirmConfig, setConfirmConfig] = useState({
        open: false,
        title: "",
        message: "",
        onConfirm: null,
    });

    const fetchRubric = async () => {
        try {
            const res = await getRubricTemplateById(id);

            if (res?.statusCode === 200 || res?.statusCode === 100) {
                setRubric(prev => ({
                    ...prev,
                    templateId: res.data.templateId,
                    title: res.data.title,
                    isPublic: res.data.isPublic,
                    criteriaTemplates: res.data.criteriaTemplates || [],
                }));
                setLoading(false);
            } else {
                toast.error(res?.message || "Failed to load rubric details");
            }
        } catch (err) {
            toast.error("Server error fetching rubric details");
        }
    };

    useEffect(() => {
        fetchRubric();
    }, [id]);

    const usedWeight = useMemo(() => {
        return (rubric?.criteriaTemplates || []).reduce((s, it) => s + (Number(it.weight) || 0), 0);
    }, [rubric]);

    const availableWeight = Math.max(0, 100 - usedWeight);

    const handleCreateCriteria = async (values) => {
        if (criteriaForm.maxScore < 0 || criteriaForm.maxScore > 10) {
            toast.error("Max Score must be between 0 and 10");
            return;
        }

        if (criteriaForm.weight < 0 || criteriaForm.weight > availableWeight) {
            toast.error(`Weight must be between 0 and ${availableWeight}`);
            return;
        }

        try {
            const payload = { ...criteriaForm, templateId: rubric.templateId, maxScore: 10 };
            const res = await createCriteriaTemplate(payload);
            if (res?.statusCode === 201 || res?.statusCode === 200) {
                toast.success("Criteria created successfully");
                
                // Clear form first
                form.resetFields();
                setCriteriaForm({ title: "", description: "", weight: 0, maxScore: 10, scoringType: "Scale", scoreLabel: "0-10" });
                
                // Close modal
                setShowCreateModal(false);
                
                // Then reload rubric data from server
                await fetchRubric();
            } else {
                toast.error(res?.message || "Failed to create criteria");
            }
        } catch (err) {
            console.error(err);
            toast.error("Server error creating criteria");
        }
    };

    const openEditModal = (criteria) => {
        setCurrentCriteria(criteria);
        setCriteriaForm({
            title: criteria.title || "",
            description: criteria.description || "",
            weight: criteria.weight || 0,
            maxScore: criteria.maxScore || 0,
            scoringType: criteria.scoringType || "Scale",
            scoreLabel:
                criteria.scoreLabel ||
                (criteria.scoringType === "Pass/Not Pass" ? "Pass-Not Pass" : "0-10"),
        });
        setShowEditModal(true);
    };

    const handleUpdateCriteria = (values) => {
        setConfirmConfig({
            open: true,
            title: "Save Changes",
            message: "Are you sure you want to save these changes?",
            onConfirm: async () => {
                await confirmUpdateCriteria();
                setConfirmConfig({ open: false });
            },
        });
    };

    const handleDeleteCriteria = (criteriaId) => {
        setConfirmConfig({
            open: true,
            title: "Delete Criteria",
            message: "Are you sure you want to delete this criteria?",
            onConfirm: async () => {
                try {
                    const res = await deleteCriteriaTemplate(criteriaId);
                    if (res?.statusCode === 200) {
                        toast.success("Criteria deleted successfully");
                        setRubric((prev) => ({
                            ...prev,
                            criteriaTemplates: prev.criteriaTemplates.filter(
                                (c) => c.criteriaTemplateId !== criteriaId
                            ),
                        }));
                    } else {
                        toast.error(res?.message || "Failed to delete criteria");
                    }
                } catch (err) {
                    toast.error("Server error deleting criteria");
                }
                setConfirmConfig({ open: false });
            },
        });
    };

    const confirmUpdateCriteria = async () => {
        const currentWeight = Number(currentCriteria?.weight) || 0;
        const usedWithoutCurrent = Math.max(0, usedWeight - currentWeight);
        const editAvailable = Math.max(0, 100 - usedWithoutCurrent);

        if (criteriaForm.maxScore < 0 || criteriaForm.maxScore > 10) {
            toast.error("Max Score must be between 0 and 10");
            return;
        }

        if (criteriaForm.weight < 0 || criteriaForm.weight > editAvailable) {
            toast.error(`Weight must be between 0 and ${editAvailable}`);
            return;
        }

        try {
            const payload = {
                criteriaTemplateId: currentCriteria.criteriaTemplateId,
                templateId: rubric.templateId,
                ...criteriaForm,
            };

            const res = await updateCriteriaTemplate(payload);
            if (res?.statusCode === 200) {
                toast.success("Criteria updated successfully");
                setShowEditModal(false);
                setRubric((prev) => ({
                    ...prev,
                    criteriaTemplates: prev.criteriaTemplates.map((c) =>
                        c.criteriaTemplateId === currentCriteria.criteriaTemplateId
                            ? { ...c, ...criteriaForm }
                            : c
                    ),
                }));
            } else {
                toast.error(res?.message || "Failed to update criteria");
            }
        } catch (err) {
            toast.error("Server error updating criteria");
        }
    };

    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            width: "25%",
            render: (text) => <span className="font-medium">{text}</span>,
        },
        {
            title: "Max Score",
            dataIndex: "maxScore",
            key: "maxScore",
            width: "10%",
            align: "center",
        },
        {
            title: "Weight",
            dataIndex: "weight",
            key: "weight",
            width: "10%",
            align: "center",
            render: (weight) => (
                <Tag color="blue">{weight}%</Tag>
            ),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: "45%",
            render: (text) => text || "-",
        },
        {
            title: "Actions",
            key: "actions",
            width: "10%",
            align: "center",
            render: (_, record) => {
                const items = [
                    {
                        key: "edit",
                        label: (
                            <motion.div
                                whileHover={{ x: 5 }}
                                className="flex items-center gap-2"
                            >
                                <EditOutlined /> Edit
                            </motion.div>
                        ),
                        onClick: () => {
                            if (rubric.isPublic) {
                                toast.error("The rubric is currently PUBLIC, so criteria cannot be edited. Please switch it back to PRIVATE first.");
                                return;
                            }
                            openEditModal(record);
                        },
                    },
                    {
                        type: "divider",
                    },
                    {
                        key: "delete",
                        label: (
                            <motion.div
                                whileHover={{ x: 5 }}
                                className="flex items-center gap-2 text-red-600"
                            >
                                <DeleteOutlined /> Delete
                            </motion.div>
                        ),
                        danger: true,
                        onClick: () => {
                            if (rubric.isPublic) {
                                toast.error("The rubric is currently PUBLIC, so criteria cannot be deleted. Please switch it back to PRIVATE first.");
                                return;
                            }
                            handleDeleteCriteria(record.criteriaTemplateId);
                        },
                    },
                ];

                return (
                    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                type="text"
                                icon={<MoreOutlined style={{ fontSize: "20px" }} />}
                            />
                        </motion.div>
                    </Dropdown>
                );
            },
        },
    ];

    if (loading) return <p className="p-4 text-center text-gray-500">Loading...</p>;
    if (!rubric) return <p className="p-4 text-center text-gray-500">No rubric found</p>;

    return (
        <div className="space-y-6 p-6">
            <Toaster position="top-right" reverseOrder={false} />
            
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                    size="large"
                >
                    Back
                </Button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <h2 className="text-3xl font-bold text-orange-500">{rubric.title}</h2>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center gap-3 mt-2"
            >
                <Tag color={rubric.isPublic ? "success" : "default"} className="px-3 py-1 text-sm">
                    {rubric.isPublic ? "Public" : "Private"}
                </Tag>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                        type="primary"
                        danger={rubric.isPublic}
                        style={!rubric.isPublic ? { backgroundColor: "#1890ff", borderColor: "#1890ff" } : {}}
                        onClick={() => {
                            if (!rubric.isPublic && usedWeight < 100) {
                                toast.error("You can only public a rubric when the total weight is exactly 100%.");
                                return;
                            }

                            setPendingToggle({
                                templateId: rubric.templateId,
                                newStatus: !rubric.isPublic
                            });

                            setShowConfirmModal(true);
                        }}
                    >
                        {rubric.isPublic ? "Set to Private" : "Set to Public"}
                    </Button>
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-6 flex justify-between items-center"
            >
                <h3 className="text-2xl font-semibold">
                    Criteria
                    <span className="ml-3 text-sm text-gray-600">
                        Available weight: <b className={`ml-1 ${availableWeight > 0 ? "text-green-600" : "text-red-600"}`}>{availableWeight}%</b>
                    </span>
                </h3>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                        onClick={() => {
                            if (rubric.isPublic) {
                                toast.error("The rubric is currently PUBLIC, so criteria cannot be added. Please switch it back to PRIVATE first.");
                                return;
                            }
                            if (availableWeight <= 0) {
                                toast.error("No weight available. Please adjust existing criteria before adding new one.");
                                return;
                            }
                            // Reset form and state before opening
                            form.resetFields();
                            setCriteriaForm({ title: "", description: "", weight: 0, maxScore: 10, scoringType: "Scale", scoreLabel: "0-10" });
                            setShowCreateModal(true);
                        }}
                    >
                        Add Criteria
                    </Button>
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <Table
                    columns={columns}
                    dataSource={rubric.criteriaTemplates || []}
                    rowKey="criteriaTemplateId"
                    pagination={false}
                    locale={{ emptyText: "No criteria available" }}
                />
            </motion.div>

            {/* CREATE MODAL */}
            <Modal
                title="Create New Criteria"
                open={showCreateModal}
                onCancel={() => {
                    form.resetFields();
                    setCriteriaForm({ title: "", description: "", weight: 0, maxScore: 10, scoringType: "Scale", scoreLabel: "0-10" });
                    setShowCreateModal(false);
                }}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={form}
                    onFinish={handleCreateCriteria}
                    layout="vertical"
                >
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[{ required: true, message: "Please enter a title" }]}
                    >
                        <Input
                            placeholder="Enter title"
                            value={criteriaForm.title}
                            onChange={(e) => setCriteriaForm({ ...criteriaForm, title: e.target.value })}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item label="Description" name="description">
                        <Input.TextArea
                            placeholder="Enter description"
                            value={criteriaForm.description}
                            onChange={(e) => setCriteriaForm({ ...criteriaForm, description: e.target.value })}
                            rows={4}
                        />
                    </Form.Item>

                    <Form.Item
                        label={`Weight (%) - Available: ${availableWeight}%`}
                        name="weight"
                        rules={[
                            { required: true, message: "Please enter weight" },
                        ]}
                    >
                        <Input
                            type="number"
                            placeholder="Weight"
                            value={criteriaForm.weight}
                            onChange={(e) => {
                                let val = Number(e.target.value);
                                if (isNaN(val)) val = 0;
                                if (val > availableWeight) val = availableWeight;
                                if (val < 0) val = 0;
                                setCriteriaForm({ ...criteriaForm, weight: val });
                            }}
                            size="large"
                            min={0}
                            max={availableWeight}
                        />
                    </Form.Item>

                    <Form.Item>
                        <div className="flex justify-end gap-3">
                            <Button onClick={() => {
                                form.resetFields();
                                setCriteriaForm({ title: "", description: "", weight: 0, maxScore: 10, scoringType: "Scale", scoreLabel: "0-10" });
                                setShowCreateModal(false);
                            }}>Cancel</Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                            >
                                Create
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>

            {/* EDIT MODAL */}
            <Modal
                title="Edit Criteria"
                open={showEditModal}
                onCancel={() => setShowEditModal(false)}
                footer={null}
            >
                <Form onFinish={handleUpdateCriteria} layout="vertical">
                    <Form.Item
                        label="Title"
                        name="title"
                        initialValue={criteriaForm.title}
                        rules={[{ required: true, message: "Please enter a title" }]}
                    >
                        <Input
                            placeholder="Enter title"
                            value={criteriaForm.title}
                            onChange={(e) => setCriteriaForm({ ...criteriaForm, title: e.target.value })}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item label="Description" name="description" initialValue={criteriaForm.description}>
                        <Input.TextArea
                            placeholder="Enter description"
                            value={criteriaForm.description}
                            onChange={(e) => setCriteriaForm({ ...criteriaForm, description: e.target.value })}
                            rows={4}
                        />
                    </Form.Item>

                    <Form.Item
                        label={`Weight (%) - Available: ${Math.min(100, availableWeight + (currentCriteria?.weight || 0))}%`}
                        name="weight"
                        initialValue={criteriaForm.weight}
                        rules={[
                            { required: true, message: "Please enter weight" },
                        ]}
                    >
                        <Input
                            type="number"
                            placeholder="Weight"
                            value={criteriaForm.weight}
                            onChange={(e) => {
                                let val = Number(e.target.value);
                                const maxAllowed = Math.min(100, availableWeight + (currentCriteria?.weight || 0));
                                if (isNaN(val)) val = 0;
                                if (val > maxAllowed) val = maxAllowed;
                                if (val < 0) val = 0;
                                setCriteriaForm({ ...criteriaForm, weight: val });
                            }}
                            size="large"
                            min={0}
                            max={Math.min(100, availableWeight + (currentCriteria?.weight || 0))}
                        />
                    </Form.Item>

                    <Form.Item>
                        <div className="flex justify-end gap-3">
                            <Button onClick={() => setShowEditModal(false)}>Cancel</Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={
                                    criteriaForm.title === currentCriteria?.title &&
                                    criteriaForm.description === currentCriteria?.description &&
                                    criteriaForm.weight === currentCriteria?.weight
                                }
                            >
                                Save Changes
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>

            {/* TOGGLE PUBLIC STATUS MODAL */}
            <Modal
                title="Confirm Action"
                open={showConfirmModal}
                onCancel={() => setShowConfirmModal(false)}
                footer={[
                    <Button key="cancel" onClick={() => setShowConfirmModal(false)}>
                        Cancel
                    </Button>,
                    <Button
                        key="confirm"
                        type="primary"
                        onClick={async () => {
                            try {
                                const res = await toggleRubricTemplatePublicStatus(
                                    pendingToggle.templateId,
                                    pendingToggle.newStatus
                                );

                                if (res.statusCode === 100 || res.statusCode === 200) {
                                    toast.success("Status updated successfully!");
                                    await fetchRubric();
                                } else {
                                    toast.error(res.message || "Failed to update status.");
                                }
                            } catch (err) {
                                toast.error("Error updating status.");
                            }

                            setShowConfirmModal(false);
                        }}
                    >
                        Confirm
                    </Button>,
                ]}
            >
                <p>Are you sure you want to change the public status of this rubric?</p>
            </Modal>

            {/* CRITERIA UPDATE/DELETE CONFIRM MODAL */}
            <Modal
                title={confirmConfig.title}
                open={confirmConfig.open}
                onCancel={() => setConfirmConfig({ open: false })}
                footer={[
                    <Button key="cancel" onClick={() => setConfirmConfig({ open: false })}>
                        Cancel
                    </Button>,
                    <Button
                        key="confirm"
                        type="primary"
                        danger={confirmConfig.title === "Delete Criteria"}
                        onClick={confirmConfig.onConfirm}
                    >
                        Confirm
                    </Button>,
                ]}
            >
                <p>{confirmConfig.message}</p>
            </Modal>
        </div>
    );
}
