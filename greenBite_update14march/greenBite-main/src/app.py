import cv2
import pytesseract
import re
import numpy as np
import io
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Set the path to Tesseract-OCR executable
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def preprocess_image(image):
    """Enhance image for better OCR accuracy."""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)  # Convert to grayscale
    contrast = cv2.convertScaleAbs(gray, alpha=2, beta=0)  # Increase contrast
    binary = cv2.adaptiveThreshold(contrast, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                   cv2.THRESH_BINARY, 11, 2)  # Adaptive thresholding
    blurred = cv2.GaussianBlur(binary, (3, 3), 0)  # Reduce noise
    return blurred

def clean_text(text):
    """Fix common OCR misinterpretations."""
    text = text.replace('*P', 'EXP').replace('E:', 'EXP').replace('ExP', 'EXP')
    text = re.sub(r'[^a-zA-Z0-9/:\-.\s]', '', text)  # Remove unwanted symbols
    return text

def extract_expiry_date(image):
    """Extract expiry date from processed image."""
    processed_image = preprocess_image(image)

    # Save processed image for debugging
    cv2.imwrite("processed.jpg", processed_image)  

    # Run OCR with optimized settings
    custom_config = r'--oem 3 --psm 6'  # Assume a block of text
    raw_text = pytesseract.image_to_string(processed_image, config=custom_config)

    # Debugging: Print extracted text
    print(f"🔍 Raw Extracted Text from OCR:\n{raw_text}")

    # Clean text to fix OCR misinterpretations
    text = clean_text(raw_text)
    print(f"🔍 Cleaned Text:\n{text}")

    # Regex to specifically capture dates **after** "EXP" or "Expiry"
    match = re.search(r'(?:EXP|Expiry)[\s:.]*([\d]{1,2}[/-][\d]{1,2}[/-][\d]{2,4})', text, re.IGNORECASE)

    if match:
        return match.group(1)  # Return extracted date

    return None  # No expiry date found


@app.route('/upload', methods=['OPTIONS'])
def options():
    return jsonify({"message": "CORS preflight successful"}), 200

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        print("❌ No file found in request")
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    if file.filename == '':
        print("❌ No selected file")
        return jsonify({"error": "No selected file"}), 400

    try:
        # Read the file
        file_bytes = np.frombuffer(file.read(), np.uint8)
        print(f"✅ Received file: {file.filename}, Size: {len(file_bytes)} bytes")

        # Convert to OpenCV image
        image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        
        if image is None:
            print("❌ Failed to decode image")
            return jsonify({"error": "Failed to process image"}), 400

        # Extract expiry date
        expiry_date = extract_expiry_date(image)
        print(f"✅ Extracted expiry date: {expiry_date}")

        if expiry_date:
            return jsonify({"expiry_date": expiry_date})

        print("❌ No expiry date found")
        return jsonify({"error": "No expiry date found"}), 400
    except Exception as e:
        print(f"❌ Error processing image: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
