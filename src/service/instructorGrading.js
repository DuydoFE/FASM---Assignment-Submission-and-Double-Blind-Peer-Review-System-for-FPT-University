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
        console.error("Publish Grades Failed:", error);
        throw error;
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

export const instructorGradingService = {
    publishGrades,
    gradeSubmission,
    autoGradeZero
};