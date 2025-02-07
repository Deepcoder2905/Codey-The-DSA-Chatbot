from flask import Flask, jsonify, request, render_template
import os
from flask_sqlalchemy import SQLAlchemy
import google.generativeai as genai
from flask_login import LoginManager, UserMixin, login_user
from werkzeug.security import generate_password_hash, check_password_hash
from flask import session
import faiss
import numpy as np
from langchain.embeddings import HuggingFaceEmbeddings
import json
import random

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.sqlite3'
app.config['SECRET_KEY'] = 'Deepubhai'
app.config['SECURITY_PASSWORD_SALT'] = 'Deepu'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False
topics = [
    {"name": "Problems", "description": "Explore various algorithmic problems to practice and improve."},
    {"name": "Notes", "description": "Access detailed notes on different DSA concepts."},
    {"name": "Playlists", "description": "View curated playlists to enhance your learning experience."}
]


# embeddings = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

# def load_dsa_problems():
#     """Load DSA problems from JSON file"""
#     with open('dsa_problems.json', 'r') as f:
#         return json.load(f)

# def load_faiss_index():
#     """Load FAISS index and documents"""
#     index = faiss.read_index("faiss_index.bin")
#     with open("documents.txt", "r", encoding="utf-8") as f:
#         documents = f.read().split("\n\n")
#     return index, documents

# def retrieve_relevant_context(question, top_k=3):
#     query_embedding = embeddings.encode([question])
#     faiss_index, documents = load_faiss_index()
#     D, I = faiss_index.search(query_embedding, top_k)
    
#     retrieved_docs = []
#     for i in I[0]:
#         if 0 <= i < len(documents):
#             retrieved_docs.append(documents[i])
    
#     return "\n\n".join(retrieved_docs) if retrieved_docs else "No relevant context found."

# def get_problem_state(session_id):
#     """Get or initialize problem state for the session"""
#     if 'problem_state' not in session:
#         session['problem_state'] = {
#             'current_problem': None,
#             'hints_given': 0,
#             'solution_shown': False,
#             'test_cases_shown': False
#         }
#     return session['problem_state']
faiss_index = faiss.read_index("faiss_index.bin")
with open("qa_pairs.json", "r", encoding="utf-8") as f:
    qa_list = json.load(f)
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

def get_problem_state():
    """Initializes or returns the current problem state stored in session."""
    if 'problem_state' not in session:
        session['problem_state'] = {
            'current_question': None,  # the selected question text
            'qa_index': None         # the index in qa_list for the active problem
        }
    return session['problem_state']

# @app.route('/api/chatbot1', methods=['POST'])
# def chatbot1():
#     try:
#         data = request.json
#         action = data.get('action', 'question')
#         user_input = data.get('question', '').strip()
#         code = data.get('code', '')
#         user_id = session.get('user_id')

#         if not user_id:
#             return jsonify({"error": "User not logged in"}), 401

#         problem_state = get_problem_state(session.get('id'))
#         dsa_problems = load_dsa_problems()
#         if action == 'start':
#             retrieved_text = retrieve_relevant_context("DSA problem statement")
#             # Find matching problem in dataset
#             problem = next((p for p in dsa_problems if p['problem_statement'] in retrieved_text), None)
            
#             if not problem:
#                 return jsonify({"error": "No relevant problem found"}), 400

#             # Initialize problem state with full data
#             problem_state.update({
#                 'current_problem': problem,
#                 'hints_given': 0,
#                 'solution_shown': False,
#                 'test_cases_shown': False
#             })
            
#             system_instruction = "Present this DSA problem clearly:"
#             context = problem['problem_statement']
#         elif action == 'hint':
#             if not problem_state['current_problem']:
#                 return jsonify({"error": "No active problem"}), 400
                
#             system_instruction = (
#                 "You are a DSA tutor bot providing a hint. "
#                 f"This is hint number {problem_state['hints_given'] + 1}. "
#                 "Provide a helpful hint without giving away the complete solution."
#             )
#             context = problem_state['current_problem']['hints'][problem_state['hints_given']]
#             problem_state['hints_given'] += 1
            
#         elif action == 'test_cases':
#             if not problem_state['current_problem']:
#                 return jsonify({"error": "No active problem"}), 400
                
#             system_instruction = (
#                 "You are a DSA tutor bot providing test cases. "
#                 "Present test cases clearly with inputs and expected outputs."
#             )
#             context = problem_state['current_problem']['test_cases']
#             problem_state['test_cases_shown'] = True
            
#         elif action == 'solution':
#             if not problem_state['current_problem']:
#                 return jsonify({"error": "No active problem"}), 400
                
