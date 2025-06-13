import React, { useState } from 'react';
import axios from 'axios';

const UploadPdfUI = () => {
    const [files, setFiles] = useState([]);
    const [message, setMessage] = useState('');
    const [question, setQuestion] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleQuestionChange = (e) => {
        setQuestion(e.target.value);
    };

    const handleUpload = async () => {
        setUploading(true);
        const formData = new FormData();
        files.forEach(file => {
            formData.append('file', file);
        });
        formData.append('user_id', '12345'); // Remplace par l'ID réel
        formData.append('question', question);

        try {
            const response = await axios.post('http://localhost:8000/upload_pdf/', formData);
            setMessage(response.data.message);
            setFiles([]);
            setQuestion('');
        } catch (error) {
            setMessage("Erreur d'envoi : " + error.response?.data?.error || error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Uploader un ou plusieurs fichiers PDF</h2>

            <input type="file" multiple onChange={handleFileChange} style={styles.inputFile} />

            <textarea
                placeholder="Écrivez ici votre question ou message..."
                value={question}
                onChange={handleQuestionChange}
                style={styles.textarea}
            ></textarea>

            <button onClick={handleUpload} style={styles.button} disabled={uploading}>
                {uploading ? 'Envoi en cours...' : 'Envoyer'}
            </button>

            {message && <p style={styles.message}>{message}</p>}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '500px',
        margin: 'auto',
        padding: '20px',
        backgroundColor: '#f4f4f4',
        borderRadius: '8px',
        boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
        fontFamily: 'Arial, sans-serif'
    },
    title: {
        textAlign: 'center',
        marginBottom: '20px'
    },
    inputFile: {
        marginBottom: '10px',
        width: '100%'
    },
    textarea: {
        width: '100%',
        height: '100px',
        marginBottom: '10px',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc'
    },
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#0066cc',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    message: {
        marginTop: '15px',
        color: 'green',
        textAlign: 'center'
    }
};

export default UploadPdfUI;
