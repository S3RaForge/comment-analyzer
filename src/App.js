import React, { useState } from 'react';
import './App.css';

function App() {
  const [userTextData, setUserTextData] = useState('');
  const [response, setResponse] = useState(null);
  const [showDetails, setShowDetails] = useState(false);  

  const endpoint = "https://comment-analyzer-service.cognitiveservices.azure.com/language/:analyze-text?api-version=2023-04-01";
  const apiKey = "30f717d5425f4e5cb24e2e15069c09d4";

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

      const response = await fetch(endpoint, requestOptions);
      const data = await response.json();
      setResponse(data);
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
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
      <div class="footer bordered">
          <p>&copy; 2024 My Website</p>
      </div>
    </div>
  );
}

export default App;