#             system_instruction = (
#                 "You are a DSA tutor bot providing the solution. "
#                 "Explain the solution clearly with step-by-step reasoning."
#             )
#             context = problem_state['current_problem']['solution']
#             problem_state['solution_shown'] = True
            
#         elif action == 'run_code':
#             if not problem_state['current_problem']:
#                 return jsonify({"error": "No active problem"}), 400
                
#             system_instruction = (
#                 "You are a DSA tutor bot reviewing code. "
#                 "Check for correctness, efficiency, and provide specific feedback. "
#                 "If there are errors, explain them and suggest improvements."
#             )
#             context = f"""
#             Problem: {problem_state['current_problem']['problem_statement']}
#             Student's Code: {code}
#             Test Cases: {problem_state['current_problem']['test_cases']}
#             """
            
#         else: 
#             system_instruction = (
#                 "You are a DSA tutor bot. "
#                 "Answer the student's question clearly and helpfully. "
#                 "If they're stuck, encourage them to try a hint first."
#             )
#             context = retrieve_relevant_context(user_input)

#         prompt = f"""System Instruction: {system_instruction}
        
#         Context: {context}
        
#         User: {user_input}
        
#         Assistant:"""
        
#         response = chat_session.send_message(prompt)
#         chatbot_response = response.text

#         session.modified = True
#         return jsonify({"response": chatbot_response})
        
