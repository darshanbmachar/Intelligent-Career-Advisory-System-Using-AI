package com.careeradviser.service;

import com.careeradviser.model.CareerAdviceRequest;
import com.careeradviser.model.CareerAdviceResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CareerAdviserService {

    private final ChatClient chatClient;

    @Value("${spring.ai.openai.api-key:}")
    private String openAiApiKey;

    private static final String SYSTEM_PROMPT = """
            You are an expert Indian career counsellor and educational advisor with 20+ years of experience.
            You specialize in helping students from 10th and 12th standard choose the right career paths
            based on their academic performance and personal aspirations.

            Your advice should be:
            - Specific to the Indian education system (CBSE, State boards, etc.)
            - Include competitive exams relevant to India (JEE, NEET, CLAT, CAT, UPSC, etc.)
            - Mention specific Indian universities and colleges
            - Be realistic yet encouraging
            - Cover both government and private sector opportunities
            - Consider the student's actual marks and career compatibility

            Always structure your response in clear sections with proper formatting.
            Be specific with exam names, cutoffs, preparation timelines, and salary ranges in INR.
            """;

    public CareerAdviceResponse getCareerAdvice(CareerAdviceRequest request) {
        try {
            if (isApiKeyMissing()) {
                log.error("OpenRouter API key is not configured");
                return CareerAdviceResponse.builder()
                        .studentName(request.getStudentName())
                        .careerGoal(request.getCareerGoal())
                        .success(false)
                        .errorMessage("OpenRouter API key is not configured. Please set the OPENROUTER_API_KEY or SPRING_AI_OPENAI_API_KEY environment variable.")
                        .build();
            }

            String userPrompt = buildUserPrompt(request);
            log.debug("Sending prompt to AI for student: {}", request.getStudentName());

            String aiResponse = chatClient.prompt()
                    .system(SYSTEM_PROMPT)
                    .user(userPrompt)
                    .call()
                    .content();

            log.debug("Received AI response successfully");

            return CareerAdviceResponse.builder()
                    .studentName(request.getStudentName())
                    .careerGoal(request.getCareerGoal())
                    .fullAdvice(aiResponse)
                    .careerMatchPercentage(extractMatchPercentage(aiResponse))
                    .success(true)
                    .build();

        } catch (Exception e) {
            log.error("Error getting career advice: ", e);
            String errorMsg = e.getMessage();
            if (errorMsg != null && errorMsg.contains("401")) {
                return CareerAdviceResponse.builder()
                        .studentName(request.getStudentName())
                        .careerGoal(request.getCareerGoal())
                        .success(false)
                        .errorMessage("OpenRouter API key is invalid or expired. Please check your API key.")
                        .build();
            } else if (errorMsg != null && errorMsg.contains("insufficient_quota")) {
                return CareerAdviceResponse.builder()
                        .studentName(request.getStudentName())
                        .careerGoal(request.getCareerGoal())
                        .success(false)
                        .errorMessage("OpenRouter quota exceeded. Add credits, increase your usage limit, or use an API key with available quota.")
                        .build();
            } else if (errorMsg != null && errorMsg.contains("429")) {
                return CareerAdviceResponse.builder()
                        .studentName(request.getStudentName())
                        .careerGoal(request.getCareerGoal())
                        .success(false)
                        .errorMessage("AI service rate limit reached. Please try again in a few moments.")
                        .build();
            } else if (errorMsg != null && errorMsg.toLowerCase().contains("timeout")) {
                return CareerAdviceResponse.builder()
                        .studentName(request.getStudentName())
                        .careerGoal(request.getCareerGoal())
                        .success(false)
                        .errorMessage("Request timed out. The AI service took too long to respond. Please try again.")
                        .build();
            }
            return CareerAdviceResponse.builder()
                    .studentName(request.getStudentName())
                    .careerGoal(request.getCareerGoal())
                    .success(false)
                    .errorMessage("Failed to get career advice: " + (errorMsg != null ? errorMsg : "Unknown error"))
                    .build();
        }
    }

    private boolean isApiKeyMissing() {
        return openAiApiKey == null
                || openAiApiKey.trim().isEmpty()
                || "missing".equalsIgnoreCase(openAiApiKey.trim())
                || openAiApiKey.trim().startsWith("sk-1234")
                || openAiApiKey.trim().startsWith("sk-abcd");
    }

    private String buildUserPrompt(CareerAdviceRequest request) {
        StringBuilder sb = new StringBuilder();

        sb.append("Please provide comprehensive career advice for the following student:\n\n");
        sb.append("Student Name: ").append(request.getStudentName()).append("\n");
        sb.append("Career Goal/Ambition: ").append(request.getCareerGoal()).append("\n");

        if (request.getLocation() != null && !request.getLocation().isBlank()) {
            sb.append("Location: ").append(request.getLocation()).append("\n");
        }

        sb.append("\n--- 10th STANDARD MARKS ---\n");
        CareerAdviceRequest.TenthMarks tenth = request.getTenthMarks();
        if (tenth != null) {
            appendIfNotNull(sb, "Mathematics", tenth.getMathematics());
            appendIfNotNull(sb, "Science", tenth.getScience());
            appendIfNotNull(sb, "Social Science", tenth.getSocialScience());
            appendIfNotNull(sb, "English", tenth.getEnglish());
            appendIfNotNull(sb, "Second Language", tenth.getSecondLanguage());
            appendIfNotNull(sb, "Third Language", tenth.getThirdLanguage());

            if (tenth.getAdditionalSubjects() != null) {
                for (Map.Entry<String, Double> entry : tenth.getAdditionalSubjects().entrySet()) {
                    appendIfNotNull(sb, entry.getKey(), entry.getValue());
                }
            }
            if (tenth.getTotalPercentage() != null) {
                sb.append("10th Overall Percentage: ").append(tenth.getTotalPercentage()).append("%\n");
            }
        }

        if (request.getTwelfthMarks() != null) {
            CareerAdviceRequest.TwelfthMarks twelfth = request.getTwelfthMarks();
            sb.append("\n--- 12th STANDARD MARKS (Stream: ")
                    .append(twelfth.getStream() != null ? twelfth.getStream() : "Not specified")
                    .append(") ---\n");

            appendIfNotNull(sb, "Physics", twelfth.getPhysics());
            appendIfNotNull(sb, "Chemistry", twelfth.getChemistry());
            appendIfNotNull(sb, "Mathematics", twelfth.getMathematics());
            appendIfNotNull(sb, "Biology", twelfth.getBiology());
            appendIfNotNull(sb, "Accountancy", twelfth.getAccountancy());
            appendIfNotNull(sb, "Business Studies", twelfth.getBusinessStudies());
            appendIfNotNull(sb, "Economics", twelfth.getEconomics());
            appendIfNotNull(sb, "History", twelfth.getHistory());
            appendIfNotNull(sb, "Geography", twelfth.getGeography());
            appendIfNotNull(sb, "Political Science", twelfth.getPoliticalScience());
            appendIfNotNull(sb, "Sociology", twelfth.getSociology());
            appendIfNotNull(sb, "Psychology", twelfth.getPsychology());
            appendIfNotNull(sb, "English", twelfth.getEnglish());
            appendIfNotNull(sb, "Second Language", twelfth.getSecondLanguage());
            appendIfNotNull(sb, "Computer Science", twelfth.getComputerScience());
            appendIfNotNull(sb, "Physical Education", twelfth.getPhysicalEducation());

            if (twelfth.getAdditionalSubjects() != null) {
                for (Map.Entry<String, Double> entry : twelfth.getAdditionalSubjects().entrySet()) {
                    appendIfNotNull(sb, entry.getKey(), entry.getValue());
                }
            }
            if (twelfth.getTotalPercentage() != null) {
                sb.append("12th Overall Percentage: ").append(twelfth.getTotalPercentage()).append("%\n");
            }
        } else {
            sb.append("\n[Note: Student has only completed 10th standard]\n");
        }

        sb.append("""

                Please provide a detailed career guidance report with the following sections:

                ## 1. CAREER MATCH ANALYSIS
                Analyze how well the student's academic performance matches their career goal.
                Provide a Career Match Score (0-100%) with justification.

                ## 2. ACADEMIC STRENGTHS
                Identify strong subjects and how they align with the career goal.

                ## 3. AREAS FOR IMPROVEMENT
                Highlight subjects/skills that need improvement with specific targets.

                ## 4. EDUCATIONAL ROADMAP
                Provide a step-by-step educational pathway:
                - Immediate next steps (which stream/courses to choose)
                - Undergraduate options (specific colleges, courses)
                - Postgraduate options if applicable
                - Timeline for each stage

                ## 5. COMPETITIVE EXAMS
                List all relevant competitive exams with:
                - Exam name and conducting body
                - Eligibility criteria
                - Exam pattern briefly
                - Preparation timeline
                - Expected cutoff scores

                ## 6. CAREER & JOB OPPORTUNITIES
                After completing education:
                - Entry-level positions available
                - Mid-career opportunities
                - Senior/leadership roles
                - Government job options
                - Private sector opportunities
                - Expected salary range (in INR) at each level

                ## 7. ALTERNATIVE CAREER PATHS
                2-3 alternative careers based on academic profile if primary goal seems challenging.

                ## 8. ACTION PLAN
                Immediate 3-month, 6-month, and 1-year action plan with specific steps.

                ## 9. MOTIVATIONAL MESSAGE
                A personalized encouraging message for the student.

                Be specific, realistic, and encouraging throughout the response.
                """);

        return sb.toString();
    }

    private void appendIfNotNull(StringBuilder sb, String subject, Double marks) {
        if (marks != null && marks > 0) {
            sb.append("  - ").append(subject).append(": ").append(marks).append("/100\n");
        }
    }

    private Double extractMatchPercentage(String response) {
        try {
            String[] patterns = {"Match Score:", "Career Match Score:", "Match Percentage:", "match score of", "score:"};
            for (String pattern : patterns) {
                int idx = response.toLowerCase().indexOf(pattern.toLowerCase());
                if (idx != -1) {
                    String sub = response.substring(idx + pattern.length(), Math.min(idx + pattern.length() + 10, response.length()));
                    sub = sub.replaceAll("[^0-9.]", "").trim();
                    if (!sub.isEmpty()) {
                        return Double.parseDouble(sub.substring(0, Math.min(sub.length(), 5)));
                    }
                }
            }
        } catch (Exception ignored) {
        }
        return 75.0;
    }
}
