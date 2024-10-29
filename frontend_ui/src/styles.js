import styled, { createGlobalStyle } from 'styled-components';
import backgroundImage from './Images/backgroundgiftest.gif';

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: url(${backgroundImage}) no-repeat left center fixed;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  }
`;

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 99vh;
  width: 99%;
  margin: auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #d2d9dc ; 
`;

export const Taskbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #FF5733;
  color: white;
  border-radius: 8px 8px 0 0;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
`;

export const LogBut = styled.button`
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #FF5733 ;
  color: white;
  cursor: pointer;
`;

export const Welcome = styled.div`
  display: flex;
  align-items: center;
`;

export const TabContainer = styled.div`
  display: flex;
  justify-content: space-around;
  background-color: #FCFBF4;
  border-bottom: 1px solid #ccc;
`;

export const Tab = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  color: ${props => (props.isActive ? '#007bff' : '#000')};
  border-bottom: ${props => (props.isActive ? '2px solid #007bff' : 'none')};

  &:hover {
    color: #007bff;
  }
`;

export const ChatbotContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 99vh;
  width: 99%;
  overflow-y: auto;
  background-color: #d2d9dc ; 
`;

export const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;

export const Message = styled.div`
  background-color: ${(props) => (props.isUser ? '#DCF8C6' : '#FFF')};
  align-self: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
  margin: 5px 0;
  padding: 10px;
  border-radius: 10px;
  max-width: 60%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const RatingButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

export const ButRate = styled.button`
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${(props) => props.type === 'good' ? 'green' : props.type === 'avg' ? 'orange' : props.type === 'bad' ? 'red' : 'defaultColor'};
  color: white;
  &:hover {
    opacity: 0.8;
  }
`;

export const MessagesHistory = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;

export const MessageHistory = styled.div`
  background-color: ${props => (props.isUser ? '#DCF8C6' : '#FFF')};
  align-self: ${props => (props.isUser ? 'flex-end' : 'flex-start')};
  margin: 5px 0;
  padding: 10px;
  border-radius: 10px;
  max-width: 60%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const InputContainer = styled.div`
  display: flex;
  border-top: 1px solid #ccc;
  padding: 10px;
`;

export const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-right: 10px;
`;

export const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const ButtonUpdate = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #588970;
  color: white;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const ButtonClose = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #ff474c;
  color: white;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 99.8vh;
  width: 50%;
  max-width: 600px;
  position: fixed; /* Fixes the position of the container */
  top: 0px; /* Moves the container down from the top */
  right: 0px; /* Moves the container from the right */
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #FF5733;
  overflow: hidden; /* Prevents scrolling within the container */
`;

export const LoginHeading = styled.h1`
  color: #fff;
  font-size: 40px;
  border-radius: 4px;
  text-align: center;
`;

export const LoginSentance = styled.h1`
  color: #fff;
  font-size: 20px;
  border-radius: 4px;
  text-align: center;
`;

export const LoginTitle = styled.h1`
  margin-bottom: 20px;
`;

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 85%;
  padding: 20px;
`;

export const LoginInput = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const LoginButton = styled.button`
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #164983;
  color: white;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-size: 18px;
`;
