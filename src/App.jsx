
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import "./App.css";

function App() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState("Loading notes...");

  async function fetchNotes() {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Error loading notes: " + error.message);
      return;
    }

    setNotes(data);
    setMessage("");
  }

  async function addNote() {
    if (!note.trim()) {
      setMessage("Please enter a note.");
      return;
    }

    setMessage("Saving note...");

    const { error } = await supabase
      .from("notes")
      .insert([{ content: note.trim() }]);

    if (error) {
      console.error("Delete error:", error);
      setMessage("Error deleting note: " + error.message);
      return;
    }

    setNote("");
    setMessage("Note saved!");

    await fetchNotes();
  }

  async function deleteNote(id) {
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage("Error deleting note: " + error.message);
      return;
    }

    setMessage("Note deleted!");
    await fetchNotes();
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="app">
      <h1>My Notes</h1>

      <div className="note-form">
        <input
          type="text"
          placeholder="Write a note..."
          value={note}
          onChange={(event) => setNote(event.target.value)}
          maxLength={1000}
        />

        <button onClick={addNote}>Save Note</button>
      </div>

      {message && <p>{message}</p>}

      <h2>Saved Notes</h2>

      {notes.length === 0 ? (
        <p>No notes yet.</p>
      ) : (
        <ul>
          {notes.map((item) => (
            <li key={item.id}>
              {item.content}{" "}
              <button onClick={() => deleteNote(item.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
