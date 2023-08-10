import axios from 'axios';
// import {firestore} from '../firebase';
import React, { useState, useEffect } from 'react';

const ExpenseForm = () => {
  console.log("Hello");
  const [expenses, setExpenses] = useState([]);
  const [moneySpent, setMoneySpent] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [editingExpense, setEditingExpense] = useState(null); // To track the edited expense
  const generateUniqueID = () => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000000); // Generate a random number between 0 and 999999
    return `${timestamp}-${randomNum}`;
  };
  const handleAddExpense = () => {
    const newExpense = {
      id: generateUniqueID(),
      moneySpent,
      description,
      category,
    };
  
    axios.post('https://expense-tracker-8f63f-default-rtdb.firebaseio.com/expenses.json', newExpense)
      .then(response => {
        console.log("Expense added successfully:", response.data);
  
        // Update local state
        setExpenses([...expenses, newExpense]);
        setMoneySpent('');
        setDescription('');
        setCategory('');
      })
      .catch(error => {
        console.error("Error adding expense:", error);
      });
  };
  
 const fetchExpenses=()=>
 {
  axios.get('https://expense-tracker-8f63f-default-rtdb.firebaseio.com/expenses.json')
  .then(response => {
    const fetchedExpenses = response.data;
    if (fetchedExpenses) {
      const expensesArray = Object.values(fetchedExpenses);
      setExpenses(expensesArray);
    }
  })
  .catch(error => {
    console.error("Error fetching expenses:", error);
  });
 }
  useEffect(() => {
    // Using axios to fetch expenses from Firebase
    fetchExpenses();
  }, []); // Empty dependency array ensures the effect runs only once, on mount

  
  const handleDeleteExpense = (expenseId) => {
    // Using axios to delete expense data
    console.log(expenseId);
    axios.delete(`https://expense-tracker-8f63f-default-rtdb.firebaseio.com/expenses/${expenseId}.json`)
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
  };

  const handleEditSubmit = () => {
    // Using axios to update edited expense data
    axios.put(`https://expense-tracker-8f63f-default-rtdb.firebaseio.com/expenses/${editingExpense.id}.json`, editingExpense)
      .then(response => {
        console.log("Expense successfully updated");
        fetchExpenses(); // Fetch expenses again to update the list
        setEditingExpense(null); // Clear the editing state
      })
      .catch(error => {
        console.error("Error updating expense:", error);
      });
  };
  return (
    <div>
      <h2>Expense Tracker</h2>
      
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
          {/* Add more options */}
        </select>
        <button type="button" onClick={handleAddExpense}>
          Add Expense
        </button>
      </form>
      
      <h3>Expenses:</h3>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.description} - {expense.moneySpent} - {expense.category}
            <button onClick={() => handleDeleteExpense(expense.id)}>Delete</button>
            <button onClick={() => handleEditExpense(expense.id)}>Edit</button>
          </li>
        ))}
      </ul>

      {/* Edit form */}
      {editingExpense && (
        <div>
          <h3>Edit Expense</h3>
          <form onSubmit={handleEditSubmit}>
            {/* Edit input fields */}
            <input
              type="text"
              value={editingExpense.moneySpent}
              onChange={(e) => setEditingExpense({ ...editingExpense, moneySpent: e.target.value })}
            />
            <input
              type="text"
              value={editingExpense.description}
              onChange={(e) => setEditingExpense({ ...editingExpense, description: e.target.value })}
            />
            <select
              value={editingExpense.category}
              onChange={(e) => setEditingExpense({ ...editingExpense, category: e.target.value })}
            >
              {/* ... options ... */}
            </select>
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ExpenseForm;
