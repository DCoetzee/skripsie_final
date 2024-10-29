import React, { useState, useEffect, useRef } from 'react';
import {
  GlobalStyle,
  ChatContainer,
  Taskbar,
  Logo,
  Welcome,
  TabContainer,
  Tab,
  Messages,
  Message,
  MessagesHistory,
  MessageHistory,
  InputContainer,
  Input,
  Button,
  ButtonUpdate,
  ButtonClose,
  ChatbotContainer,
  RatingButtons,
  ButRate,
} from './styles';
import Login from './Login';
import { initializeApp } from "firebase/app";
import { getAnalytics, setDefaultEventParameters } from "firebase/analytics";
import { useSpring, animated, useTransition } from '@react-spring/web';
import { FaInfoCircle } from 'react-icons/fa'; 
import loadingGif from './Images/loading-gif.gif';
import loadingGifUpdate from './Images/UpdateLoading.gif';
import updateCompleteGif from './Images/Complete.gif';

const firebaseConfig = {
  apiKey: "AIzaSyAW-deYoth9RFCDQyjHYtMCPtpYV1lLm5s",
  authDomain: "procastipal.firebaseapp.com",
  projectId: "procastipal",
  storageBucket: "procastipal.appspot.com",
  messagingSenderId: "206453829549",
  appId: "1:206453829549:web:47299da999f973bd8dfb24",
  measurementId: "G-7Q4XYHKRWY"
};


function InfoPage({ onClose, username }) {
  const [isLoadingUpdateVisible, setIsLoadingUpdateVisible] = useState(false);
  const [isUpdateCompleteVisible, setIsUpdateCompleteVisible] = useState(false);

  const handleUpdate = async () => {
    setIsLoadingUpdateVisible(true);

    const response = await fetch('http://127.0.0.1:5004/stop', { method: 'POST' });
    const data = await response.json();
    console.log(data);

    try {
      const response = await fetch('http://127.0.0.1:5005/update_db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ foldername: username }),
      });
      const data = await response.json();
      console.log(data);

      if (data.results === "successful"){
        const response = await fetch('http://127.0.0.1:5004/start', { method: 'POST' });
        const data = await response.json();
        console.log(data);

        setIsLoadingUpdateVisible(false);
        setIsUpdateCompleteVisible(true);
      } else {
        const response = await fetch('http://127.0.0.1:5004/start', { method: 'POST' });
        const data = await response.json();
        console.log(data);

        setIsLoadingUpdateVisible(false);
        setIsUpdateCompleteVisible(true);
      }

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleLoadingUpdate = () => {
    setIsLoadingUpdateVisible(!isLoadingUpdateVisible);
  };

  const toggleUpdateComplete = () => {
    setIsUpdateCompleteVisible(!isUpdateCompleteVisible);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '25%',
        height: '25%',
        textAlign: 'center',
      }}>
        <h2>ProcastiPal - Settings</h2>
        <p>Get ProcastiPal up to date with the newest data:</p>
        <ButtonUpdate onClick={handleUpdate} style={{ marginRight: '10px' }}>Update</ButtonUpdate>
        <ButtonClose onClick={onClose}>Close</ButtonClose>
        {isLoadingUpdateVisible && <LoadingUpdate onClose={toggleLoadingUpdate} />}
        {isUpdateCompleteVisible && <UpdateComplete onClose={toggleUpdateComplete} />}
      </div>
    </div>
  );
}

function Loading({ onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '25%',
        textAlign: 'center',
      }}>
        <h2>Loading</h2>
        <img src={loadingGif} alt="Loading" style={{ width: '100px', marginBottom: '20px' }} />
      </div>
    </div>
  );
}

function LoadingUpdate({ onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '25%',
        textAlign: 'center',
      }}>
        <h2>Updating ProcastiPal...</h2>
        <img src={loadingGifUpdate} alt="Loading" style={{ width: '100px', marginBottom: '20px' }} />
      </div>
    </div>
  );
}

