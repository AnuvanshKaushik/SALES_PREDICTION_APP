import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import pickle

#LOAD DATASET
Data=pd.read_csv(r"C:\Users\kaush\Downloads\DATA SET\CRIME\data.csv",on_bad_lines='skip')
print(Data.head())
print(Data.describe())
print(Data.info())

#DATA PREPROCESSING
Data['units_sold']=Data['units_sold'].fillna(Data['units_sold'].mean())
Data['is_featured_sku']=Data['is_featured_sku'].fillna(0)
Data['is_display_sku']=Data['is_display_sku'].fillna(0)

# Check for duplicate data
duplicates = Data.duplicated()
print(duplicates)

# Handle duplicates (decide if to remove or keep based on analysis)
if duplicates.sum() > 0:
  print(f"Found {duplicates.sum()} duplicate rows.")
  test = Data.drop_duplicates()  # Remove duplicates

print(Data.isnull().sum())    #Check data is null or not

#Splitting of Data
X = Data.drop('units_sold', axis=1)  # Drop the target variable column from features
y = Data['units_sold'].reset_index()

from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)

print(X_train.head())
print(y_train.head())

print(X_train.shape)
print(X_test.shape)
print(y_train.shape)
print(y_test.shape)

#Random Forest Regression
from sklearn.ensemble import RandomForestRegressor
RFG=RandomForestRegressor(n_estimators=100, random_state=42)
RFG.fit(X_train[["store_id","sku_id","total_price","base_price","is_featured_sku","is_display_sku"]],y_train['units_sold'])

print('TRAIN Accuracy',RFG.score(X_train[["store_id","sku_id","total_price","base_price","is_featured_sku","is_display_sku"]],y_train['units_sold']))
print('TRUE VAL',y_test['units_sold'].values)
print('PREDICTED VAL',RFG.predict(X_test[["store_id","sku_id","total_price","base_price","is_featured_sku","is_display_sku"]]))
print('Test Accuracy',RFG.score(X_test[["store_id","sku_id","total_price","base_price","is_featured_sku","is_display_sku"]],y_test['units_sold']))

# Save the trained model to a file
with open('model.pkl', 'wb') as file:
    pickle.dump(RFG, file)

print("Model saved as 'model.pkl'")

