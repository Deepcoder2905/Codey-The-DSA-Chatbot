import re
import faiss
import numpy as np
import pymupdf  # pymupdf
from langchain_community.embeddings import HuggingFaceEmbeddings
import json

def extract_qa_pairs(pdf_path):
    """
    Extracts question and solution pairs from a PDF.
    Assumes that the PDF text is formatted as:
      Question: <question text>
      Solution: <solution text>
    and that multiple such pairs exist in the document.
    """
    doc = pymupdf.open(pdf_path)
    full_text = []
    for page in doc:
        full_text.append(page.get_text("text"))
    full_text = "\n".join(full_text)
    
    # Regular expression that finds a question and its corresponding solution.
    # This pattern uses DOTALL so that newlines are included.
    pattern = re.compile(r"Question:\s*(.*?)\s*Solution:\s*(.*?)(?=Question:|$)", re.DOTALL)
    qa_pairs = pattern.findall(full_text)
    
    qa_list = []
    for question, solution in qa_pairs:
        qa_list.append({
            "question": question.strip(),
            "solution": solution.strip()
        })
    return qa_list

def create_faiss_index(qa_list):
    """
    Creates a FAISS index using only the question text from each Q&A pair.
    Returns the index and the list of Q&A pairs.
    """
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    
    # Build a list of question texts
    question_texts = [qa["question"] for qa in qa_list]
    question_embeddings = np.array([embeddings.embed_query(q) for q in question_texts])
    
    # Ensure embeddings is 2D
    if len(question_embeddings.shape) == 1:
        question_embeddings = np.expand_dims(question_embeddings, axis=0)
    dimension = question_embeddings.shape[1]
    
    # Create a FAISS index using L2 (Euclidean) distance
    index = faiss.IndexFlatL2(dimension)
    index.add(question_embeddings.astype(np.float32))
    
    return index, qa_list

# Usage example:
pdf_path = "DSA.pdf"
qa_list = extract_qa_pairs(pdf_path)
faiss_index, qa_list = create_faiss_index(qa_list)

# Save the FAISS index to disk if desired
faiss.write_index(faiss_index, "faiss_index.bin")

# Save the Q&A pairs to a JSON file (or any other format you prefer)
with open("qa_pairs.json", "w", encoding="utf-8") as f:
    json.dump(qa_list, f, indent=2)