#     except Exception as e:
#         app.logger.error(f"Error in chatbot1: {str(e)}", exc_info=True)
#         return jsonify({"error": "Internal server error"}), 500
@app.route('/api/chatbot1', methods=['POST'])
def chatbot1():
    try:
        data = request.json
        action = data.get('action', 'question')
        user_input = data.get('question', '').strip()
        code = data.get('code', '')
        user_id = session.get('user_id')
        
        if not user_id:
            return jsonify({"error": "User not logged in"}), 401
        
        problem_state = get_problem_state()
        
        if action == 'question':
            query_embedding = embeddings.embed_query(user_input)
            query_embedding = np.array([query_embedding]).astype(np.float32)
            k = 5  # retrieve top 5 matches
            distances, indices = faiss_index.search(query_embedding, k)
            indices = indices[0].tolist()
            
            # Filter out any invalid indices and randomly choose one of the top candidates
            valid_indices = [i for i in indices if i < len(qa_list)]
            if not valid_indices:
                return jsonify({"error": "No relevant problem found"}), 400
            chosen_index = random.choice(valid_indices)
            selected_qa = qa_list[chosen_index]
            
            # Store the active problem state (question and its index)
            problem_state['current_question'] = selected_qa['question']
            problem_state['qa_index'] = chosen_index
            session.modified = True
            
            system_instruction = "You are a DSA tutor. Present the following problem clearly."
            context = selected_qa['question']
        
        elif action == 'solution':
            # Ensure there is an active problem to provide a solution for.
            if problem_state.get('qa_index') is None:
                return jsonify({"error": "No active problem to show a solution for"}), 400

            selected_qa = qa_list[problem_state['qa_index']]
            raw_solution = selected_qa['solution']
            
            # A rudimentary formatter: add newlines after semicolons and before/after braces.
            formatted_solution = raw_solution
            formatted_solution = formatted_solution.replace("; ", ";\n")
            formatted_solution = formatted_solution.replace("{", "{\n")
            formatted_solution = formatted_solution.replace("}", "\n}")
            
            # Wrap in a markdown code block with syntax highlighting.
            formatted_solution = "\n```cpp\n" + formatted_solution + "\n```\n"

            # Return the formatted solution directly.
            return jsonify({"response": formatted_solution})


        
        elif action == 'hint':
            # For other actions, you can simply provide system-driven responses.
            if not problem_state.get('current_question'):
                return jsonify({"error": "No active problem"}), 400
            
            system_instruction = "You are a DSA tutor. Provide a helpful hint."
            # A generic hint; you might want to improve this logic.
            context = "Consider breaking the problem into smaller subproblems."
        
        elif action == 'test_cases':
            if not problem_state.get('current_question'):
                return jsonify({"response": "No active problem. Please start a problem first."}),400
            
            # Use a fixed instruction and context for test cases.
            system_instruction = (
        "You are a DSA tutor. Provide a set of test cases for the problem in a format similar to LeetCode. "
        "For each test case, list the Input and Expected Output. "
        "Be sure to include edge cases and typical cases. "
        "Format the answer clearly and succinctly."
    )
            # You could either use a static response or a predetermined text here.
            context = "Test cases: Consider the edge cases, such as the smallest input (e.g., 0 or 1) and the largest possible input based on the problem constraints."
    
        
        elif action == 'run_code':
            if not problem_state.get('current_question'):
                return jsonify({"error": "No active problem"}), 400
            
            system_instruction = "You are a DSA tutor reviewing the student's code. Provide feedback."
            context = f"""
Problem: {problem_state.get('current_question')}
Student's Code: {code}
Expected: Consider edge cases.
"""
        else:
            # Default generic answer using system instructions only.
            system_instruction = "You are a DSA tutor. Answer the student's question."
            context = "Provide a clear and concise answer."

        prompt = f"""System Instruction: {system_instruction}

Context: {context}

User: {user_input}

Assistant:"""
        
        # Here we assume that chat_session.send_message() is the function that sends the prompt to your language model.
        response = chat_session.send_message(prompt)
        chatbot_response = response.text
        
        return jsonify({"response": chatbot_response})
    
    except Exception as e:
        app.logger.error(f"Error in chatbot1: {str(e)}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500
@app.route('/')
def index():
    return render_template('home.html')

db = SQLAlchemy(app)
login_manager = LoginManager(app)

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy import JSON

class ChatSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    conversation = db.Column(MutableList.as_mutable(JSON), default=list)  # Changed to use MutableList


class UserAttempt(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    problem = db.Column(db.String(255), nullable=False)
    attempted = db.Column(db.Boolean, default=False)

class Problem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    topic = db.Column(db.String(255))
    problem = db.Column(db.String(255))
    link = db.Column(db.String(255))

with app.app_context():
    db.create_all()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

from flask import jsonify, request
from sqlalchemy.orm import joinedload

@app.route('/api/problems', methods=['GET'])
def get_problems():
    # Fetch all problems from the database
    problems = Problem.query.all()

    # Group problems by topic and format data
    problems_data = {}
    for problem in problems:
        if problem.topic not in problems_data:
            problems_data[problem.topic] = []
        problems_data[problem.topic].append({
            'Problem': problem.problem,
            'Link': problem.link
        })

    # Fetch attempted problems for the user (assuming user_id is passed in query params)
    user_id = request.args.get('user_id')
    user_attempts = UserAttempt.query.filter_by(user_id=user_id).all()

    # Add attempted status to problems_data
    attempted_dict = {attempt.problem: attempt.attempted for attempt in user_attempts}
    
    for topic, problems in problems_data.items():
        for problem in problems:
            problem['Attempted'] = attempted_dict.get(problem['Problem'], False)

    return jsonify(problems_data)

@app.route('/api/user_id', methods=['GET'])
def get_user_id():
    username = request.args.get('username')
    user = User.query.filter_by(username=username).first() 
    if user:
        return jsonify({'user_id': user.id}), 200
    else:
        return jsonify({'error': 'User not found'}), 404
@app.route('/api/playlists', methods=['GET'])
def get_playlists():
    playlists = [
        {"title": "Data Structures Playlist", "link": "https://www.youtube.com/watch?v=qNGyI95E5AE&list=PLxCzCOWd7aiEwaANNt3OqJPVIxwp2ebiT&ab_channel=GateSmashers","videoCount":64}, 
        {"title": "Algorithms Playlist", "link": "https://www.youtube.com/watch?v=0IAPZzGSbME&list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O&ab_channel=AbdulBari","videoCount":84},
        {"title": "Strivers A2Z Playlist", "link": "https://youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz&si=WfAa9E-MGb4O2wvD","videoCount":316},
        {"title": "C++ DSA Playlist by Apna College", "link": "https://youtube.com/playlist?list=PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt&si=8FXimTKYnnCCQpKj","videoCount":69},
        {"title": "C++ DSA Playlist by Babbar", "link": "https://youtube.com/playlist?list=PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA&si=TuYvsF8ptWr9iE1Q","videoCount":149},
        # Add more playlists as needed
    ]
    return jsonify(playlists)


@app.route('/api/attempt', methods=['POST'])
def save_attempt():
    data = request.json
    user_id = data['user_id']
    problem = data['problem']
    attempted = data['attempted']

    attempt = UserAttempt.query.filter_by(user_id=user_id, problem=problem).first()

    if attempt:
        attempt.attempted = attempted
    else:
        new_attempt = UserAttempt(user_id=user_id, problem=problem, attempted=attempted)
        db.session.add(new_attempt)
    
    db.session.commit()
    
    return jsonify({'message': 'Attempt status updated successfully'})



@app.route('/register', methods=['POST'])
def register():
    input_data = request.get_json()
    email = input_data.get('email')
    username = input_data.get('username')
    password = input_data.get('password')

    if not email or not username or not password:
        return jsonify({'message': 'Email, Username, and Password are required.'}), 400

    # Check if the username or email already exists
    existing_user = User.query.filter((User.username == username) | (User.email == email)).first()
    if existing_user:
        if existing_user.username == username:
            return jsonify({'message': 'Username already registered.'}), 400
        if existing_user.email == email:
            return jsonify({'message': 'Email already registered.'}), 400

    # Create new user
    new_user = User(username=username, email=email, password=generate_password_hash(password))
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"message": "Username and Password are required."}), 400

    user = User.query.filter_by(username=username).first()
    
    if user:
        if check_password_hash(user.password, password):
            login_user(user)
            session['user_id'] = user.id
            return jsonify({"message": "Logged in successfully"}), 200
        else:
            return jsonify({"message": "Invalid credentials"}), 401
    else:
        return jsonify({"message": "User not found"}), 404

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)  
    return jsonify({"message": "Logout successful"}), 200


