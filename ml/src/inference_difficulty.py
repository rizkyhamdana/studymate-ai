import os
import sys

# Ensure the project root is in sys.path so that joblib can unpickle custom classes under the 'ml' module
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if project_root not in sys.path:
    sys.path.append(project_root)

import joblib
import numpy as np

# A clean, highly optimized rule-based heuristic for quiz difficulty classification
# This serves as a highly robust fallback if the joblib model has not been trained yet.
def predict_difficulty_rules(question: str, topic: str = "General") -> dict:
    q_lower = question.lower()
    
    # Advanced keywords indicating Hard difficulty (proofs, derivations, mathematical optimization, complex reasoning)
    hard_words = [
        "derive", "prove", "optimize", "given a model", "critically", "assess", "evaluate",
        "consequences of", "implement a", "thread-safe", "overfitting", "underfitting",
        "contradiction", "layout thrashing", "molecular level",
        "buktikan", "rancang", "implementasikan", "analisis", "evaluasi", "bagaimana mengatasi", "derifasikan"
    ]
    # Medium complexity keywords (comparisons, structured descriptions, process mechanisms)
    medium_words = [
        "compare", "difference between", "how does", "explain how", "describe", "impact of",
        "kinetic", "potential", "mitosis", "meiosis", "server-side",
        "jelaskan perbedaan", "bagaimana cara kerja", "jelaskan konsep", "bagaimana pengaruh", "sistem kerja", "perbedaan antara"
    ]
    
    score = 0.5 # Default medium
    
    # Calculate simple word length heuristic (longer questions tend to be harder)
    words_count = len(question.split())
    
    if any(hw in q_lower for hw in hard_words) or words_count > 15:
        predicted = "hard"
        confidence = 0.85 if any(hw in q_lower for hw in hard_words) else 0.70
    elif any(mw in q_lower for mw in medium_words) or (10 <= words_count <= 15):
        predicted = "medium"
        confidence = 0.80 if any(mw in q_lower for mw in medium_words) else 0.65
    else:
        predicted = "easy"
        confidence = 0.90 if "what is" in q_lower or "define" in q_lower else 0.75
        
    return {
        "question": question,
        "predicted_difficulty": predicted,
        "confidence": confidence,
        "method": "rule_based_fallback"
    }

def predict_difficulty(question: str, topic: str = "General") -> dict:
    """
    Predicts the difficulty level ('easy', 'medium', or 'hard') of a question.
    Combines the question and topic to match the feature format used during training.
    
    If the trained model is not found, falls back gracefully to a heuristic rule classifier.
    """
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_path = os.path.join(base_dir, "models", "difficulty_classifier.joblib")
    
    if not os.path.exists(model_path):
        # Graceful fallback so API routes and local flows never fail before training
        return predict_difficulty_rules(question, topic)
        
    try:
        pipeline = joblib.load(model_path)
        feature_text = f"{question} {topic}"
        
        # Predict class label
        prediction = pipeline.predict([feature_text])[0]
        
        # Predict probability score for confidence reporting
        probabilities = pipeline.predict_proba([feature_text])[0]
        class_idx = np.where(pipeline.classes_ == prediction)[0][0]
        confidence = float(probabilities[class_idx])
        
        return {
            "question": question,
            "predicted_difficulty": str(prediction),
            "confidence": round(confidence, 4),
            "method": "ml_model"
        }
    except Exception as e:
        print(f"ML Inference failed ({e}). Running rule fallback...", flush=True)
        return predict_difficulty_rules(question, topic)

if __name__ == "__main__":
    # Test cases
    test_q1 = "What is a database index?"
    test_q2 = "Explain the difference between SQL and NoSQL databases."
    test_q3 = "Given a model with high training accuracy but low validation accuracy, explain the likely issue."
    
    print("Running Inference Demos:")
    print(predict_difficulty(test_q1, "Databases"))
    print(predict_difficulty(test_q2, "Databases"))
    print(predict_difficulty(test_q3, "Model Evaluation"))
