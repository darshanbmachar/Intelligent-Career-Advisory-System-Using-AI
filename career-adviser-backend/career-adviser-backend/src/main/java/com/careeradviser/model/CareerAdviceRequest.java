package com.careeradviser.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;

@Data
public class CareerAdviceRequest {

    @NotBlank(message = "Student name is required")
    private String studentName;

    @NotBlank(message = "Career goal is required")
    private String careerGoal;

    // 10th Standard Details
    @NotNull(message = "10th marks are required")
    private TenthMarks tenthMarks;

    // 12th Standard Details (optional - student may not have completed 12th)
    private TwelfthMarks twelfthMarks;

    private String stream; // Science, Commerce, Arts
    private String location; // State/City for regional exam info
    private String languageMedium; // English, Tamil, Hindi, etc.

    @Data
    public static class TenthMarks {
        private Double mathematics;
        private Double science;
        private Double socialScience;
        private Double english;
        private Double secondLanguage;
        private Double thirdLanguage;
        private Map<String, Double> additionalSubjects;
        private Double totalPercentage;
    }

    @Data
    public static class TwelfthMarks {
        private String stream; // Science-PCM, Science-PCB, Commerce, Arts
        // Science PCM
        private Double physics;
        private Double chemistry;
        private Double mathematics;
        // Science PCB
        private Double biology;
        // Commerce
        private Double accountancy;
        private Double businessStudies;
        private Double economics;
        // Arts
        private Double history;
        private Double geography;
        private Double politicalScience;
        private Double sociology;
        private Double psychology;
        // Common
        private Double english;
        private Double secondLanguage;
        private Double computerScience;
        private Double physicalEducation;
        private Map<String, Double> additionalSubjects;
        private Double totalPercentage;
    }
}
