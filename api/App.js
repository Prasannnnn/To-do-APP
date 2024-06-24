import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: []
    };
    this.API_URL = "http://localhost:5038/";
  }

  componentDidMount() {
    this.refreshNotes();
  }

  async refreshNotes() {
    try {
      const response = await fetch(this.API_URL + "api/todoapp/GetNotes");
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }
      const data = await response.json();
      this.setState({ notes: data });
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  }

  async addClick() {
    const newNotes = document.getElementById("newNotes").value;
    const data = new FormData();
    data.append("newNotes", newNotes);

    try {
      const response = await fetch(this.API_URL + "api/todoapp/AddNotes", {
        method: "POST",
        body: data
      });
      const result = await response.json();
      alert(result);
      this.refreshNotes();
    } catch (error) {
      console.error('Error adding note:', error);
    }
  }

  async deleteClick(id) {
    console.log("Deleting note with id:", id);  // Debugging information
    try {
      const response = await fetch(this.API_URL + "api/todoapp/DeleteNotes?id=" + id, {
        method: "DELETE",
      });
      const result = await response.json();
      alert(result);
      this.refreshNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }

  render() {
    const { notes } = this.state;
    return (
      <div className="App">
        <h2>Todo APP</h2>
        <input id="newNotes" />&nbsp;
        <button onClick={() => this.addClick()}>Add Notes</button>
        {notes.map(note => (
          <p key={note.id}>
            <b>{note.description}</b>&nbsp;
            <button onClick={() => this.deleteClick(note.id)}>Delete Notes</button>
          </p>
        ))}
      </div>
    );
  }
}

export default App;
