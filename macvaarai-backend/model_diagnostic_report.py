"""
Complete Diagnostic Report System with Doctor Consultation
"""

from datetime import datetime
from typing import Dict, List
import json
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak, Image
from reportlab.lib import colors
from io import BytesIO
import base64

class DiagnosticReportGenerator:
    """Generate professional PDF reports for diagnoses"""

    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.custom_styles = self._create_custom_styles()

    def _create_custom_styles(self):
        """Create custom styles for reports"""
        styles = {}

        styles['title'] = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1E40AF'),
            spaceAfter=30,
            alignment=1  # Center
        )

        styles['heading'] = ParagraphStyle(
            'CustomHeading',
            parent=self.styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#1E40AF'),
            spaceAfter=12,
            spaceBefore=12
        )

        styles['normal'] = ParagraphStyle(
            'CustomNormal',
            parent=self.styles['Normal'],
            fontSize=11,
            leading=14
        )

        return styles

    def generate_report(self, diagnosis_data: Dict, patient_info: Dict, image_base64: str = None):
        """Generate comprehensive diagnostic report"""

        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=0.5*inch, bottomMargin=0.5*inch)
        elements = []

        # Title
        elements.append(Paragraph("AI DIAGNOSTIC REPORT", self.custom_styles['title']))
        elements.append(Spacer(1, 0.2*inch))

        # Report Header
        header_data = [
            ["Report ID:", f"RPT-{datetime.now().strftime('%Y%m%d%H%M%S')}"],
            ["Date:", datetime.now().strftime('%B %d, %Y at %H:%M')],
            ["Patient:", patient_info.get('name', 'Not provided')],
            ["Age:", f"{patient_info.get('age', 'N/A')} years"]
        ]

        header_table = Table(header_data, colWidths=[1.5*inch, 3*inch])
        header_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#E0E7FF')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey)
        ]))

        elements.append(header_table)
        elements.append(Spacer(1, 0.3*inch))

        # Diagnosis Section
        elements.append(Paragraph("DIAGNOSTIC FINDINGS", self.custom_styles['heading']))

        diagnosis_info = [
            ["Condition Detected:", diagnosis_data.get('label', 'Unable to determine')],
            ["Confidence Level:", f"{diagnosis_data.get('confidence_percent', '0%')}"],
            ["Analysis Method:", diagnosis_data.get('api_used', 'AI Vision Analysis')],
            ["Status:", "Preliminary AI Analysis - Professional Review Recommended"]
        ]

        diagnosis_table = Table(diagnosis_info, colWidths=[2*inch, 3.5*inch])
        diagnosis_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#FEE2E2')),
            ('BACKGROUND', (1, 0), (1, -1), colors.HexColor('#FEF2F2')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, 0), 'LEFT'),
            ('ALIGN', (1, 0), (1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey)
        ]))

        elements.append(diagnosis_table)
        elements.append(Spacer(1, 0.2*inch))

        # All Predictions
        if diagnosis_data.get('all_predictions'):
            elements.append(Paragraph("PREDICTION BREAKDOWN", self.custom_styles['heading']))

            predictions_data = [["Condition", "Confidence"]]
            for condition, confidence in sorted(
                diagnosis_data['all_predictions'].items(),
                key=lambda x: x[1],
                reverse=True
            ):
                predictions_data.append([
                    condition,
                    f"{confidence*100:.1f}%"
                ])

            pred_table = Table(predictions_data, colWidths=[3*inch, 2.5*inch])
            pred_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1E40AF')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ('GRID', (0, 0), (-1, -1), 1, colors.grey),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F0F9FF')])
            ]))

            elements.append(pred_table)
            elements.append(Spacer(1, 0.2*inch))

        # Important Notice
        elements.append(Paragraph("⚠️ IMPORTANT NOTICE", self.custom_styles['heading']))
        notice_text = """
        <b>This is an AI-generated preliminary analysis only.</b> This report should NOT be used
        as a substitute for professional medical diagnosis. Please consult with a qualified healthcare
        professional for accurate diagnosis and treatment recommendations. The accuracy of AI analysis
        depends on image quality, angle, and other factors.
        """
        elements.append(Paragraph(notice_text, self.custom_styles['normal']))
        elements.append(Spacer(1, 0.2*inch))

        # Recommendations
        elements.append(Paragraph("NEXT STEPS", self.custom_styles['heading']))
        recommendations = f"""
        <b>Recommended Actions:</b><br/>
        1. Schedule consultation with a qualified doctor<br/>
        2. Bring this report to your medical appointment<br/>
        3. Discuss findings with healthcare professional<br/>
        4. Do not delay professional medical evaluation<br/>
        5. Keep a copy for your medical records<br/>
        """
        elements.append(Paragraph(recommendations, self.custom_styles['normal']))
        elements.append(Spacer(1, 0.3*inch))

        # Footer
        footer_text = f"<i>Report generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} by MacvaarAI Diagnostic System</i>"
        elements.append(Paragraph(footer_text, self.custom_styles['normal']))

        # Build PDF
        doc.build(elements)
        buffer.seek(0)
        return buffer

