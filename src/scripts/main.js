import '../components/note-form.js';
import '../components/note-item.js';

function main() {
  const baseUrl = 'https://notes-api.dicoding.dev/v2';

  const showLoading = (message = 'Loading...') => {
    Swal.fire({
      title: message,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
    return new Promise(resolve => setTimeout(resolve, 600));
  };

  const getNotes = async () => {
    const delay = showLoading("Loading Catatan...");
    try {
      const response = await fetch(`${baseUrl}/notes`);
      const responseJson = await response.json();
      await delay;
      if (responseJson.status !== 'success') {
        showResponseMessage(responseJson.message);
      } else {
        renderAllNotes(responseJson.data, 'non-archived');
      }
    } catch (error) {
      await delay;
      console.error("Fetch error:", error); 
      showResponseMessage(error.message);
    } finally {
      Swal.close();
    }
  };

  const insertNote = async (note) => {
    const delay = showLoading("Menyimpan Catatan...");
    try {
      const response = await fetch(`${baseUrl}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note),
      });
      const responseJson = await response.json();
      await delay;
      await Swal.fire({
        icon: "success",
        title: "Saved!",
        text: responseJson.message,
        confirmButtonColor: "#6C5CE7",
      });
      getNotes();
    } catch (error) {
      await delay;
      Swal.fire({ icon: "error", title: "Oops...", text: error.message });
    }
  };

  const removeNote = async (noteId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This note cannot be recovered once deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d63031",
      cancelButtonColor: "#636e72",
    });

    if (result.isConfirmed) {
      const delay = showLoading("Deleting note...");
      try {
        const response = await fetch(`${baseUrl}/notes/${noteId}`, {
          method: 'DELETE',
        });
        const responseJson = await response.json();
        await delay;
        await Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: responseJson.message,
          confirmButtonColor: "#6C5CE7",
        });
        getNotes();
      } catch (error) {
        await delay;
        Swal.fire({ icon: "error", title: "Oops...", text: error.message });
      }
    }
  };

  const renderAllNotes = (notes, type) => {
    const listNoteElement = document.querySelector('#listNote');
    listNoteElement.innerHTML = '';

    notes.forEach(note => {
      const noteItem = document.createElement('note-item');
      noteItem.note = note;

      noteItem.addEventListener('noteDeleted', async (event) => {
        const noteCard = noteItem.shadowRoot?.querySelector('.note-card') || noteItem;
        await gsap.to(noteCard, {
          opacity: 0,
          y: 20,
          duration: 0.3,
          ease: 'power2.in'
        });
        await removeNote(event.detail.id);
      });

      noteItem.addEventListener('noteArchived', async (event) => {
        const { id, archived } = event.detail;
      
        const delay = showLoading(archived ? "Unarchiving..." : "Archiving...");
        try {
          const endpoint = archived ? 'unarchive' : 'archive';
          const response = await fetch(`${baseUrl}/notes/${id}/${endpoint}`, {
            method: 'POST',
          });
          const result = await response.json();
          await delay;
      
          if (result.status !== 'success') {
            showResponseMessage(result.message);
          } else {
            await Swal.fire({
              icon: 'success',
              title: archived ? "Unarchived!" : "Archived!",
              text: result.message,
              confirmButtonColor: "#6C5CE7"
            });
            getNotes(); // Refresh list
          }
        } catch (error) {
          await delay;
          Swal.fire({ icon: "error", title: "Oops...", text: error.message });
        } finally {
          Swal.close();
        }
      });
      

      listNoteElement.prepend(noteItem);
    });
  };

  const showResponseMessage = (message = 'Check your internet connection') => {
    alert(message);
  };

  document.addEventListener('DOMContentLoaded', () => {
    const noteForm = document.querySelector('note-form');
    noteForm.addEventListener('note-submitted', (event) => {
      insertNote(event.detail);
    });

    document.addEventListener('noteUpdated', () => {
      getNotes(); 
    });

    // ✅ Tambahkan Event Listener tombol Show Archived Notes
    document.getElementById('showArchived').addEventListener('click', async () => {
      const delay = showLoading("Loading Catatan Arsip...");
      try {
        const response = await fetch(`${baseUrl}/notes/archived`);
        const result = await response.json();
        await delay;

        if (result.status !== 'success') {
          showResponseMessage(result.message);
        } else {
          renderAllNotes(result.data, 'archived');
        }
      } catch (error) {
        await delay;
        console.error("Fetch error:", error);
        showResponseMessage(error.message);
      } finally {
        Swal.close();
      }
    });

    getNotes();
  });
}

export default main;

main();
