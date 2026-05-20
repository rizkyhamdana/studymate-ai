import os
import pandas as pd
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import joblib

from ml.src.quiz_difficulty_dataset import load_difficulty_dataset

def evaluate_model():
    """
    Loads the saved model and evaluates it against the entire sample dataset.
    Prints classification statistics and a text-based confusion matrix.
    """
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_path = os.path.join(base_dir, "models", "difficulty_classifier.joblib")
    
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at {model_path}. Please run train_difficulty_classifier.py first.")
        
    print(f"Loading trained classifier model from {model_path}...", flush=True)
    pipeline = joblib.load(model_path)
    
    print("Loading evaluation dataset...", flush=True)
    df = load_difficulty_dataset()
    X = df["question"] + " " + df["topic"]
    y = df["difficulty"]
    
    print("Running classification predictions...", flush=True)
    y_pred = pipeline.predict(X)
    
    accuracy = accuracy_score(y, y_pred)
    cm = confusion_matrix(y, y_pred, labels=["easy", "medium", "hard"])
    
    print("\n" + "="*50)
    print("STUDYMATE AI - MODEL EVALUATION METRICS")
    print("="*50)
    print(f"Total Evaluated Questions: {len(df)}")
    print(f"Overall Model Accuracy: {accuracy:.4f}")
    print("\nDetailed Performance Report:")
    print(classification_report(y, y_pred, target_names=["easy", "medium", "hard"]))
    
    print("Confusion Matrix:")
    print("             Pred Easy | Pred Medium | Pred Hard")
    print(f"Actual Easy     {cm[0][0]:<5}   |   {cm[0][1]:<7}   |   {cm[0][2]:<5}")
    print(f"Actual Medium   {cm[1][0]:<5}   |   {cm[1][1]:<7}   |   {cm[1][2]:<5}")
    print(f"Actual Hard     {cm[2][0]:<5}   |   {cm[2][1]:<7}   |   {cm[2][2]:<5}")
    print("="*50 + "\n")

if __name__ == "__main__":
    evaluate_model()
