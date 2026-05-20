import os
import sys

# Append the project root to sys.path
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if project_root not in sys.path:
    sys.path.append(project_root)

from ml.src.inference_difficulty import predict_difficulty

if __name__ == "__main__":
    print("Executing Quiz Difficulty Classifier Inference Testing...")
    
    questions = [
        ("What is Newton's second law?", "Physics"),
        ("Compare the metabolic pathway of aerobic respiration vs anaerobic respiration.", "Biology"),
        ("Optimize a search algorithm for a massive unstructured distributed file network.", "Computer Science"),
        ("Siapakah presiden pertama Republik Indonesia?", "Sejarah"),
        ("Jelaskan perbedaan antara pembelahan sel mitosis dan meiosis", "Biologi"),
        ("Rancang strategi pengindeksan database pada tabel dengan aktivitas tulis yang sangat tinggi dan pencarian multi-kolom yang kompleks", "Basis Data")
    ]
    
    for q, topic in questions:
        result = predict_difficulty(q, topic)
        print(f"\nQuestion: {q}")
        print(f"Topic: {topic}")
        print(f"Predicted Difficulty: {result['predicted_difficulty']} (Confidence: {result['confidence']:.2f}) [Method: {result['method']}]")
