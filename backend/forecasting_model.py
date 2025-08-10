from pgmpy.models import DiscreteBayesianNetwork
from pgmpy.factors.discrete import TabularCPD
from pgmpy.inference import VariableElimination

def create_forecasting_model():
    # A smarter model: SavingsSurplus and SpendingVolatility -> LikelihoodOfSuccess
    model = DiscreteBayesianNetwork([
        ('SavingsSurplus', 'LikelihoodOfSuccess'),
        ('SpendingVolatility', 'LikelihoodOfSuccess')
    ])

    # Probabilities for parent nodes
    # 0=Negative, 1=Sufficient, 2=High
    cpd_surplus = TabularCPD(variable='SavingsSurplus', variable_card=3, values=[[0.3], [0.5], [0.2]]) 
    # 0=Low, 1=High
    cpd_volatility = TabularCPD(variable='SpendingVolatility', variable_card=2, values=[[0.7], [0.3]])

    # Conditional Probability for LikelihoodOfSuccess
    # This CPT is now based on whether you have a surplus or deficit
    cpd_success = TabularCPD(
        variable='LikelihoodOfSuccess', variable_card=3, # 0=Low, 1=Medium, 2=High
        values=[
            # P(Success=Low | Surplus, Volatility)
            # Columns: (S=-,V=L), (S=OK,V=L), (S=+,V=L), (S=-,V=H), (S=OK,V=H), (S=+,V=H)
            [0.90, 0.15, 0.01, 0.99, 0.40, 0.10],
            # P(Success=Medium | Surplus, Volatility)
            [0.09, 0.70, 0.19, 0.01, 0.50, 0.30],
            # P(Success=High | Surplus, Volatility)
            [0.01, 0.15, 0.80, 0.00, 0.10, 0.60]
        ],
        evidence=['SavingsSurplus', 'SpendingVolatility'],
        evidence_card=[3, 2]
    )
    
    model.add_cpds(cpd_surplus, cpd_volatility, cpd_success)
    model.check_model()
    return model

def predict_success_likelihood(model, surplus_level, volatility_level):
    inference = VariableElimination(model)
    result = inference.query(
        variables=['LikelihoodOfSuccess'],
        evidence={'SavingsSurplus': surplus_level, 'SpendingVolatility': volatility_level}
    )
    
    probabilities = result.values
    prediction_index = probabilities.argmax()
    levels = ['Low', 'Medium', 'High']
    
    return {'level': levels[prediction_index], 'percentage': probabilities[prediction_index]}