# Mock Test Platform

An online mock test platform designed to help students practice technical subjects, attempt MCQ-based tests, evaluate their performance, and improve their exam preparation.

## Features

- **Online Mock Tests:** Attempt multiple-choice questions (MCQs).
- **Subject-Wise Practice:** Practice topics such as JavaScript, SQL, PostgreSQL, DBMS, and Software Engineering.
- **Test Timer:** Complete tests within a specified time limit.
- **Automatic Evaluation:** Calculate scores based on submitted answers.
- **Result Dashboard:** View marks, correct answers, incorrect answers, and overall performance.
- **Test History:** Review previous test attempts.
- **Question Management:** Store and manage questions in a database.
- **AI Integration (Planned):** Provide explanations, personalized feedback, and recommendations for improvement.

## Technology Stack

### Frontend
- React.js
- Vite
- JavaScript
- Tailwind CSS

### Backend
- Node.js
- Express.js
- REST APIs

### Database
- PostgreSQL

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: Neon PostgreSQL

*The deployment setup and technology stack may be updated as development progresses.*

## Project Structure

```text
Mocktest-project/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── app.js
│   └── package.json
│
├── .gitignore
└── README.md
```

*This structure represents the planned organization; actual folders may differ during development.*

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd Mocktest-project
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
npm run dev
```

### 3. Install Backend Dependencies

Open another terminal:

```bash
cd backend
npm install
```

Configure the required environment variables and database connection before starting the backend.

```bash
npm run dev
```

*The commands depend on the scripts configured in each `package.json`.*

## Database Design

The database will manage the following entities:

- **Users:** Student account details and authentication.
- **Subjects:** Available subjects for practice.
- **Tests:** Test titles, duration, and subject information.
- **Questions:** MCQ questions and their options.
- **Test Attempts:** Student test submissions and scores.
- **Attempt Answers:** Answers selected by students for individual questions.

PostgreSQL relationships will connect tests, questions, users, and test attempts to maintain consistent data.

## Test Workflow

1. Student selects a subject or mock test.
2. The platform fetches questions from the database.
3. Student answers MCQs within the allotted time.
4. Student submits the test.
5. The backend evaluates the answers.
6. The platform saves the result and attempt history.
7. The dashboard displays the score and performance analysis.

## Security

- Store passwords securely using a suitable password-hashing algorithm.
- Keep database credentials and API keys in environment variables.
- Validate incoming API requests.
- Use backend authorization to protect restricted resources.
- Never expose correct answers or database credentials unnecessarily to the frontend.

## Future Enhancements

- AI-powered question explanations.
- Difficulty-based question selection.
- Topic-wise performance analysis.
- Leaderboards and rankings.
- Admin dashboard for managing questions and tests.
- Personalized practice recommendations.

## Project Goal

The goal is to build a scalable, database-driven online mock test platform that helps students practice technical subjects, identify knowledge gaps, and track their learning progress.

## License

This project is currently developed for learning and educational purposes.