# ============================================================
# DOCTOR MATCHING & CONSULTATION SYSTEM
# ============================================================

class DoctorConsultationMatcher:
    """Match patients with appropriate doctors based on diagnosis"""

    DIAGNOSIS_TO_SPECIALTY = {
        # Eye conditions
        'Diabetic Retinopathy': 'Ophthalmologist',
        'Glaucoma': 'Ophthalmologist',
        'Cataract': 'Ophthalmologist',
        'Retinal': 'Ophthalmologist',

        # Respiratory
        'COVID': 'Pulmonologist',
        'Pneumonia': 'Pulmonologist',
        'Tuberculosis': 'Pulmonologist',
        'Lung': 'Pulmonologist',
        'Chest': 'Pulmonologist',

        # Dermatology
        'Melanoma': 'Dermatologist',
        'Skin Cancer': 'Dermatologist',
        'Skin': 'Dermatologist',

        # Cardiology
        'ECG': 'Cardiologist',
        'Heart': 'Cardiologist',
        'Cardiac': 'Cardiologist',
        'Arrhythmia': 'Cardiologist',

        # Infectology
        'Malaria': 'Infectious Disease Specialist',
        'Dengue': 'Infectious Disease Specialist',

        # General
        'Diabetes': 'General Practitioner',
        'Normal': 'General Practitioner',
    }

    @staticmethod
    def get_specialty(diagnosis: str) -> str:
        """Get recommended specialty based on diagnosis"""
        for condition, specialty in DoctorConsultationMatcher.DIAGNOSIS_TO_SPECIALTY.items():
            if condition.lower() in diagnosis.lower():
                return specialty
        return 'General Practitioner'

    @staticmethod
    def get_urgency_level(confidence: float, diagnosis: str) -> str:
        """Determine urgency of consultation"""
        # Critical conditions
        critical_conditions = ['COVID', 'Pneumonia', 'Tuberculosis', 'Stroke', 'Heart Attack', 'Sepsis']

        if any(cond.lower() in diagnosis.lower() for cond in critical_conditions):
            if confidence > 0.7:
                return 'URGENT - Same Day'
            else:
                return 'HIGH - Within 24 hours'

        if confidence > 0.8:
            return 'MEDIUM - Within 3 days'
        else:
            return 'LOW - Within a week'

    @staticmethod
    def generate_consultation_options(diagnosis_data: Dict, patient_location: str = None) -> Dict:
        """Generate doctor consultation options"""

        specialty = DoctorConsultationMatcher.get_specialty(diagnosis_data.get('label', ''))
        urgency = DoctorConsultationMatcher.get_urgency_level(
            diagnosis_data.get('confidence', 0),
            diagnosis_data.get('label', '')
        )

        return {
            'recommended_specialty': specialty,
            'urgency_level': urgency,
            'consultation_fee': {
                'General Practitioner': 500,
                'Dermatologist': 750,
                'Cardiologist': 1000,
                'Pulmonologist': 900,
                'Ophthalmologist': 850,
                'Infectious Disease Specialist': 800
            }.get(specialty, 600),
            'estimated_wait_time': {
                'URGENT - Same Day': '30 minutes',
                'HIGH - Within 24 hours': '2-4 hours',
                'MEDIUM - Within 3 days': '24-48 hours',
                'LOW - Within a week': '3-7 days'
            }.get(urgency, '1-2 days'),
            'available_consultation_modes': [
                {
                    'mode': 'Video Call',
                    'icon': '📹',
                    'duration': '15-30 minutes',
                    'cost': 'As per consultation fee'
                },
                {
                    'mode': 'Audio Call',
                    'icon': '☎️',
                    'duration': '10-20 minutes',
                    'cost': '80% of consultation fee'
                },
                {
                    'mode': 'In-Person',
                    'icon': '🏥',
                    'duration': '30-45 minutes',
                    'cost': '1.5x consultation fee'
                },
                {
                    'mode': 'Chat Consultation',
                    'icon': '💬',
                    'duration': 'Ongoing',
                    'cost': '60% of consultation fee'
                }
            ]
        }

