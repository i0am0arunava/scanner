import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import './App.css';

function App() {
  const [scannedData, setScannedData] = useState(null);
  const [isScannerActive, setIsScannerActive] = useState(true);
  const scannerRef = useRef(null);
  const API_BASE_URL = 'http://192.168.152.58:4000';

  const addData = async (data) => {
    const response = await axios.post(`${API_BASE_URL}/scanner`, {
      message: "hello",
    });
    console.log(response);
    console.log(data)
  }

const test =async()=>{
  const response = await axios.post(`${API_BASE_URL}/scanner`, {
    message: "hello",
  });
  console.log(response);
  console.log()

}


  useEffect(() => {
    if (!isScannerActive) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false
    );

    scanner.render(
      (decodedText) => {
        setScannedData(decodedText);
        addData(decodedText)
        setIsScannerActive(false);
        scanner.clear();
      },
      (error) => {
        console.warn(`QR Code no match: ${error}`);
      }
    );

    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner ", error);
        });
      }
    };
  }, [isScannerActive]);

  const handleScanAgain = () => {
    setScannedData(null);
    setIsScannerActive(true);
  };

  return (
    <>
      <div className="card">
      <button 
              onClick={test}
              style={{ marginTop: '10px' }}
            >
              Scan Again
            </button>
        <h1>QR Code Scanner</h1>
        <div id="qr-reader" style={{ width: "200px" }}></div>

        {scannedData && (
          <div style={{ marginTop: '20px' }}>
            <h2>Scanned Data:</h2>
            <p>{scannedData}</p>
            <button 
              onClick={handleScanAgain}
              style={{ marginTop: '10px' }}
            >
              Scan Again
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;