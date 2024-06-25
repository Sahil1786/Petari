import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics.pairwise import cosine_similarity

# Load the CSV file into a pandas DataFrame (assuming data is already loaded)
df = pd.read_csv('convertDStoCSV.csv')

# Preprocess the data (e.g., handle missing values, encode categorical variables)
# Assuming 'timestamp' is in string format, convert it to datetime if needed
df['timestamp'] = pd.to_datetime(df['timestamp'])

# Split the data into features (X) and target variable (y)
X = df[['food_type', 'location', 'quantity', 'timestamp']]  # Features: food_type, location, quantity, timestamp
y = df['food_preferences']  # Target variable: food_preferences

# Encode categorical variables (if needed)
X_encoded = pd.get_dummies(X, columns=['food_type', 'location'], drop_first=True)  # One-hot encoding for categorical variables

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X_encoded, y, test_size=0.2, random_state=42)

# Initialize the KNN classifier
knn = KNeighborsClassifier(n_neighbors=3)  # Adjust hyperparameters as needed

# Train the classifier
knn.fit(X_train, y_train)

# Calculate similarity between donors and recipients
def calculate_similarity(row):
    donor_food = row['food_type'].split(', ')
    recipient_food = row['food_preferences'].split(', ')
    vector_donor = [1 if food in donor_food else 0 for food in set(donor_food + recipient_food)]
    vector_recipient = [1 if food in recipient_food else 0 for food in set(donor_food + recipient_food)]
    similarity = cosine_similarity([vector_donor], [vector_recipient])[0][0]
    return similarity

# Calculate similarity scores for the test set
X_test_similarity = X_test.apply(calculate_similarity, axis=1)

# Set a similarity threshold to filter matches
threshold = 0.5
matched_indices = X_test_similarity[X_test_similarity >= threshold].index

# Get the matched donor-recipient pairs
matched_pairs = df.iloc[matched_indices]

# Output matched pairs along with their similarity scores
print("Matched Donor-Recipient Pairs:")
print(matched_pairs[['donor_id', 'recipient_id', 'location', 'quantity']])
