import axios from 'axios';
// import {firestore} from '../firebase';
import { themeReducer } from './themeReducer';
import { toggleTheme } from './themeActions';
import './theme.css';
import React, { useState, useEffect, useReducer} from 'react';
// import './ExpenseForm.css';


const ExpenseForm = () => {
  console.log("Hello");
  const [theme, dispatchTheme] = useReducer(themeReducer, 'light');
  const [expenses, setExpenses] = useState([]);
  const [moneySpent, setMoneySpent] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [editingExpense, setEditingExpense] = useState(null);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [showPremiumButton, setShowPremiumButton] = useState(false);
  const [showToggleThemeButton, setShowToggleThemeButton] = useState(false);
 // To track the edited expense
  
  const handleAddExpense = () => {
    const newExpense = {
      moneySpent,
      description,
      category,
    };
  
    axios.post('https://expense-tracker-8f63f-default-rtdb.firebaseio.com/expenses.json', newExpense)
      .then(response => {
        console.log("Expense added successfully:", response);
  
        // Update local state
        setExpenses([...expenses, newExpense]);
        setMoneySpent('');
        setDescription('');
        setCategory('');
        const newTotal = totalExpenses + parseFloat(newExpense.moneySpent);
        setTotalExpenses(newTotal);
        setShowPremiumButton(newTotal >= 10000);
      })
      .catch(error => {
        console.error("Error adding expense:", error);
      });
  };
  
  const fetchExpenses = () => {
    axios
      .get('https://expense-tracker-8f63f-default-rtdb.firebaseio.com/expenses.json')
      .then((response) => {
        const fetchedExpenses = response.data;
        if (fetchedExpenses) {
          const expensesArray = Object.values(fetchedExpenses);
          setExpenses(expensesArray);

          // Calculate total expenses
          
        }
      })
      .catch((error) => {
        console.error("Error fetching expenses:", error);
      });
  };
  
  useEffect(() => {
    // Using axios to fetch expenses from Firebase
    fetchExpenses();
  }, []); // Empty dependency array ensures the effect runs only once, on mount

  
  const handleDeleteExpense = (index) => {
    const expenseIdToDelete = expenses[index].id;
  
    axios.delete(`https://expense-tracker-8f63f-default-rtdb.firebaseio.com/expenses/${expenseIdToDelete}.json`)
      .then(response => {
        console.log("Expense successfully deleted");
        fetchExpenses(); // Fetch expenses again to update the list
      })
      .catch(error => {
        console.error("Error deleting expense:", error);
      });
  };
  

  const handleEditExpense = (expenseId) => {
    // Set the editingExpense state to the expense being edited
    const editedExpense = expenses.find(expense => expense.id === expenseId);
    setEditingExpense(editedExpense);
  
    // Pre-populate edit form fields with the selected expense's data
    setMoneySpent(editedExpense.moneySpent);
    setDescription(editedExpense.description);
    setCategory(editedExpense.category);
  };
  const handleDownloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Description,Money Spent,Category\n" +
      expenses.map(expense => `${expense.description},${expense.moneySpent},${expense.category}`).join("\n");
  
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handlePremiumActivation = () => {
    setShowPremiumButton(false);
    setShowToggleThemeButton(true); // Show the Toggle Theme button when premium is activated
  };

  
const handleEditSubmit = () => {
  // Create a copy of the editingExpense with updated values
  const updatedExpense = {
    ...editingExpense,
    moneySpent,
    description,
    category,
  };
  axios.put(`https://expense-tracker-8f63f-default-rtdb.firebaseio.com/expenses/${editingExpense.id}.json`, updatedExpense)
  .then(response => {
    console.log("Expense successfully updated");
    fetchExpenses();
    setEditingExpense(null);
  })
  .catch(error => {
    console.error("Error updating expense:", error);
  });
};


  return (
    <div className={`expense-form ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
    <h2 className="header">Expense Tracker</h2>
    {showToggleThemeButton && ( 
        <button className="theme-button" onClick={() => dispatchTheme(toggleTheme())}>
          Toggle Theme
        </button>
      )}
    <button className="download-button" onClick={handleDownloadCSV}>
      Download File
    </button>
      
      <form>
        <input
          type="text"
          value={moneySpent}
          onChange={(e) => setMoneySpent(e.target.value)}
          placeholder="Money Spent"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Petrol">Petrol</option>
          <option value="Salary">Salary</option>
       
        </select>
        <button type="button" onClick={handleAddExpense}>
          Add Expense
        </button>
      </form>
       

       
      <h3 className="total-expenses">Total Expenses: ${totalExpenses.toFixed(2)}</h3>
      {showPremiumButton && (
        <button className="premium-button" onClick={handlePremiumActivation}>
          Activate Premium
        </button>
      )}
      <h3 className="expenses-header">Expenses:</h3>
      <ul className="expenses-list">
  {expenses.map((expense, index) => (
    <li key={expense.id} className="expense-item">
      {expense.description} - {expense.moneySpent} - {expense.category}
      {/* <button onClick={() => handleDeleteExpense(index)}>Delete</button>
      <button onClick={() => handleEditExpense(expense.id)}>Edit</button> */}
    </li>
  ))}
</ul>



{editingExpense && (
  <div className="edit-form">
    <h3>Edit Expense</h3>
    <form onSubmit={handleEditSubmit}>
      <input
        type="text"
        value={moneySpent}
        onChange={(e) => setMoneySpent(e.target.value)}
        placeholder="Money Spent"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        <option value="Food">Food</option>
        <option value="Petrol">Petrol</option>
        <option value="Salary">Salary</option>
      </select>
      <button className="action-button submit-button" type="submit">
        Submit
      </button>
    </form>
  </div>
)}
    </div>
  );
};

export default ExpenseForm;