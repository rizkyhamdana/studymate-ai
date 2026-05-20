import os
import json
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline, FeatureUnion
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, accuracy_score
import joblib

from ml.src.quiz_difficulty_dataset import load_difficulty_dataset

class QuestionFeatureExtractor(BaseEstimator, TransformerMixin):
    """
    Custom scikit-learn transformer to extract structural and cognitive verb
    features from questions in both English and Indonesian.
    """
    def fit(self, X, y=None):
        return self
        
    def transform(self, X):
        features = []
        for text in X:
            text_lower = text.lower()
            words = text.split()
            word_count = len(words)
            char_count = len(text)
            
            # Average word length
            avg_word_length = char_count / word_count if word_count > 0 else 0
            
            # Easy keywords indicative of lower cognitive depth (Bloom's Taxonomy / simple questions)
            easy_keywords = [
                "what is", "define", "who was", "name the", "where is", "list the", "how many",
                "apa itu", "siapakah", "apakah fungsi", "dimanakah", "berapakah", "tuliskan", "apa nama",
                "sebutkan", "siapa penemu", "apa kepanjangan"
            ]
            easy_count = sum(1 for kw in easy_keywords if kw in text_lower)
            
            # Medium keywords (understanding, application, process mechanisms)
            medium_keywords = [
                "explain", "how does", "describe", "compare", "difference between", "impact of", "explain how",
                "jelaskan", "bagaimana", "mengapa", "sebutkan dan jelaskan", "tuliskan perbedaan", "perbedaan antara",
                "bagaimana cara kerja", "jelaskan konsep", "bagaimana pengaruh", "sistem kerja"
            ]
            medium_count = sum(1 for kw in medium_keywords if kw in text_lower)
            
            # Hard keywords (high-order synthesis, derivation, proofs, evaluation, structural design)
            hard_keywords = [
                "prove", "derive", "optimize", "design", "critically", "given a", "implement", "analyze", "consequences",
                "buktikan", "rancang", "implementasikan", "analisis", "evaluasi", "bagaimana mengatasi", "derifasikan",
                "selesaikan", "buktikan rumus", "derifasikan rumus", "selesaikan persamaan", "analisis dampak"
            ]
            hard_count = sum(1 for kw in hard_keywords if kw in text_lower)
            
            features.append([
                word_count,
                char_count,
                avg_word_length,
                easy_count,
                medium_count,
                hard_count
            ])
            
        return np.array(features)

def train_classifier():
    """
    Loads dataset, pre-processes, trains a hybrid TF-IDF + Structural cognitive features
    pipeline, evaluates metrics, and dumps the model to disk.
    """
    print("Loading training data...", flush=True)
    df = load_difficulty_dataset()
    
    # Feature engineering: Combine question and topic
    # This teaches the model to look at both the topic context and sentence phrasing
    X = df["question"] + " " + df["topic"]
    y = df["difficulty"]
    
    print(f"Dataset loaded. Total rows: {len(df)}", flush=True)
    print("Class distributions:")
    print(y.value_counts())
    
    # Perform stratified split to maintain class ratios in train and test sets
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )
    
    # Define a highly robust hybrid features model
    pipeline = Pipeline([
        ('features', FeatureUnion([
            # Text TF-IDF Vectorizer
            ('tfidf', TfidfVectorizer(ngram_range=(1, 2), stop_words=None, sublinear_tf=True)),
            # Custom Structural & Cognitive Extractor scaled to standard distribution
            ('struct', Pipeline([
                ('extractor', QuestionFeatureExtractor()),
                ('scaler', StandardScaler())
            ]))
        ])),
        # Regularized Logistic Regression for multi-class classification
        ('clf', LogisticRegression(C=1.5, random_state=42, max_iter=1000))
    ])
    
    print("Training Hybrid Features (TF-IDF + Cognitive Structural Extractor) model...", flush=True)
    pipeline.fit(X_train, y_train)
    
    # Evaluate
    y_pred = pipeline.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    report_dict = classification_report(y_test, y_pred, output_dict=True)
    report_text = classification_report(y_test, y_pred)
    
    print("\nEvaluation Results on Test Set:")
    print(report_text)
    print(f"Accuracy: {accuracy:.4f}")
    
    # Establish directory paths
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    models_dir = os.path.join(base_dir, "models")
    reports_dir = os.path.join(base_dir, "reports")
    
    os.makedirs(models_dir, exist_ok=True)
    os.makedirs(reports_dir, exist_ok=True)
    
    # Save the model
    model_path = os.path.join(models_dir, "difficulty_classifier.joblib")
    joblib.dump(pipeline, model_path)
    print(f"Trained model saved to: {model_path}", flush=True)
    
    # Save metrics JSON
    metrics_path = os.path.join(reports_dir, "metrics.json")
    metrics = {
        "accuracy": accuracy,
        "macro_avg": report_dict["macro avg"],
        "weighted_avg": report_dict["weighted avg"]
    }
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)
    print(f"Metrics saved to: {metrics_path}", flush=True)
    
    # Save classification report TXT
    report_path = os.path.join(reports_dir, "classification_report.txt")
    with open(report_path, "w") as f:
        f.write("StudyMate AI - Quiz Difficulty Classifier Training Report\n")
        f.write("========================================================\n\n")
        f.write(f"Overall Accuracy: {accuracy:.4f}\n\n")
        f.write("Detailed Class Metrics:\n")
        f.write(report_text)
    print(f"Detailed classification report saved to: {report_path}", flush=True)
    
    print("Training pipeline completed successfully!", flush=True)

if __name__ == "__main__":
    train_classifier()
