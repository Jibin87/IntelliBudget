from pgmpy.models import DiscreteBayesianNetwork
from pgmpy.factors.discrete import TabularCPD
from pgmpy.inference import VariableElimination

def create_risk_model():
    # Model: RiskScoreCategory -> RiskLevel
    model = DiscreteBayesianNetwork([('RiskScoreCategory', 'RiskLevel')])

    # Probabilities for the score category itself
    # 0=Low, 1=Medium, 2=High, 3=Extreme
    cpd_score = TabularCPD(variable='RiskScoreCategory', variable_card=4, values=[[0.4], [0.3], [0.2], [0.1]])

    # --- THIS IS THE FIX ---
    # A new 4x4 CPT to handle the "Extreme" category
    cpd_risk = TabularCPD(
        variable='RiskLevel', variable_card=4, # 0=Low, 1=Medium, 2=High, 3=Extreme
        values=[
            # P(RiskLevel | RiskScoreCategory)
            # Columns: Score=L, Score=M, Score=H, Score=E
            [0.97, 0.10, 0.01, 0.01], # P(RiskLevel=Low)
            [0.02, 0.80, 0.20, 0.01], # P(RiskLevel=Medium)
            [0.01, 0.10, 0.70, 0.18], # P(RiskLevel=High)
            [0.00, 0.00, 0.09, 0.80]  # P(RiskLevel=Extreme)
        ],
        evidence=['RiskScoreCategory'],
        evidence_card=[4]
    )

    model.add_cpds(cpd_score, cpd_risk)
    model.check_model()
    return model

def predict_risk(model, score_category):
    inference = VariableElimination(model)
    result = inference.query(
        variables=['RiskLevel'],
        evidence={'RiskScoreCategory': score_category}
    )
    
    prediction_index = result.values.argmax()
    # Add "Extreme" to the levels
    levels = ['Low', 'Medium', 'High', 'Extreme']
    return levels[prediction_index]