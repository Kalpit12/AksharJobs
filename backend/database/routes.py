from flask import Flask, request, jsonify
from database.db import get_db, get_mongo_client
from database.models import Resume
import logging
from services.store_data import store_resume_data
from services.extract_text import extract_text
import os
from flask_cors import CORS
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

client = get_mongo_client()
print("client: ", client)
db = get_db(client) if client else None
resumes_collection = db["resumes"] if db is not None else None
job_descriptions_collection = db["job_descriptions"] if db is not None else None

from services.parse_resume import parse_resume_with_gemini_free  
from werkzeug.utils import secure_filename

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'  
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER  
os.makedirs(UPLOAD_FOLDER, exist_ok=True) 

@app.route("/add_resume", methods=["POST"])
def add_resume():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        print(file)

        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        filename = secure_filename(file.filename)  
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        try:  
            resume_text = extract_text(filepath)  
            if isinstance(resume_text, dict) and 'resume_text' in resume_text: 
                resume_text = resume_text['resume_text']
            elif isinstance(resume_text, str): 
                return jsonify({'error': resume_text}), 400 
            else:
                return jsonify({'error': 'Could not extract text'}), 500

            extracted_data = parse_resume_with_gemini_free(resume_text)  
            if extracted_data:
                inserted_id = store_resume_data(extracted_data)
                print(inserted_id)  
                if inserted_id:
                    response= jsonify({"message": "Resume added successfully!", "id": str(inserted_id)})
                    app.logger.info(f"Resume added successfully: {inserted_id}")
                    response.headers.add("Access-Control-Allow-Origin", "*")  
                    response.status_code = 201
                    return response
                else:
                    response = jsonify({"message": "Failed to add resume"})
                    app.logger.error("Failed to add resume")
                    return response, 500
            else:
                            response = jsonify({"message": "Failed to parse resume with Gemini Free API"})
            app.logger.error("Failed to parse resume with Gemini Free API")
                return response, 500
        except Exception as e:  
            print(e)  

    except Exception as e:
        logging.error(f"Error in add_resume route: {e}")
        response = jsonify({"message": "An error occurred", "error": str(e)})
        return response, 500 


if __name__ == "__main__":
    app.run(debug=True)
