# Converts the datatset into csv file  - i.e the donations table is being converted into .csv file

import pandas as pd
from your_flask_app import app, db  # Import your Flask app and SQLAlchemy objects
from models import Donation  # Import the Donation model

def export_to_csv():
    with app.app_context():
        donations = Donation.query.all()
        data = [{
            'food_type': donation.food_type,
            'quantity': donation.quantity,
            'location': donation.location,
            'timestamp': donation.timestamp
        } for donation in donations]

        df = pd.DataFrame(data)
        df.to_csv('donations_requests.csv', index=False)

# Call this function periodically, e.g., using a cron job or a scheduled task
export_to_csv()

