# Codey - The Intelligent DSA Assistant

## Overview
Codey is an AI-powered platform designed to help you master Data Structures and Algorithms (DSA) through interactive learning. The platform includes:

- **Problem Sheet**: Keep track of the problems you have solved.
- **Resources**: Quick access to curated notes and essential playlists.
- **Socratic Chatbot**: Engage in a Socratic method-based dialogue to deepen your understanding.
- **Practice Bot (RAG-based)**: Get a random question with the ability to request hints, view test cases, run your code, and receive a full solution from the chatbot.

---

## Features
1. **Problem Sheet**
   - Track and manage your solved, attempted, and unsolved problems.
   - Visual progress tracking for continuous improvement.

2. **Learning Resources**
   - Direct links to comprehensive notes on various DSA topics.
   - Curated YouTube playlists for in-depth learning.

3. **Socratic Chatbot**
   - Learn through an AI-driven conversation that prompts critical thinking.
   - Get guided help without directly spoon-feeding answers.

4. **Practice Bot (RAG-based)**
   - Generates a random DSA question for practice.
   - Provides:
     - **Hints:** Nudge you in the right direction.
     - **Test Cases:** Validate your solution.
     - **Code Execution:** Run your code to test your approach.
     - **Full Solution:** Get the complete answer from the chatbot after your attempt.

---

## Tech Stack
- **Flask**: Backend API framework.
- **SQLite**: Database for tracking user progress.
- **Vue.js**: Frontend framework for building interactive UIs.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **FAISS**: Efficient similarity search library.
- **LangChain**: AI framework for building language model applications.

---
## Project Structure

```bash
│   app.py
│   Codey.zip
│   DSA.pdf
│   faiss_index.bin
│   index_pdf.py
│   qa_pairs.json
│
├───instance
│       data.sqlite3
│
├───static
│   │   index.js
│   │   router.js
│   │
│   ├───components
│   │       chatbot.js
│   │       chatbot1.js
│   │       home.js
│   │       login.js
│   │       navbar.js
│   │       playlist.js
│   │       problems.js
│   │       register.js
│   │
│   ├───css
│   │       style.css
│   │
│   └───data
│           IMPORTANT DSA PROBLEMS List Backup.xlsx
│
└───templates
        home.html
```

### Steps to Run the Project

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/codey.git
   cd codey
2. **Run the app**
    ```bash
    python app.py

