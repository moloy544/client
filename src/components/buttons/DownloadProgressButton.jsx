import { useState } from "react";

const formatSize = (bytes) => {
  const sizeInMB = bytes / (1024 * 1024);
  return sizeInMB >= 1024
    ? (sizeInMB / 1024).toFixed(2) + 'GB'
    : sizeInMB.toFixed(1) + 'MB';
};

const DownloadProgressButton = ({title, url, fileName}) => {
   const [progress, setProgress] = useState(null);
    const [downloading, setDownloading] = useState(false);
  
    const handleDownload = async () => {
      setDownloading(true);
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to download');
  
        const contentLength = +response.headers.get('Content-Length');
        const reader = response.body.getReader();
        let receivedLength = 0;
        const chunks = [];
  
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          receivedLength += value.length;
  
          const percent = ((receivedLength / contentLength) * 100).toFixed(1);
          setProgress(percent);
        }
  
        const blob = new Blob(chunks);
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(downloadUrl);
      } catch (err) {
        console.error('Download failed:', err);
        setProgress('Error');
      } finally {
        setDownloading(false);
      }
    };
  
    return (
      <button
        onClick={handleDownload}
        disabled={downloading && progress !== 'Error'}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          borderRadius: '8px',
          background: '#007bff',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          minWidth: '150px',
        }}
      >
        {progress === null
          ? title
          : progress === 'Error'
          ? 'Failed'
          : `${progress}%`}
      </button>
    );
}

export default DownloadProgressButton