@app.route('/api/topics', methods=['GET'])
def get_topics():
    return jsonify(topics)

genai.configure(api_key="AIzaSyCuv5PR6TN475s9m5pKFNLBy_z0cMA0Nx4")

generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain"
}

# Create the model with system instructions
model = genai.GenerativeModel(
    model_name="gemini-1.5-pro",
    generation_config=generation_config,
system_instruction="""🌟 Welcome to Your DSA Learning Adventure! 🌟

As your friendly coding companion, I'm here to:
1. Start with a quick snackable intro for every query (1-2 sentences max!)
2. Ask thought-provoking questions using the Socratic method 🤔
3. Help you discover solutions through guided thinking 🧠
4. Celebrate your progress with emoji-powered encouragement! 🎉

Example Flow:
You: "How do I reverse a linked list?"
Me: "Ah, linked list reversal! 🔄 This fundamental operation helps understand pointer manipulation. 
     What if we tried to reverse the direction of node connections? Which pointer would you adjust first?"

For non-DSA questions:
"While I'm specialized in DSA magic, I'd be thrilled to help with algorithms, data structures, 
or interview prep! What coding challenge can we tackle today? 💻✨."
Note:Please provide test cases in plain text format without markdown bullet points or asterisks. Format the output as a numbered list if needed.
Let's make learning interactive and fun! Ready to level up your coding skills? 🚀"""
)
chat_session = model.start_chat(
  history=[
  ]
)
@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    data = request.json
    student_question = data.get('question', '')
    session_id = data.get('session_id')  # Get session ID from request
    user_id = session.get('user_id')
    
    if not user_id:
        return jsonify({"error": "User not logged in"}), 401

    try:
        # Get the specific chat session
        chat_session_record = ChatSession.query.filter_by(
            id=session_id, 
            user_id=user_id
        ).first()
        
        if not chat_session_record:
            return jsonify({"error": "Chat session not found"}), 404

        # Convert stored messages to Gemini's history format
        history = []
        for msg in chat_session_record.conversation:
            role = 'user' if msg['sender'] == 'user' else 'model'
            history.append({
                'role': role,
                'parts': [{'text': msg['text']}]
            })

        # Create fresh chat session with history
        current_chat = model.start_chat(history=history)
        response = current_chat.send_message(student_question)
        chatbot_response = response.text

        # Update conversation
        user_message = {"sender": "user", "text": student_question}
        assistant_message = {"sender": "assistant", "text": chatbot_response}
        
        chat_session_record.conversation.extend([user_message, assistant_message])
        db.session.commit()
        
        return jsonify({"response": chatbot_response})
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
@app.route('/api/chat_sessions', methods=['POST'])
def create_chat_session():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "User not logged in"}), 401

    try:
        new_session = ChatSession(user_id=user_id, conversation=[])
        db.session.add(new_session)
        db.session.commit()
        
        return jsonify({
            'id': new_session.id,
            'conversation': []
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
@app.route('/api/chat_sessions', methods=['GET'])
def get_chat_sessions():  # Changed to plural to match the route
    user_id = session.get('user_id')

    if not user_id:
        return jsonify({"error": "User not logged in"}), 401

    try:
        # Get all chat sessions for the user
        chat_sessions = ChatSession.query.filter_by(user_id=user_id).all()
        
        # Format the response
        sessions = [
            {
                'id': session.id,
                'conversation': session.conversation
            }
            for session in chat_sessions
        ]

        return jsonify(sessions)  # Return array of sessions
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/api/chat_sessions/<int:session_id>', methods=['GET'])
def get_chat_session_param(session_id):
    user_id = session.get('user_id')

    if not user_id:
        return jsonify({"error": "User not logged in"}), 401

    try:
        chat_message = ChatSession.query.filter_by(id=session_id, user_id=user_id).first()

        if not chat_message:
            return jsonify({"error": "Chat session not found"}), 404

        return jsonify({"conversation": chat_message.conversation})
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

# Fallback route for SPA (Single Page Application)
@app.route('/<path:path>')
def fallback(path):
    return render_template('home.html')

if __name__ == '__main__':
    app.run(debug=True)
