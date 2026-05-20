import os
import sys

# Append the project root to sys.path
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if project_root not in sys.path:
    sys.path.append(project_root)

from ml.src.evaluate_difficulty_classifier import evaluate_model

if __name__ == "__main__":
    print("Executing Quiz Difficulty Classifier Model Evaluation...")
    evaluate_model()
