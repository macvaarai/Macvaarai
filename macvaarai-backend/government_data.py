"""
Government Hospital System - Data Models & Demo Data
"""

# Disease Surveillance Data
DISEASE_DATA = {
    "covid": {"name": "COVID-19", "cases": 45230, "recovered": 43100, "deaths": 280, "color": "red"},
    "dengue": {"name": "Dengue Fever", "cases": 32100, "recovered": 30200, "deaths": 180, "color": "orange"},
    "malaria": {"name": "Malaria", "cases": 12450, "recovered": 11800, "deaths": 120, "color": "yellow"},
    "tb": {"name": "Tuberculosis", "cases": 8930, "recovered": 8100, "deaths": 220, "color": "purple"},
    "typhoid": {"name": "Typhoid", "cases": 6540, "recovered": 6200, "deaths": 85, "color": "green"},
}

# Vaccination Data
VACCINATION_DATA = {
    "total_vaccinated": 42300000,
    "fully_vaccinated": 38900000,
    "population": 85000000,
    "camps_held": 12450,
    "programs": {
        "covid": {"coverage": 95.2, "vaccinated": 80890000},
        "polio": {"coverage": 98.1, "vaccinated": 83355000},
        "measles": {"coverage": 96.5, "vaccinated": 82025000},
        "dpt": {"coverage": 97.3, "vaccinated": 82705000},
    }
}

# Staff Data
STAFF_DATA = {
    "doctors": 8450,
    "nurses": 23120,
    "paramedics": 15680,
    "administrative": 6320,
    "specialties": {
        "general_medicine": 1230,
        "surgery": 890,
        "pediatrics": 560,
        "gynecology": 450,
        "cardiology": 380,
        "neurology": 320,
        "orthopedics": 410,
        "psychiatry": 280,
        "dermatology": 250,
        "oncology": 200,
    }
}

# Inventory Data
INVENTORY_DATA = {
    "total_medicines": 8450,
    "low_stock_items": 234,
    "expiring_soon": 56,
    "total_equipment": 12340,
    "top_medicines": {
        "paracetamol": 2300000,
        "antibiotics": 1800000,
        "insulin": 850000,
        "blood_pressure_meds": 720000,
        "antihistamines": 560000,
        "painkillers": 490000,
    }
}

# Finance Data
FINANCE_DATA = {
    "annual_budget": 450000000000,  # ₹4,500 Cr
    "utilized": 391500000000,  # ₹3,915 Cr (87%)
    "revenue_generated": 234000000000,  # ₹2,340 Cr
    "cost_per_patient": 3450,
    "budget_breakdown": {
        "staff_salaries": 189000000000,  # 42%
        "medicine_supplies": 94500000000,  # 21%
        "equipment_infrastructure": 81000000000,  # 18%
        "operations_utilities": 58500000000,  # 13%
        "training_development": 27000000000,  # 6%
    },
    "monthly_revenue": 195000000000,
}

# Quality Metrics
QUALITY_DATA = {
    "compliance_score": 94,
    "infection_rate": 0.8,
    "accredited_hospitals": 3240,
    "audit_findings": 23,
    "patient_satisfaction": 4.6,
    "mortality_rate": 1.2,
    "surgical_site_infections": 0.3,
    "nosocomial_infection_rate": 0.8,
    "readmission_rate": 2.1,
}

# Analytics Overview
ANALYTICS_DATA = {
    "population_served": 85000000,
    "healthcare_coverage": 92,
    "patient_recovery_rate": 94,
    "mortality_rate": 1.8,
    "total_hospitals": 3240,
    "total_beds": 500000,
    "total_doctors": 8450,
    "total_patients_annual": 10000000,
    "bed_occupancy": 78,
    "staff_efficiency": 85,
    "patient_satisfaction": 92,
    "budget_utilization": 87,
}

def get_disease_data():
    """Get disease surveillance data"""
    return DISEASE_DATA

def get_vaccination_data():
    """Get vaccination data"""
    return VACCINATION_DATA

def get_staff_data():
    """Get staff data"""
    return STAFF_DATA

def get_inventory_data():
    """Get inventory data"""
    return INVENTORY_DATA

def get_finance_data():
    """Get finance data"""
    return FINANCE_DATA

def get_quality_data():
    """Get quality metrics"""
    return QUALITY_DATA

def get_analytics_data():
    """Get analytics overview"""
    return ANALYTICS_DATA
