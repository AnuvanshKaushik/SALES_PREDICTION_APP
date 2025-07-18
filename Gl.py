from flask import Flask, request, jsonify
import numpy as np
import pickle
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Keep track of the last prediction
last_prediction = None

# Load or create model
model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
try:
    with open(model_path, 'rb') as file:
        model = pickle.load(file)
except FileNotFoundError:
    from sklearn.ensemble import RandomForestRegressor
    model = RandomForestRegressor()
    model.fit(np.array([[1, 1, 10.0, 8.0, 1, 0]]), np.array([5]))
    with open(model_path, 'wb') as file:
        pickle.dump(model, file)

@app.route('/')
def index():
    return jsonify({"message": "Welcome! Use POST /predict to make predictions."})

@app.route('/predict', methods=['GET', 'POST'])
def predict():
    global last_prediction

    if request.method == 'POST':
        try:
            data = request.get_json()

            store_id = int(data['store_id'])
            sku_id = int(data['sku_id'])
            total_price = float(data['total_price'])
            base_price = float(data['base_price'])
            is_featured_sku = int(data['is_featured_sku'])
            is_display_sku = int(data['is_display_sku'])

            features = np.array([[store_id, sku_id, total_price, base_price, is_featured_sku, is_display_sku]])
            prediction = round(float(model.predict(features)[0]), 2)

            last_prediction = {
                'store_id': store_id,
                'sku_id': sku_id,
                'total_price': total_price,
                'base_price': base_price,
                'is_featured_sku': is_featured_sku,
                'is_display_sku': is_display_sku,
                'prediction': prediction
            }

            return jsonify({'success': True, 'prediction': last_prediction})

        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

    elif request.method == 'GET':
        if last_prediction:
            return jsonify({'last_prediction': last_prediction})
        else:
            return jsonify({'message': 'No prediction made yet. Send a POST request first.'})


if __name__ == '__main__':
    app.run(debug=True)
