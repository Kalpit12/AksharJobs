import { useState } from "react";
import axios from "axios";
import API_CONFIG from '../config/api.js';

const ResumeUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]); // Set the selected file
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(`${API_CONFIG.BASE_URL}/add_resume`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setMessage(response.data.message || "File uploaded successfully!");
        } catch (error) {
            console.error("Upload error:", error);
            setMessage("Upload failed. Please try again.");
        }
    };

    return (
        <div>
            <h2>Upload Resume</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            <p>{message}</p>
        </div>
    );
};

export default ResumeUpload;
