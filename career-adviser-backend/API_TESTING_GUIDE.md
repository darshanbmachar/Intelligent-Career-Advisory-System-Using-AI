# Career Adviser API - Testing Guide

## Prerequisites
- Application must be running on `http://localhost:8080`
- OpenAI API key must be set in environment or `application.properties`

## Health Check Endpoint

**Test if the application is running:**

```bash
curl http://localhost:8080/api/career/health
```

**Expected Response:**
```json
{
  "status": "UP",
  "service": "Career Adviser API",
  "version": "1.0.0"
}
```

---

## Get Available Streams Endpoint

**Get information about available streams and career options:**

```bash
curl http://localhost:8080/api/career/streams
```

**Expected Response:**
```json
{
  "tenthSubjects": [...],
  "twelfthStreams": {...},
  "popularCareerGoals": [...]
}
```

---

## Career Advice Endpoint (Main Feature)

**Request Career Advice for a Student:**

```bash
curl -X POST http://localhost:8080/api/career/advise \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "John Doe",
    "careerGoal": "Software Engineer",
    "tenthMarks": {
      "mathematics": 95,
      "science": 92,
      "socialScience": 88,
      "english": 90,
      "secondLanguage": 85,
      "thirdLanguage": 82,
      "totalPercentage": 89
    },
    "twelfthMarks": {
      "stream": "Science-PCM",
      "physics": 94,
      "chemistry": 91,
      "mathematics": 96,
      "computerScience": 98,
      "english": 89,
      "totalPercentage": 93
    },
    "stream": "Science",
    "location": "Maharashtra",
    "languageMedium": "English"
  }'
```

**Expected Response:**
```json
{
  "studentName": "John Doe",
  "careerGoal": "Software Engineer",
  "careerMatchPercentage": 95,
  "fullAdvice": "Comprehensive career guidance from AI...",
  "success": true,
  "errorMessage": null
}
```

---

## Testing Tools

### Using PowerShell (Windows)
```powershell
$body = @{
    studentName = "John Doe"
    careerGoal = "Software Engineer"
    tenthMarks = @{
        mathematics = 95
        science = 92
        totalPercentage = 89
    }
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/career/advise" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

### Using Postman
1. Import the requests into Postman
2. Set Base URL to `http://localhost:8080`
3. Create POST request to `/api/career/advise`
4. Set Body as JSON with student details

---

## Troubleshooting

- **Connection Refused**: Ensure the application is running (`mvn spring-boot:run`)
- **401/403 Errors**: Check CORS configuration and allowed origins
- **AI Response Missing**: Verify OpenAI API key is set correctly
- **Validation Errors**: Ensure all required fields are provided in the request