# ============================================================
# COMPLETE DIAGNOSIS WITH DOCTOR OPTIONS ENDPOINT
# ============================================================

"""
Integration in main.py:

from model_diagnostic_report import DiagnosticReportGenerator, DoctorConsultationMatcher

report_generator = DiagnosticReportGenerator()
doctor_matcher = DoctorConsultationMatcher()

@app.post("/api/v1/diagnose/complete")
async def complete_diagnosis(
    file: UploadFile = File(...),
    patient_id: str = None,
    patient_name: str = "Patient",
    patient_age: int = 30,
    payload = Depends(verify_token)
):
    '''Complete diagnosis with report and doctor options'''

    image_bytes = await file.read()

    # Get AI diagnosis
    from free_api_integration import UnifiedFreeAPIGateway
    api_gateway = UnifiedFreeAPIGateway(preferred_api="google")
    diagnosis = api_gateway.predict(image_bytes)

    # Generate PDF report
    patient_info = {
        'name': patient_name,
        'age': patient_age,
        'id': patient_id or payload['user_id']
    }

    pdf_buffer = report_generator.generate_report(diagnosis, patient_info)
    pdf_base64 = base64.b64encode(pdf_buffer.read()).decode()

    # Get doctor consultation options
    consultation_options = doctor_matcher.generate_consultation_options(diagnosis)

    # Save to database
    diagnosis_record = {
        'patient_id': patient_id or payload['user_id'],
        'diagnosis': diagnosis,
        'report_pdf': pdf_base64,
        'consultation_options': consultation_options,
        'created_at': datetime.utcnow()
    }

    await db.diagnoses.insert_one(diagnosis_record)

    return {
        'success': True,
        'diagnosis': diagnosis,
        'report_download_url': f'/api/v1/diagnose/{diagnosis_record["_id"]}/report',
        'consultation_options': consultation_options,
        'next_action': 'Select a doctor and consultation mode to proceed'
    }

@app.get("/api/v1/diagnose/{diagnosis_id}/report")
async def download_report(diagnosis_id: str, payload = Depends(verify_token)):
    '''Download diagnosis report as PDF'''

    from bson import ObjectId

    diagnosis = await db.diagnoses.find_one({'_id': ObjectId(diagnosis_id)})
    if not diagnosis:
        raise HTTPException(status_code=404, detail="Report not found")

    pdf_bytes = base64.b64decode(diagnosis['report_pdf'])

    return {
        'pdf': pdf_bytes,
        'filename': f"diagnosis_report_{diagnosis_id}.pdf"
    }
"""
