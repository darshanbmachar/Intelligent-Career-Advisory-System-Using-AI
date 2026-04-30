# 🎓 PathFinder AI — Career Adviser

An AI-powered career guidance system for Indian students built with **Spring Boot + Spring AI** (backend) and **React + Vite** (frontend).

---

## 🏗️ Architecture

```
career-adviser-backend/    ← Spring Boot + Spring AI (Port 8080)
career-adviser-frontend/   ← React + Vite (Port 3000)
```

---

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Maven 3.8+
- Node.js 18+
- An **OpenRouter API key** for an OpenAI-compatible model

---

### 1. Start the Backend

```bash
cd career-adviser-backend

# Set your OpenRouter API key (choose one):
export OPENROUTER_API_KEY=sk-or-v1-your-key-here          # Linux/Mac
set OPENROUTER_API_KEY=sk-or-v1-your-key-here             # Windows CMD
$env:OPENROUTER_API_KEY="sk-or-v1-your-key-here"          # PowerShell

# Run
mvn spring-boot:run
```

Backend starts at: **http://localhost:8080**

Test it:
```bash
curl http://localhost:8080/api/career/health
```

---

### 2. Start the Frontend

```bash
cd career-adviser-frontend
npm install
npm run dev
```

Frontend opens at: **http://localhost:3000**

---

## 🔑 API Key Setup

Get your OpenRouter API key from: https://openrouter.ai/keys

You can also set it in `src/main/resources/application.properties`:
```properties
spring.ai.openai.api-key=
spring.ai.openai.base-url=https://openrouter.ai/api
spring.ai.openai.chat.options.model=openai/gpt-4o-mini
```

> ⚠️ Never commit your API key to version control!

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/career/health` | Health check |
| GET | `/api/career/streams` | Available streams & subjects |
| POST | `/api/career/advise` | Get AI career advice |

### Sample Request (POST /api/career/advise)

```json
{
  "studentName": "Priya Sharma",
  "careerGoal": "Software Engineer / Developer",
  "location": "Chennai, Tamil Nadu",
  "tenthMarks": {
    "mathematics": 92,
    "science": 88,
    "socialScience": 75,
    "english": 85,
    "secondLanguage": 78,
    "totalPercentage": 83.6
  },
  "twelfthMarks": {
    "stream": "Science-PCM",
    "physics": 88,
    "chemistry": 82,
    "mathematics": 94,
    "english": 86,
    "computerScience": 96,
    "totalPercentage": 89.2
  }
}
```

---

## ✨ Features

- 📊 **10th & 12th Mark Analysis** — Enter marks for all subjects with stream-based subject selection
- 🎯 **Career Match Score** — AI calculates compatibility percentage
- 🗺️ **Educational Roadmap** — Step-by-step guide from school to career
- 📝 **Competitive Exams** — JEE, NEET, CLAT, UPSC, CAT and more
- 💼 **Job Opportunities** — Roles, salary ranges in INR, growth paths
- 🔀 **Alternative Career Paths** — Backup options based on academic profile
- ⚡ **Action Plan** — 3-month, 6-month, and 1-year goals
- 🖨️ **Print / PDF** — Save or print your report
- 📱 **Responsive** — Works on mobile, tablet, and desktop

---

## 🛠️ Tech Stack

### Backend
- **Spring Boot 3.3** — Application framework
- **Spring AI 1.0.0** — AI integration layer
- **OpenAI GPT-4o** — AI model
- **Lombok** — Boilerplate reduction
- **Bean Validation** — Input validation

### Frontend
- **React 18** — UI framework
- **Vite** — Build tool & dev server
- **React Markdown** — Markdown rendering
- **CSS Modules** — Scoped styling
- **Axios** — HTTP client

---

## 📁 Project Structure

```
career-adviser-backend/
├── src/main/java/com/careeradviser/
│   ├── CareerAdviserApplication.java
│   ├── config/
│   │   ├── CorsConfig.java
│   │   └── SpringAIConfig.java
│   ├── controller/
│   │   └── CareerAdviserController.java
│   ├── model/
│   │   ├── CareerAdviceRequest.java
│   │   └── CareerAdviceResponse.java
│   └── service/
│       └── CareerAdviserService.java
└── src/main/resources/
    └── application.properties

career-adviser-frontend/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── pages/
│   │   ├── LandingPage.jsx / .module.css
│   │   ├── FormPage.jsx   / .module.css
│   │   └── ResultPage.jsx / .module.css
│   ├── services/
│   │   └── api.js
│   └── styles/
│       └── globals.css
├── index.html
├── package.json
└── vite.config.js
```

---

## 🎨 UI Screens

1. **Landing Page** — Hero with animated orbs, feature grid, floating preview card
2. **Form (5 steps)** — Personal info → 10th marks → 12th marks → Career goal → Review
3. **Result Page** — Score ring, tabbed sections, full markdown report, print support

---

## 🔧 Troubleshooting

**Backend won't start?**
- Ensure Java 21 is installed: `java -version`
- Ensure OPENAI_API_KEY is set

**Frontend can't reach backend?**
- Verify backend is on port 8080
- Vite proxies `/api/*` to `localhost:8080` automatically

**AI response is slow?**
- GPT-4o can take 20–40 seconds for long responses
- Consider GPT-4o-mini for faster (less detailed) responses: change model in `application.properties`

---

## 📄 License

MIT — Free to use and modify.