function UpdateComplete({ onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '25%',
        textAlign: 'center',
      }}>
        <h2>Update Complete</h2>
        <img src={updateCompleteGif} alt="Loading" style={{ width: '100px', marginBottom: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto'}} />
        <ButtonClose onClick={onClose}>Close</ButtonClose>
      </div>
    </div>
  );
}

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('ProcrastiPal Tab 1');
  const [messages, setMessages] = useState([
    { text: 'Good day! My name is ProcrastiPal  .  .  .', isUser: false },
    { text: 'I am here to help you Procrastinate!', isUser: false },
    { text: 'Send me your query and let me assist you :)', isUser: false },
  ]);

  const [messagesHistory, setMessagesHistory] = useState([
    { text: '', isUserLlama: false },
  ]);

  const [input, setInput] = useState('');
  const [inputHistory, setInputHistory] = useState('');
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [isLoadingVisible, setIsLoadingVisible] = useState(false);
  const [username, setUsername] = useState('');

  const handleSend = async () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, isUser: true }]);
      setIsLoadingVisible(true);
      try {
        const response = await fetch('http://127.0.0.1:5000/query_data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query_text: input }),
        });
        const data = await response.json();
        setIsLoadingVisible(false);
        setMessages(prevMessages => [
          ...prevMessages,
          { text: data.results, isUser: false },
        ]);
        setMessages(prevMessages => [
          ...prevMessages,
          { text: data.sources, isUser: false },
        ]);
        setMessages(prevMessages => [
          ...prevMessages,
          { text: 'Please Rate the Response:', isUser: false, isRating: true },
        ]);
      } catch (error) {
        console.error('Error:', error);
      }
      setInput('');
    }
  };

  const [good, setGood] = useState(1);
  const [avg, setAvg] = useState(1);
  const [bad, setBad] = useState(1);

  const handleRating = async ({ rating }) => {
    if (rating === 'good'){
      setGood(good + 1);
      console.log(good);
    }

    if (rating === 'average'){
      setAvg(avg + 1);
      console.log(avg);
    }

    if (rating === 'bad'){
      setBad(bad + 1);
      console.log(bad);
    }
  };

  const handleSendHistory = async () => {
    if (inputHistory.trim()) {
      setMessagesHistory([...messagesHistory, { text: inputHistory, isUser: true }]);
      setIsLoadingVisible(true);
      try {
        const response = await fetch('http://0.0.0.0:5001/query_history', {
          method: 'POST',
          headers : {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query_text: inputHistory }),
        });
        const data = await response.json();
        setIsLoadingVisible(false);
        setMessagesHistory(prevMessagesHistory => [
          ...prevMessagesHistory,
          { text: data.results, isUser: false},
        ]);
        setMessagesHistory(prevMessagesHistory => [
          ...prevMessagesHistory,
          { text: data.sources, isUser: false},
        ]);
      } catch (error) {
        console.error('Error:', error);
      }
      setInputHistory('');
    }
  };

  const handleLogin = async (username) => {
    setUsername(username);
    setIsLoggedIn(true);
    const response = await fetch('http://127.0.0.1:5004/start', { method: 'POST' });
    const data = await response.json();
    console.log(data);
  };

  const animationProps = useSpring({
    opacity: isLoggedIn ? 1 : 0,
    transform: isLoggedIn ? 'translateY(0)' : 'translateY(-50px)',
    config: { tension: 280, friction: 60 },
  });

  const toggleInfoPage = () => {
    setIsInfoVisible(!isInfoVisible);
  };

  const toggleLoading = () => {
    setIsLoadingVisible(!isLoadingVisible);
  };

  const messagesEndRef = useRef(null);
  const messagesEndRefHistory = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToBottomHistory = () => {
    messagesEndRefHistory.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    scrollToBottomHistory();
  }, [messagesHistory]);

  if (!isLoggedIn) {
    return (
      <>
        <GlobalStyle />
        <Login onLogin={handleLogin} />
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <animated.div style={animationProps}>
      <ChatContainer>
        <Taskbar>
          <Logo>
            <img src="propal_logo.jpg" alt="Logo" style={{ height: '100px', width: '110px', marginRight: '10px', borderRadius: 25 }} />
            <h1>ProcrastiPal</h1>
          </Logo>
          <Welcome>
            <h2>Welcome, {username}</h2>
            <FaInfoCircle size={24} style={{ marginLeft: '10px', cursor: 'pointer' }} title="Info" onClick={toggleInfoPage} />
            </Welcome>
        </Taskbar>
        <TabContainer>
          <Tab isActive={activeTab === 'ProcrastiPal Tab 1'} onClick={() => setActiveTab('ProcrastiPal Tab 1')}>
            ProcrastiPal ~ (GPT-4o)
          </Tab>
          <Tab isActive={activeTab === 'ProcrastiPal Tab 2'} onClick={() => setActiveTab('ProcrastiPal Tab 2')}>
            Coming Soon...
          </Tab>
        </TabContainer>
        <ChatbotContainer>
          {activeTab === 'ProcrastiPal Tab 1' && (
            <>
              <Messages>
                {messages.map((msg, index) => (
                  <Message key={index} isUser={msg.isUser}>
                    {msg.text}
                    {msg.isRating && (
                      <RatingButtons>
                        <ButRate type="good" onClick={() => handleRating({rating: 'good'})}>Good</ButRate>
                        <ButRate type="avg" onClick={() => handleRating({rating: 'average'})}>Average</ButRate>
                        <ButRate type="bad" onClick={() => handleRating({rating: 'bad'})}>Bad</ButRate>
                      </RatingButtons>
                    )}
                  </Message>
                ))}
                <div ref={messagesEndRef} />
              </Messages>
              <InputContainer>
                <Input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => {
                    if (e.key === 'Enter') handleSend();
                  }}
                  placeholder="Type a message..."
                />
                <Button onClick={handleSend}>Send</Button>
              </InputContainer>
            </>
          )}
          {activeTab === 'ProcrastiPal Tab 2' && (
            <>
            </>
          )}
          </ChatbotContainer>
          {isInfoVisible && <InfoPage onClose={toggleInfoPage} username={username}/>}
          {isLoadingVisible && <Loading onClose={toggleLoading} />}
      </ChatContainer>
      </animated.div>
    </>
  );
}

export default App;
