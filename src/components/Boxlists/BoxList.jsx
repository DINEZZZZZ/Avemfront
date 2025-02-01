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
    {
      serialNumber: 'SN001',
      status: 'Active',
    },
    {
      serialNumber: 'SN002',
      status: 'Inactive',
    },
    {
      serialNumber: 'SN003',
      status: 'Active',
    },
  ];

  useEffect(() => {
    // Fetch data from the backend
    const fetchBoxDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8080/kits/'); // Replace with your backend endpoint
        if (response.data && response.data.length > 0) {
          // Extract only serialNumber and status from backend response
          const fetchedData = response.data.map((box) => ({
            serialNumber: box.serialNumber,
            status: box.status,
          }));
          setBoxDetails(fetchedData);
        } else {
          setBoxDetails(defaultData); // Use default data if no data is returned
        }
        setLoading(false);
      } catch (error) {
        setBoxDetails(defaultData); // Use default data in case of an error
        setLoading(false);
        setError('Failed to load box details');
      }
    };

    fetchBoxDetails();

    
    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString();
      setCurrentTime(time);
    }, 1000);

    // Cleanup interval when component unmounts
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Calculate the active count whenever box details are updated
    const countActive = boxDetails.filter((box) => box.status === 'active').length;
    setActiveCount(countActive);
  }, [boxDetails]);

  const handleMoreClick = (serial) => {
    // Navigate to the 'More' page with the serial number
    navigate(`/more/${serial}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="box-list-container">
      <li className="box">
        <ul>
          <h2 className="box-list-title">Active: {activeCount}</h2>
        </ul>
        <ul>
          <h2 className="box-list-title">Live Report</h2>
        </ul>
        <ul>
          <h2 className="box-list-title">Time: {currentTime}</h2>
        </ul>
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
                <span className='eye'><FaEye/></span>
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