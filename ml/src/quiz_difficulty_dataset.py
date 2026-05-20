import os
import pandas as pd

def get_dataset_path() -> str:
    """
    Returns the absolute path to the sample_quiz_difficulty_dataset.csv file.
    """
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(base_dir, "data", "sample_quiz_difficulty_dataset.csv")

def load_difficulty_dataset() -> pd.DataFrame:
    """
    Loads the CSV difficulty dataset. If the dataset CSV is missing, raises an error.
    """
    path = get_dataset_path()
    if not os.path.exists(path):
        raise FileNotFoundError(f"Quiz difficulty dataset not found at {path}. Make sure to generate it first.")
    
    df = pd.read_csv(path)
    return df
