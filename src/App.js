import React, { useState } from 'react';
import './App.css';

function App() {
  const [endPoint, setEndPoint] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [userTextData, setUserTextData] = useState('');
  const [response, setResponse] = useState(null);
  const [showDetails, setShowDetails] = useState(false);  

  const handleButtonClick = async () => {
    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': apiKey
        },
        body: JSON.stringify({
          kind: "SentimentAnalysis",
          analysisInput: {
            documents: [
              {
                id: "documentId",
                text: userTextData,
                language: "en"
              }
            ]
          },
          parameters: {
            opinionMining: true
          }
        })
      };

      const response = await fetch(endPoint, requestOptions);
      const data = await response.json();
      setResponse(data);
    } catch (error) {
      alert('Error:', error);
    }
  }

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  
  const renderDetails = () => {
    if (!response) return null;
    if (!showDetails) return null;
    return <pre>{JSON.stringify(response, null, 2)}</pre>; 
  };

  const renderIndicator = () => {
    if (!response) return null; 

    let sentiment = response.results.documents[0].sentiment;
    let color;
    switch (sentiment) {
      case 'positive':
        color = 'green';
        break;
      case 'negative':
        color = 'red';
        break;
      default:
        color = 'gray';
        break;
    }

    return <div style={{ backgroundColor: color }}>{sentiment}</div>;
  };

  return (
    <div className="App">
      <div class="header bordered">
        <h1>Comment analyzer</h1>
      </div>
      <div class='content bordered'>
      <div class='d-flex'>
            <input 
              value={endPoint} 
              onChange={(e) => setEndPoint(e.target.value)}
              placeholder='Enter endpoint (Azure Language service)'></input>
            <input 
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)}
              placeholder='Enter API Key'></input>
          </div>
      </div>
      <div class="content bordered">
          <p>It's very simple - you just write some text, press "analyze" button and wait until NN give you responce!</p>
          <textarea 
            value={userTextData} 
            onChange={(e) => setUserTextData(e.target.value)} 
            placeholder="Enter your text here..."
            ></textarea>
          <button onClick={handleButtonClick}>Analyze</button>
          <button onClick={toggleDetails}>
            {showDetails ? "Hide details" : "Show details"}
          </button>
      </div>
      <div className="details" class="bordered">{renderDetails()}
        <div className="indicator">{renderIndicator()}</div> 
      </div>
    </div>
  );
}

export default App;
