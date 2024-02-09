import { ChangeEvent, useState } from "react";
import logo from "./assets/Logo.svg";
import { NewNoteCard } from "./components/new-note-card";
import { NoteCard } from "./components/note-card";

interface Note {
  id: string;
  date: Date;
  content: string;
}

export function App() {
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<Note[]>(() => {
    const storedNotes = localStorage.getItem("notes");

    if (storedNotes) {
      return JSON.parse(storedNotes);
    }

    return [];
  });

  function onNoteCreated(content: string) {
    const newNotes = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    };

    const notesArray = [newNotes, ...notes];

    setNotes(notesArray);

    localStorage.setItem("notes", JSON.stringify(notesArray));
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;

    setSearch(query);
  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter((note) => note.id !== id);

    setNotes(notesArray);

    localStorage.setItem("notes", JSON.stringify(notesArray));
  }

  const filteredNotes =
    search !== ""
      ? notes.filter((note) =>
          note.content.toLowerCase().includes(search.toLowerCase())
        )
      : notes;

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5 md:px-0">
      <img src={logo} alt="Logo" />

      <form className="w-full">
        <input
          type="text"
          placeholder="Busque em suas notas..."
          onChange={handleSearch}
          className="w-full bg-transparent text-2xl font-semibold tracking-tight outline-none placeholder:text-slate-500 "
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNotes.map((note) => (
          <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />
        ))}
      </div>
    </div>
  );
}
