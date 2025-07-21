import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Books.css"; // Import the CSS file

const API_URL = "https://cclab3-466610.de.r.appspot.com/books";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({ title: "", author: "", year: "" });
  const [editId, setEditId] = useState(null);

  // Fetch books on mount
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const res = await axios.get(API_URL);
    setBooks(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`${API_URL}/${editId}`, formData);
    } else {
      await axios.post(API_URL, formData);
    }
    setFormData({ title: "", author: "", year: "" });
    setEditId(null);
    fetchBooks();
  };

  const handleEdit = (book) => {
    setFormData({ title: book.title, author: book.author, year: book.year });
    setEditId(book.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchBooks();
  };

  return (
    <div className="books-container">
      <h2 className="books-header">📚 Library Manager</h2>

      <form onSubmit={handleSubmit} className="books-form">
        <input
          type="text"
          name="title"
          placeholder="Book Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={formData.author}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="year"
          placeholder="Year"
          value={formData.year}
          onChange={handleChange}
        />
        <button type="submit">{editId ? "Update" : "Add"}</button>
      </form>

      {/* Table view for larger screens */}
      <div className="books-table-wrapper">
        <table className="books-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Year</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-state">
                  No books found. Add your first book above!
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.year}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleEdit(book)} 
                        className="action-btn edit-btn"
                        title="Edit book"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDelete(book.id)} 
                        className="action-btn delete-btn"
                        title="Delete book"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Card view for mobile screens */}
      <div className="books-cards">
        {books.length === 0 ? (
          <div className="empty-state">
            No books found. Add your first book above!
          </div>
        ) : (
          books.map((book) => (
            <div key={book.id} className="book-card">
              <div className="book-card-header">
                <div className="book-card-title">{book.title}</div>
                <div className="book-card-id">#{book.id}</div>
              </div>
              <div className="book-card-info">
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Year:</strong> {book.year}</p>
              </div>
              <div className="book-card-actions">
                <button 
                  onClick={() => handleEdit(book)} 
                  className="action-btn edit-btn"
                  title="Edit book"
                >
                  ✏️
                </button>
                <button 
                  onClick={() => handleDelete(book.id)} 
                  className="action-btn delete-btn"
                  title="Delete book"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}