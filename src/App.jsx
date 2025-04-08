import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [canSave, setCanSave] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(''); // success | error | info

  const handleFileChange = async (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setMessage(`File "${selected.name}" selected.`);
      setStatus('info');

      // Skapa en klon av filen för att undvika ERR_UPLOAD_FILE_CHANGED
      const cloned = new File([selected], selected.name, { type: selected.type });
      setFile(cloned);
      setCanSave(false);

      // Vänta kort tid innan man kan trycka på save
      setTimeout(() => {
        setCanSave(true);
        setMessage(`Ready to save "${selected.name}"`);
        setStatus('success');
      }, 300);
    }
  };

  const handleUploadClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleSave = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setCanSave(false);
    setMessage('Uploading...');
    setStatus('info');

    try {
      const res = await fetch('http://192.168.1.32:3001/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setMessage(`File "${file.name}" saved to Computer!`);
        setStatus('success');
        setFile(null);
      } else {
        setMessage('Upload failed.');
        setStatus('error');
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
      setStatus('error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-4 px-4">
      <input
        type="file"
        id="fileInput"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        onClick={handleUploadClick}
        className="text-xl px-6 py-4 rounded-2xl shadow-md bg-blue-500 text-white hover:bg-blue-600 transition"
      >
        Upload File
      </button>

      <button
        onClick={handleSave}
        disabled={!canSave}
        className={`text-xl px-6 py-4 rounded-2xl shadow-md text-white transition ${
          canSave ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        Save
      </button>

      {message && (
        <div className={`mt-4 text-center text-lg font-medium ${
          status === 'success' ? 'text-green-600' :
          status === 'error' ? 'text-red-600' :
          'text-gray-700'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default App;
