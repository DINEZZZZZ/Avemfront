import { useEffect, useState } from 'react';
import axios from 'axios';
import './BoxList.css';
import { useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';

const BoxList = () => {
  const [boxDetails, setBoxDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [activeCount, setActiveCount] = useState(0);
  const navigate = useNavigate();

  const defaultData = [
    { serialNumber: 'SN001', status: 'Active' },
    { serialNumber: 'SN002', status: 'Inactive' },
    { serialNumber: 'SN003', status: 'Active' },
  ];

  useEffect(() => {
    const fetchBoxDetails = async () => {
      try {
        const response = await axios.get('https://avemfinalbackend.onrender.com/kits/AO001K3JD');
        const data = response.data;

        // Your JSON has a single object, so wrap it in an array for consistent mapping
        if (data) {
          const fetched = [{
            serialNumber: data.serialNumber,
            status: data.status,
          }];
          setBoxDetails(fetched);
        } else {
          setBoxDetails(defaultData);
        }
      } catch (err) {
        setBoxDetails(defaultData);
        setError('Failed to load box details');
      }
      setLoading(false);
    };

    fetchBoxDetails();

    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const count = boxDetails.filter((box) => box.status.toLowerCase() === 'active').length;
    setActiveCount(count);
  }, [boxDetails]);

  const handleMoreClick = (serial) => {
    navigate(`/more/${serial}`);
  };

  return loading ? (
    <div className="loading-screen">
      <div className="spinner"></div>
      <div className="loading-text">Fetching Data From Server...</div>
    </div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <div className="box-list-container">
      <li className="box">
        <ul><h2 className="box-list-title">Active: {activeCount}</h2></ul>
        <ul><h2 className="box-list-title">Live Report</h2></ul>
        <ul><h2 className="box-list-title">Time: {currentTime}</h2></ul>
      </li>

      <table className="serial-table">
        <thead>
          <tr>
            <th>Serial Number</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {boxDetails.map((box, index) => (
            <tr key={index}>
              <td>{box.serialNumber}</td>
              <td>{box.status}</td>
              <td>
                <button className="more-btn" onClick={() => handleMoreClick(box.serialNumber)}>
                  <span className="eye"><FaEye /></span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BoxList;
