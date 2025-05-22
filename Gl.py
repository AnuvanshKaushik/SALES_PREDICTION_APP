from flask import Flask, request, render_template, jsonify
import numpy as np
import pickle
import os

app = Flask(__name__)

# Load the pre-trained model
model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
try:
    with open(model_path, 'rb') as file:
        model = pickle.load(file)
except FileNotFoundError:
    # For demonstration purposes, we'll create a dummy model
    # In production, ensure your model file exists
    import joblib
    from sklearn.ensemble import RandomForestRegressor
    model = RandomForestRegressor()
    model.fit(np.array([[1, 1, 10.0, 8.0, 1, 0]]), np.array([5]))
    joblib.dump(model, model_path)

@app.route('/')
def home():
    return render_template('BL.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if request.is_json:
            data = request.get_json()
            store_id = int(data['store_id'])
            sku_id = int(data['sku_id'])
            total_price = float(data['total_price'])
            base_price = float(data['base_price'])
            is_featured_sku = int(data['is_featured_sku'])
            is_display_sku = int(data['is_display_sku'])
        else:
            store_id = int(request.form['store_id'])
            sku_id = int(request.form['sku_id'])
            total_price = float(request.form['total_price'])
            base_price = float(request.form['base_price'])
            is_featured_sku = int(request.form['is_featured_sku'])
            is_display_sku = int(request.form['is_display_sku'])

        # Create the feature array for prediction
        features = np.array([[store_id, sku_id, total_price, base_price, is_featured_sku, is_display_sku]])
        prediction = model.predict(features)
        
        if request.is_json:
            return jsonify({
                'success': True,
                'prediction': round(float(prediction[0]), 2)
            })
        else:
            return render_template('BL.html', 
                                  prediction=round(float(prediction[0]), 2),
                                  inputs={
                                      'store_id': store_id,
                                      'sku_id': sku_id,
                                      'total_price': total_price,
                                      'base_price': base_price,
                                      'is_featured_sku': is_featured_sku,
                                      'is_display_sku': is_display_sku
                                  })
    except Exception as e:
        if request.is_json:
            return jsonify({'success': False, 'error': str(e)})
        else:
            return render_template('.html', error=str(e))

if __name__ == '__main__':
    app.run(debug=True)
