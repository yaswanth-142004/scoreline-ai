# ScoreLine AI

**ScoreLine AI** is an AI-powered academic evaluation platform designed to assist teachers in efficiently analyzing student answer sheets. By leveraging OCR and AI algorithms, the system compares student responses with the correct answer key and generates insights on performance, strengths, and improvement areas. The application also supports real-time student-counselor interactions for personalized guidance.

---

## ✨ Features

- 🧾 **Upload Answer Sheets**: Teachers can upload student answer sheets and associated question papers.
- 📊 **AI-Based Evaluation**: The backend uses OCR and intelligent matching to evaluate student answers.
- 📃 **Answer Key Integration**: Teachers can upload correct answers to be used for automated scoring.
- 🧠 **Chatbot Interface**: Students can chat with an AI-powered mental wellness bot.
- 👩‍🏫 **Live Counselor Chat**: Students can interact with human counselors through real-time WebSocket-based messaging.
- 📈 **Performance Reports**: Automatically generated mental wellness and academic performance reports in PDF format.
- 🔐 **Role-Based Access**: Secure authentication system with separate dashboards for Teachers and Students.

---

## 🧠 Tech Stack

| Layer         | Technology                            |
|---------------|----------------------------------------|
| **Frontend**  | React (Vite), JavaScript, Tailwind CSS |
| **Backend**   | FastAPI, Python                        |
| **Database**  | MongoDB                                |
| **AI / OCR**  | Gemini API, ReportLab, Tesseract OCR   |
| **Chat**      | WebSocket (Socket.io), MongoDB         |
| **Auth**      | JWT, Google OAuth                      |
| **Storage**   | Local/FileSystem (can switch to S3)    |

---

## 🚀 Setup Instructions

### 📋 Prerequisites

- Python 3.9+
- Node.js v16+
- MongoDB running locally or on Atlas
- pip / npm

---

### 🧩 Backend (FastAPI)

```bash
# Clone the repository
git clone https://github.com/your-username/scoreline-ai.git
cd scoreline-ai/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload


## 🖼️ Application Screenshots

> All screenshots are located in the `pictures/` folder.

### 🏠 Home Page
![Home](pictures/home.png)

### ℹ️ About Page
![About](pictures/about.png)

### 👤 Profile Page
![Profile](pictures/profile.png)

### ⚙️ Evaluation in Progress
![Working 1](pictures/working1.png)

### 📈 Performance Report
![Working 2](pictures/working2.png)

