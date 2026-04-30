package com.careeradviser.controller;

import com.careeradviser.model.CareerAdviceRequest;
import com.careeradviser.model.CareerAdviceResponse;
import com.careeradviser.service.CareerAdviserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/career")
@RequiredArgsConstructor
@Slf4j
public class CareerAdviserController {

    private final CareerAdviserService careerAdviserService;

    /**
     * Main endpoint to get career advice
     */
    @PostMapping("/advise")
    public ResponseEntity<CareerAdviceResponse> getCareerAdvice(
            @Valid @RequestBody CareerAdviceRequest request) {
        log.info("Career advice requested for student: {}, goal: {}",
                request.getStudentName(), request.getCareerGoal());

        try {
            CareerAdviceResponse response = careerAdviserService.getCareerAdvice(request);

            if (response.isSuccess()) {
                log.info("Successfully generated career advice for: {}", request.getStudentName());
                return ResponseEntity.ok()
                        .header("X-Career-Match-Score", String.valueOf(response.getCareerMatchPercentage()))
                        .body(response);
            } else {
                log.warn("Failed to generate career advice: {}", response.getErrorMessage());
                return ResponseEntity.ok()
                        .header("X-Error", response.getErrorMessage())
                        .body(response);
            }
        } catch (Exception e) {
            log.error("Unexpected error in career advice endpoint: ", e);
            return ResponseEntity.internalServerError()
                    .body(CareerAdviceResponse.builder()
                            .studentName(request.getStudentName())
                            .careerGoal(request.getCareerGoal())
                            .success(false)
                            .errorMessage("Internal server error: " + e.getMessage())
                            .build());
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "Career Adviser API",
                "version", "1.0.0"
        ));
    }

    /**
     * Get available career streams info
     */
    @GetMapping("/streams")
    public ResponseEntity<Map<String, Object>> getStreams() {
        return ResponseEntity.ok(Map.of(
                "tenthSubjects", List.of(
                        "Mathematics", "Science", "Social Science",
                        "English", "Second Language", "Third Language"
                ),
                "twelfthStreams", Map.of(
                        "Science-PCM", List.of("Physics", "Chemistry", "Mathematics", "English", "Computer Science"),
                        "Science-PCB", List.of("Physics", "Chemistry", "Biology", "English", "Computer Science"),
                        "Science-PCMB", List.of("Physics", "Chemistry", "Mathematics", "Biology", "English"),
                        "Commerce", List.of("Accountancy", "Business Studies", "Economics", "English", "Mathematics"),
                        "Commerce-Maths", List.of("Accountancy", "Business Studies", "Economics", "English", "Mathematics"),
                        "Arts", List.of("History", "Geography", "Political Science", "Sociology", "Psychology", "English"),
                        "Vocational", List.of("English", "Vocational Subject 1", "Vocational Subject 2")
                ),
                "popularCareerGoals", List.of(
                        "Software Engineer", "Doctor (MBBS)", "IAS/IPS Officer",
                        "Chartered Accountant", "Lawyer", "Mechanical Engineer",
                        "Data Scientist", "Civil Engineer", "Architect",
                        "Defence Officer", "Teacher/Professor", "Entrepreneur",
                        "Nurse", "Pharmacist", "Fashion Designer",
                        "Journalist", "Psychologist", "Banker"
                )
        ));
    }
}
