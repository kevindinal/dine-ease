# main.py
from fastapi import FastAPI
from pydantic import BaseModel
import joblib

app = FastAPI()

# Load your ML model (update the path to your model file)
model = joblib.load("./svd_model.pkl")

# Define a request body structure using Pydantic
class PredictionRequest(BaseModel):
    features: list  # The input feature vector

# Create a prediction endpoint
@app.post("/predict")
def predict(request: PredictionRequest):
    input_data = [request.features]
    prediction = model.predict(input_data)
    return {"prediction": prediction.tolist()}
