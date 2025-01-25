import React, { useState, useEffect } from "react"
import api from './api'

const App = () => {
  const [transactions, setTransactions] = useState([])
  const [transactionId, setTransactionId] = useState(null)
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    is_income: false,
    date: ''
  });

  const fetchTransactions = async () => {
    const response = await api.get('/transactions/');
    setTransactions(response.data)
  };

  useEffect(() => {
    fetchTransactions();
  }, [])

  const handleInputChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData({
      ...formData,
      [event.target.name]: value,
    });
  };

  const handleCreateSubmit = async (event) => {
    event.preventDefault();
    (await api.post('/transactions/', formData));
    fetchTransactions();
    setFormData({
      amount: '',
      category: '',
      description: '',
      is_income: false,
      date: '',
      id: '',
    });
  };

  const handleDetailSubmit = async (event, transaction_id) => {
    event.preventDefault();
    const response = await api.get(`/transactions/${transaction_id}`, transactionId);
    setTransactionId(transactionId);
    console.log(response.data)
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            Finance App
          </a>
        </div>
      </nav>

      <div className="container">
        <form onSubmit={handleCreateSubmit}>
          <div className="mb-3 mt-3">
            <label htmlFor="amount" className="form-label">
              amount
            </label>
            <input type="text" className="form-control" id="amount" name="amount" onChange={handleInputChange} value={formData.amount} />
          </div>

          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              category
            </label>
            <input type="text" className="form-control" id="category" name="category" onChange={handleInputChange} value={formData.category} />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              description
            </label>
            <input type="text" className="form-control" id="description" name="description" onChange={handleInputChange} value={formData.description} />
          </div>

          <div className="mb-2">
            <label htmlFor="is_income" className="form-label me-1">
              income
            </label>
            <input type="checkbox" id="is_income" name="is_income" onChange={handleInputChange} value={formData.is_income} />
          </div>

          <div className="mb-3">
            <label htmlFor="date" className="form-label">
              date
            </label>
            <input type="text" className="form-control" id="date" name="date" onChange={handleInputChange} value={formData.date} />
          </div>

          <button type="submit" className="btn btn-primary">submit</button>
        </form>



        <table className="table table-striped table-bordered table-hover mt-5">
          <thead>
            <tr>
              <th>amount</th>
              <th>category</th>
              <th>description</th>
              <th>income?</th>
              <th>date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.amount}</td>
                <td>
                  <form onSubmit={(event) => handleDetailSubmit(event, transaction.id)}>
                    <button type="submit" className="btn btn-link">
                      {transaction.category}
                    </button>
                  </form>
                </td>
                <td>{transaction.description}</td>
                <td>{transaction.is_income ? 'yes' : 'no'}</td>
                <td>
                  {transaction.date}
                </td>
                <td className="hidden">
                  <div className="ms-auto">
                    <button type="submit" className="me-3 btn btn-info">
                      edit
                    </button>
                    <button type="submit" className="btn btn-danger">
                      delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  )

}


export default App;
