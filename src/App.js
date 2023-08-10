import React, { useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ExpenseForm from './ExpenseForm/ExpenseForm';
import LoginForm from './LoginForm/LoginForm';

function App() {
   const [loggedIn, setLoggedIn] = useState(false);

  return (
  
   <Router>
       <Routes>
       <Route
          path="/" element={loggedIn ? <ExpenseForm /> : <LoginForm onLogin={() => setLoggedIn(true)} />}
        />
    </Routes>
    </Router>
    
   );
}

export default App;
