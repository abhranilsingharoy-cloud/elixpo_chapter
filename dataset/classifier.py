import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.pipeline import Pipeline
import joblib
import os

# Define file paths
DATA_FILEPATH = r'C:\Users\ELIXPO\Desktop\elixpo.ai\Dataset\combined.csv'
MODEL_FILEPATH = 'text_classifier_model.pkl'

def load_and_preprocess(filepath):
    """
    Loads the dataset from a CSV, preprocesses it, and returns features (X) and labels (y).
    """
    print(f"Loading and preprocessing data from {filepath}...")
    
    # Load data, handling potential errors
    df = pd.read_csv(filepath, on_bad_lines='skip', engine='python')
    
    # Step 2: Preprocess the data
    # Drop rows ONLY if the critical 'response' or 'label' columns are missing
    df = df.dropna(subset=['response', 'label'])
    
    # Ensure 'response' is string type before applying .str accessor
    df['response'] = df['response'].astype(str).str.lower()
    df = df.drop_duplicates()
    
    if df.empty:
        raise ValueError("No data left after preprocessing. Check your dataset.")
        
    print(f"Data loaded. Total samples: {len(df)}")
    print(f"Class distribution:\n{df['label'].value_counts(normalize=True)}")
    
    return df['response'], df['label']

def train_model(x_train, y_train):
    """
    Creates, trains, and tunes the classification model using GridSearchCV.
    Returns the best-performing estimator.
    """
    print("Setting up model pipeline and grid search...")
    
    # Step 4: Create a pipeline
    #
    # *** FIX ***
    # Removed `class_prior=[0.5, 0.5]` from MultinomialNB.
    # Hardcoding priors is generally bad practice.
    # The default `fit_prior=True` learns priors from the data, which is more robust.
    #
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(stop_words='english', max_features=5000)),
        ('clf', MultinomialNB(fit_prior=True))  # Use default or explicit fit_prior=True
    ])
    
    # Define parameters for hyperparameter tuning
    parameters = {
        'tfidf__ngram_range': [(1, 1), (1, 2)],  # Check unigrams and bigrams
        'clf__alpha': [0.01, 0.1, 0.5, 1.0]     # Smoothing parameter
    }
    
    # Step 5: Train the model with GridSearchCV
    # cv=5 is often a good default. 10 is also fine but slower.
    grid_search = GridSearchCV(pipeline, parameters, cv=5, n_jobs=-1, verbose=1)
    
    print("Starting model training...")
    grid_search.fit(x_train, y_train)
    print("Training complete.")
    
    print("Best parameters found:", grid_search.best_params_)
    
    # *** FIX ***
    # Return the *best estimator* itself, not the entire GridSearchCV object.
    # The best_estimator_ is the deployable model.
    return grid_search.best_estimator_

def evaluate_model(model, x_test, y_test):
    """
    Evaluates the trained model on the test set and prints metrics.
    """
    print("Evaluating model on test data...")
    # Step 6: Evaluate the model
    y_pred = model.predict(x_test)
    
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))
    print("Classification Report:\n", classification_report(y_test, y_pred))

def full_dataset_cross_validation(model, x, y):
    """
    Performs cross-validation on the *entire* dataset for a robust stability check.
    """
    print("Performing 10-fold cross-validation on the full dataset...")
    # Step 7: Cross-validation for stability
    cross_val_scores = cross_val_score(model, x, y, cv=10, n_jobs=-1)
    
    print("Cross-validation scores:", cross_val_scores)
    print(f"Mean cross-validation accuracy: {cross_val_scores.mean():.4f} (+/- {cross_val_scores.std() * 2:.4f})")

def save_model(model, filepath):
    """
    Saves the trained model to disk.
    """
    print(f"Saving model to {filepath}...")
    joblib.dump(model, filepath)
    print("Model saved.")

def load_model(filepath):
    """
    Loads a model from disk.
    """
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Model file not found at {filepath}")
        
    print(f"Loading model from {filepath}...")
    model = joblib.load(filepath)
    print("Model loaded.")
    return model

def classify_text(model, text):
    """
    Classifies a new piece of text using the loaded model.
    
    *** FIX ***
    This function now correctly takes the `model` as an argument
    instead of relying on a global variable.
    """
    text = text.lower()
    # The model's pipeline handles vectorization
    prediction = model.predict([text])
    return prediction[0]

def main():
    """
    Main function to run the full pipeline:
    Load -> Train -> Evaluate -> Save -> Load -> Predict
    """
    
    # Load and split data
    x, y = load_and_preprocess(DATA_FILEPATH)
    X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42, stratify=y)
    
    # Train the model
    best_model = train_model(X_train, y_train)
    
    # Evaluate the model
    evaluate_model(best_model, X_test, y_test)
    
    # Run cross-validation on the full dataset for a final check
    full_dataset_cross_validation(best_model, x, y)
    
    # Step 8: Save the trained model
    save_model(best_model, MODEL_FILEPATH)
    
    # Example of loading and using the model
    try:
        loaded_model = load_model(MODEL_FILEPATH)
        
        # Example usage
        input_text = "A Wonderful Bird in the sky with fiery wings"
        result = classify_text(loaded_model, input_text)
        print("="*30)
        print("Prediction Example:")
        print(f"Input text: '{input_text}'")
        print(f"The input text is classified as: {result}")
        print("="*30)
        
    except FileNotFoundError as e:
        print(e)

# This standard Python construct ensures that the `main()` function
# is called only when the script is executed directly.
if __name__ == "__main__":
    main()
