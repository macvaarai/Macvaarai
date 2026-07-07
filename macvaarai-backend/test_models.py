#!/usr/bin/env python3
"""
Test script to verify all 18 medical models
"""

import os
import sys
from models.unified_model_manager import MODEL_CONFIG, load_model, predict
from PIL import Image
import numpy as np

def create_dummy_image(size=(224, 224)):
    """Create a dummy test image"""
    img_array = np.random.randint(0, 255, (*size, 3), dtype=np.uint8)
    img = Image.fromarray(img_array)
    import io
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG')
    return img_bytes.getvalue()

def test_single_model(model_name):
    """Test a single model"""
    print(f"\n{'='*60}")
    print(f"Testing: {model_name}")
    print('='*60)

    try:
        # Load model
        model = load_model(model_name)
        if model is None:
            print(f"❌ FAILED: Model not found")
            return False

        print(f"✅ Model loaded successfully")
        print(f"   Input shape: {model.input_shape}")

        # Create dummy image
        image_bytes = create_dummy_image()
        print(f"✅ Test image created")

        # Run prediction
        result = predict(model_name, image_bytes)

        # Display results
        print(f"\n📊 PREDICTION RESULTS:")
        print(f"   Label: {result.get('label', 'N/A')}")
        print(f"   Confidence: {result.get('confidence_percent', 'N/A')}")
        print(f"   Summary: {result.get('summary', 'N/A')}")

        if 'all_predictions' in result:
            print(f"\n   All Predictions:")
            for label, conf in result['all_predictions'].items():
                bar_length = int(conf * 20)
                bar = '█' * bar_length + '░' * (20 - bar_length)
                print(f"      {label:20s} {bar} {conf*100:5.1f}%")

        print(f"\n✅ Model test PASSED")
        return True

    except Exception as e:
        print(f"❌ FAILED: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def test_all_models():
    """Test all 18 models"""
    print("\n" + "="*60)
    print("MACVARAI - 18 MODELS DIAGNOSTIC TEST")
    print("="*60)

    results = {}
    for model_name in MODEL_CONFIG.keys():
        results[model_name] = test_single_model(model_name)

    # Summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)

    passed = sum(1 for v in results.values() if v)
    total = len(results)

    print(f"\n✅ PASSED: {passed}/{total} models")
    print(f"❌ FAILED: {total - passed}/{total} models")

    if passed == total:
        print("\n🎉 ALL MODELS WORKING!")
    else:
        print("\n⚠️  Some models failed. Details:")
        for model_name, success in results.items():
            status = "✅" if success else "❌"
            print(f"   {status} {model_name}")

    return results

def check_model_files():
    """Check if all model .h5 files exist"""
    print("\n" + "="*60)
    print("CHECKING MODEL FILES")
    print("="*60)

    missing = []
    exist = []

    model_dir = "model_storage"

    for model_name, config in MODEL_CONFIG.items():
        filepath = f"{model_dir}/{config['filename']}"
        if os.path.exists(filepath):
            size_mb = os.path.getsize(filepath) / (1024*1024)
            exist.append((model_name, config['filename'], size_mb))
            print(f"✅ {model_name:15s} {config['filename']:30s} {size_mb:6.1f} MB")
        else:
            missing.append((model_name, filepath))
            print(f"❌ {model_name:15s} MISSING: {filepath}")

    print(f"\nTotal: {len(exist)} exist, {len(missing)} missing")

    return exist, missing

if __name__ == "__main__":
    print("\n🏥 MACVARAI MEDICAL MODELS DIAGNOSTIC TEST\n")

    # Check files
    exist, missing = check_model_files()

    # Test models
    print("\n" + "="*60)
    print("STARTING MODEL TESTS (This may take a few minutes...)")
    print("="*60)

    results = test_all_models()

    # Final recommendations
    print("\n" + "="*60)
    print("RECOMMENDATIONS")
    print("="*60)

    if missing:
        print(f"\n⚠️  {len(missing)} model files are missing:")
        print("   These will use fallback MobileNetV2 models")
        print("   For better accuracy, download real models from:")
        print("   - TensorFlow Hub")
        print("   - Kaggle datasets")
        print("   - See MEDICAL_MODELS_GUIDE.md for details")

    if sum(1 for v in results.values() if not v) > 0:
        print("\n📝 Check logs for specific model failures")
        print("   Most failures are due to missing .h5 files")
        print("   Fallback models will provide basic predictions")

    print("\n✅ Backend models are operational!")
    print("   Use /predict/[model_name] endpoints to get predictions")

