import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import './App.css';

function App() {
  const [scannedData, setScannedData] = useState(null);
  const [isScannerActive, setIsScannerActive] = useState(true);
  const scannerRef = useRef(null);
  const API_BASE_URL = 'https://uemev-backend.onrender.com';

   const addData = async (data) => {
    // Parse the data
    const parsedData = {};
  
    // Split by commas first
    const parts = data.split(',');
  
    parts.forEach(part => {
      const [key, value] = part.split(':').map(str => str.trim());
      parsedData[key] = value;
    });
  
    const { Name, "Event Id": EventId } = parsedData;
  
    console.log("Parsed Name:", Name);
    console.log("Parsed Event Id:", EventId);
  
    // Now send only Name and Event Id
    const response = await axios.post(`${API_BASE_URL}/scanner`, {
      name: Name,
      eventId: EventId,
    });
  
    console.log(response.data);
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
