import os
import sys

# Append the project root to sys.path so we can import from ml.src
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if project_root not in sys.path:
    sys.path.append(project_root)

from ml.src.train_difficulty_classifier import train_classifier

if __name__ == "__main__":
    print("Executing Quiz Difficulty Classifier Model Training...")
    train_classifier()
