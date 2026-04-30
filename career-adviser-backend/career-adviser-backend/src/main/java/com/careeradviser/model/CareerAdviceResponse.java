package com.careeradviser.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CareerAdviceResponse {
    private String studentName;
    private String careerGoal;
    private String careerMatchAnalysis;
    private String strengthsAnalysis;
    private String improvementAreas;
    private String educationalRoadmap;
    private String competitiveExams;
    private String jobOpportunities;
    private String salaryExpectations;
    private String alternativeCareerPaths;
    private String motivationalMessage;
    private Double careerMatchPercentage;
    private String fullAdvice; // Complete formatted advice
    private boolean success;
    private String errorMessage;
}
