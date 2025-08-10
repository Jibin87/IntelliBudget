from pgmpy.models import BayesianNetwork
from pgmpy.factors.discrete import TabularCPD
from pgmpy.inference import VariableElimination
import pandas as pd

def create_anomaly_model(user_transactions_df):
    """
    Creates and trains a Bayesian Network based on a user's transaction history.
    """
    model = BayesianNetwork([
        ('Category', 'IsAnomaly'),
        ('AmountLevel', 'IsAnomaly')
    ])
    
    if user_transactions_df.empty:
        # Return a default, untrained model if no history
        return model

    # --- Learn Probabilities from User Data ---
    
    # Discretize amount into levels (Low, Medium, High) based on this user's history
    user_transactions_df['AmountLevel'] = pd.qcut(user_transactions_df['amount'], 3, labels=[0, 1, 2], duplicates='drop')
    
    # Calculate probabilities from the data
    category_prob = user_transactions_df['Category'].value_counts(normalize=True)
    amount_level_prob = user_transactions_df['AmountLevel'].value_counts(normalize=True)
    
    # Fit the model (learn the CPT for IsAnomaly)
    # This is a simplified learning process for the mini-project
    model.fit(user_transactions_df[['Category', 'AmountLevel', 'IsAnomaly']])
    
    return model

def predict_anomaly(model, transaction, user_transactions_df):
    """
    Predicts if a new transaction is an anomaly.
    """
    if model.nodes and 'Category' in model.nodes:
        inference = VariableElimination(model)
        
        # Discretize the new transaction's amount based on historical context
        amount_qcut = pd.qcut(user_transactions_df['amount'].append(pd.Series([transaction['amount']])), 3, labels=[0, 1, 2], duplicates='drop')
        transaction_amount_level = amount_qcut.iloc[-1]
        
        # Predict the probability of this being an anomaly
        prediction = inference.query(
            variables=['IsAnomaly'],
            evidence={
                'Category': transaction['category'],
                'AmountLevel': transaction_amount_level
            }
        )
        
        # Return True if the probability of 'Yes' (1) is higher
        return prediction.values[1] > 0.5 
    return False