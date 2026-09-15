# InterviewAI — AI Mock Interview & Resume Analyzer

InterviewAI is a full-stack AI-powered career preparation platform that helps job seekers analyze their resumes, improve ATS compatibility, practice mock interviews, and receive personalized AI feedback.

## Features

### AI Resume Analyzer
- Upload your resume in PDF format
- Extract resume content automatically
- AI-powered resume analysis
- ATS compatibility score
- Identify resume strengths and weaknesses
- Find missing keywords
- Get personalized improvement suggestions

### AI Mock Interview
- Choose your desired job role
- Select interview difficulty
- Generate AI-powered interview questions
- Submit answers for evaluation
- Receive an AI-generated score
- Get feedback on:
  - Confidence
  - Clarity
  - Technical Accuracy
  - Strengths
  - Weaknesses
  - Better Answer
  - Improvement Tips

### Dashboard
- Resume/ATS score
- Total interviews completed
- Average interview score
- Interview performance progress
- Recent interview activity
- Quick actions

### Interview History
- View previous interview attempts
- Review scores and feedback
- Track interview performance over time

### Authentication
- User registration and login
- JWT-based authentication
- Protected API routes
- Secure user-specific data

### Profile
- View and manage user profile
- Track resume and interview performance

---

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hook Form
- Framer Motion
- Recharts
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- PDF Parse

### AI
- Groq API
- OpenAI GPT-OSS 120B

---

## Project Structure

```text
InterviewAI/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   ├── utils/
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── README.md