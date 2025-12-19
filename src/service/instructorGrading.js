import api from "../config/axios";

export const publishGrades = async (assignmentId) => {
    if (!assignmentId) {
        throw new Error("assignmentId is required");
    }

    try {
        const response = await api.post("/instructor/InstructorSubmission/publish-grades", {
            assignmentId,
            forcePublish: false
        });
        return response.data;
    } catch (error) {
        const message =
            error?.response?.data?.message ||
            error?.response?.data ||
            "Publish Grades Failed";

        console.error("Publish Grades Failed:", message);
        throw new Error(message);
    }
};



export const gradeSubmission = async ({ 
    submissionId, 
    instructorId, 
    feedback,
    criteriaFeedbacks
}) => {
    if (!submissionId || !instructorId) {
        throw new Error("submissionId and instructorId are required");
    }

    try {
        const response = await api.post("/instructor/InstructorSubmission/grade", {
            submissionId,
            instructorId,
            feedback,
            criteriaFeedbacks
        });
        return response.data;
    } catch (error) {
        console.error("Grade Submission Failed:", error);
        throw error;
    }
};

export const autoGradeZero = async (assignmentId) => {
    if (!assignmentId) {
        throw new Error("assignmentId is required");
    }

    try {
        const response = await api.post("/instructor/InstructorSubmission/auto-grade-zero", {
            assignmentId,
            confirmZeroGrade: true
        });
        return response.data;
    } catch (error) {
        console.error("Auto Grade Zero Failed:", error);
        throw error;
    }
};

export const exportSubmissionsExcel = async (assignmentId) => {
    if (!assignmentId) {
        throw new Error("assignmentId is required");
    }

    try {
        const response = await api.get(
            `/instructor/InstructorSubmission/export/all/${assignmentId}`,
            {
                responseType: "blob",
            }
        );

        return response.data;
    } catch (error) {
        const message =
            error?.response?.data?.message ||
            "Export Submissions Failed";

        console.error("Export Submissions Failed:", message);
        throw new Error(message);
    }
};

export const importSubmissionsExcel = async (assignmentId, file) => {
    if (!assignmentId) {
        throw new Error("assignmentId is required");
    }
    if (!file) {
        throw new Error("file is required");
    }

    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("assignmentId", assignmentId);

        const response = await api.post(
            "/instructor/InstructorSubmission/import-excel",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    } catch (error) {
        const message =
            error?.response?.data?.message ||
            "Import Submissions Failed";

        console.error("Import Submissions Failed:", message);
        throw new Error(message);
    }
};

export const overrideFinalScore = async ({ submissionId, newFinalScore, instructorId }) => {
    if (!submissionId || newFinalScore === undefined || newFinalScore === null || !instructorId) {
        throw new Error("submissionId, newFinalScore, and instructorId are required");
    }

    try {
        const response = await api.put("/instructor/InstructorSubmission/override-final-score", {
            submissionId,
            newFinalScore,
            instructorId
        });
        return response.data;
    } catch (error) {
        const message =
            error?.response?.data?.message ||
            error?.response?.data ||
            "Override Final Score Failed";

        console.error("Override Final Score Failed:", message);
        throw new Error(message);
    }
};

export const instructorGradingService = {
    publishGrades,
    gradeSubmission,
    autoGradeZero,
    exportSubmissionsExcel,
    importSubmissionsExcel,
    overrideFinalScore
};