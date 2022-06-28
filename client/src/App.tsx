import React from 'react';
import logo from './logo.svg';
import s from './App.module.css';
import Chat from './Chat/Chat';

function App() {
 
  return (
    <div className={s.container}>
      <Chat />
    </div>
  );
}

export default App;
