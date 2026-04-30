# Career Adviser Backend - Quick Start Guide

## Step 1: Ensure Correct Java Version

The project requires **Java 17** or **Java 21**. Java 25 is not yet supported.

### In IntelliJ IDEA:
1. Go to **File > Project Structure > Project**
2. Set **SDK** to JDK 17 or JDK 21
3. Set **Language level** to 17 or 21
4. Click **Apply** and **OK**

### Verify Java Version:
```powershell
java -version
javac -version
```

Should show version 17.x.x or 21.x.x, NOT 25.x.x

---

## Step 2: Update Lombok Plugin (IntelliJ IDEA)

1. Go to **File > Settings > Plugins**
2. Search for "Lombok"
3. Update to the latest version if available
4. Restart IntelliJ

---

## Step 3: Clean Build

### Option A: Using IntelliJ IDE
1. Go to **Build > Clean Project**
2. Go to **Build > Rebuild Project**

### Option B: Using Maven (if installed)
```powershell
cd "e:\darshan\career-adviser-backend\career-adviser-backend"
mvn clean compile
```

### Option C: Using Maven within IntelliJ
1. Right-click on `pom.xml` in Project view
2. Select **Run Maven > clean**
3. Then select **Run Maven > compile**

---

## Step 4: Run the Application

### Option A: Using IntelliJ IDE
1. Open `CareerAdviserApplication.java`
2. Click the green **Run** button or press **Shift+F10**

### Option B: Using Maven
```powershell
cd "e:\darshan\career-adviser-backend\career-adviser-backend"
mvn spring-boot:run
```

### Option C: Using Terminal in IntelliJ
1. Open Terminal (Alt+F12)
2. Run:
```powershell
mvn spring-boot:run
```

---

## Step 5: Verify Application is Running

Check the health endpoint:
```powershell
curl http://localhost:8080/api/career/health
```

You should see:
```json
{"status":"UP","service":"Career Adviser API","version":"1.0.0"}
```

---

## Step 6: Set OpenRouter API Key

The application uses Spring AI's OpenAI-compatible client with OpenRouter. Set your OpenRouter API key as an environment variable:

### Windows PowerShell:
```powershell
$env:OPENROUTER_API_KEY = "sk-or-v1-YOUR-API-KEY-HERE"
```

Or edit `application.properties`:
```
spring.ai.openai.api-key=
spring.ai.openai.base-url=https://openrouter.ai/api
spring.ai.openai.chat.options.model=openai/gpt-4o-mini
```

---

## Step 7: Test the API

See **API_TESTING_GUIDE.md** for comprehensive testing examples.

Quick test:
```powershell
curl -X POST http://localhost:8080/api/career/advise `
  -H "Content-Type: application/json" `
  -d '{"studentName":"John","careerGoal":"Software Engineer","tenthMarks":{"mathematics":95,"totalPercentage":89}}'
```

---

## Common Issues

| Issue | Solution |
|-------|----------|
| `javac 25.0.2 was used` | Change IDE SDK to JDK 17/21, not 25 |
| `TypeTag :: UNKNOWN` | Ensure Lombok plugin is updated |
| `Connection refused` | Verify app is running on port 8080 |
| `AI response missing` | Check OpenAI API key is set |
| `CORS errors` | Verify `http://localhost:3000` is in allowed origins |

---

## Project Structure

```
career-adviser-backend/
├── src/main/java/com/careeradviser/
│   ├── CareerAdviserApplication.java      (Main entry point)
│   ├── controller/
│   │   └── CareerAdviserController.java   (REST endpoints)
│   ├── service/
│   │   └── CareerAdviserService.java      (Business logic with AI)
│   ├── model/
│   │   ├── CareerAdviceRequest.java       (Request DTO)
│   │   └── CareerAdviceResponse.java      (Response DTO)
│   └── config/
│       ├── CorsConfig.java                (CORS setup)
│       └── SpringAIConfig.java            (AI client configuration)
├── src/main/resources/
│   └── application.properties             (Configuration)
└── pom.xml                                (Dependencies)
```

---

## Need Help?

- Check logs in IDE console for detailed error messages
- Verify all environment variables are set
- Ensure port 8080 is not in use: `netstat -ano | findstr :8080`
- Check OpenAI API key format and validity


