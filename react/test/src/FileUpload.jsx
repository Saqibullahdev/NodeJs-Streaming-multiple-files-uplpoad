import React, { useState } from 'react';

const FileUpload = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);

    // Handle file selection and preview
    const handleFileChange = (e) => {
        const files = e.target.files;
        setSelectedFiles(files);

        // Preview images (for image files only)
        const filePreviews = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const previewUrl = URL.createObjectURL(file); // Create a temporary URL for the file
            filePreviews.push(previewUrl);
        }
        setFilePreviews(filePreviews);
    };

    // Handle form submission and send files to the server
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('images', selectedFiles[i]);
        }

        try {
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            if (response.ok) {
                alert('Files uploaded successfully!');
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error uploading files:', error);
            alert('Error uploading files.');
        }
    };

    return (
        <div>
            <h2>Upload Multiple Files</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    name="images"
                    multiple
                    onChange={handleFileChange}
                    accept="image/*" // Optional: restrict to image files only
                />
                <button type="submit">Upload</button>
            </form>

            {/* Display file previews */}
            <div className="file-previews">
                {filePreviews.length > 0 && (
                    <div>
                        <h3>File Previews:</h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {filePreviews.map((previewUrl, index) => (
                                <div key={index}>
                                    <img
                                        src={previewUrl}
                                        alt={`Preview ${index + 1}`}
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
