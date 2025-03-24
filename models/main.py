# main.py
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, but you can restrict it to specific domains.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your ML model
model = joblib.load("./svd_model.pkl")

# Load data for restaurants (optional: this could be fetched from a database)
restaurant_df = pd.read_csv("/path/to/your/restaurants_sample.csv")

# Define a request body structure using Pydantic
class PredictionRequest(BaseModel):
    user_id: str

# Create a recommendation endpoint
@app.post("/recommendations")
def get_recommendations(request: PredictionRequest):
    user_id = request.user_id
    
    # List of all business IDs (restaurants) the user hasn't visited yet
    all_business_ids = restaurant_df['business_id'].tolist()

    # Fetch user's visited restaurants from the dataset
    visited_restaurants = []  # Should come from a user's previous activity, for example, a database
    unvisited_restaurants = [bid for bid in all_business_ids if bid not in visited_restaurants]
    
    # Predict ratings for unvisited restaurants
    predictions = []
    for business_id in unvisited_restaurants:
        try:
            pred = model.predict(user_id, business_id)
            predictions.append({
                'business_id': business_id,
                'predicted_rating': pred.est
            })
        except Exception as e:
            continue
    
    # Sort predictions by predicted rating (descending)
    predictions = sorted(predictions, key=lambda x: x['predicted_rating'], reverse=True)
    
    # Get top 5 recommendations
    top_recommendations = predictions[:5]

    # Return the recommendations along with restaurant names
    recommended_restaurants = []
    for recommendation in top_recommendations:
        business_id = recommendation['business_id']
        restaurant = restaurant_df[restaurant_df['business_id'] == business_id].iloc[0]
        recommended_restaurants.append({
            'business_id': business_id,
            'name': restaurant['name'],
            'address': restaurant['address'],
            'city': restaurant['city'],
            'predicted_rating': recommendation['predicted_rating']
        })
    
    return {"recommendations": recommended_restaurants}
