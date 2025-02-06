import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './More.css';

const More = () => {
  const { serial } = useParams();
  const [kitData, setKitData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://avem-production.up.railway.app/kits/${serial}`)
      .then((response) => response.json())
      .then((data) => {
        setKitData(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [serial]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!kitData) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <div className="loading-text">Fetching Data From Server...</div>
      </div>
    );
  }

  return (
    <div className="kit-details">
      <h2>Kit Data for Serial Number: {kitData.serialNumber}</h2>
      <div className="table-container">
      <table className="kit-table">
        <thead>
          <tr>
            <th>Location</th>
            <th>Temperature</th>
            <th>Time</th>
            <th>Gas Leakage Status</th>
            <th>Crash Status</th>
            <th>Camera Footage</th>
          </tr>
        </thead>
        <tbody>
          {kitData.kitData.map((data, index) => (
            <tr key={index}>
              <td>{data.location}</td>
              <td>{data.temperature}</td>
              <td>{data.timestamp}</td>
              <td>{data.gasLeakageStatus}</td>
              <td>{data.crashStatus}</td>
              <td>
                <div className="camera-footage">
                  {Array.isArray(data.cameraFootage) && data.cameraFootage.length > 0 ? (
                    data.cameraFootage.map((footage, i) => (
                      <div key={i} className="video-container">
                        <button
                          className="play-btn"
                          onClick={() => window.open(footage, '_blank')}
                          disabled={!footage || footage.trim() === ""} 
                        >
                          Play
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No footage available</p>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default More;
