class NoteForm extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.render();
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          form {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
            padding: 20px;
            background: white;
          }
          input, textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid rgb(166, 126, 242);
            border-radius: 5px;
            font-size: 16px;
            font-family: "Poppins", sans-serif;
            box-sizing: border-box;
            margin: 0 auto;
          }
          button {
            padding: 10px;
            background-color: #6a0dad;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
            font-size: 15px;
          }
          button:hover {
            background: rgb(166, 126, 242);
          }
        </style>
  
        <form id="note-form">
          <input type="text" id="title" placeholder="Judul" required>
          <textarea id="body" placeholder="Isi catatan" required></textarea>
          <button type="submit">Tambah Catatan</button>
        </form>
      `;
  
      this.shadowRoot.querySelector('#note-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const title = this.shadowRoot.querySelector('#title').value.trim();
        const body = this.shadowRoot.querySelector('#body').value.trim();
  
        if (!title || !body) {
          Swal.fire({
            icon: 'error',
            title: 'Data tidak lengkap',
            text: 'Judul dan isi catatan tidak boleh kosong!',
            confirmButtonColor: '#e74c3c',
          });
          return;
        }
  
        this.dispatchEvent(new CustomEvent('note-submitted', {
          detail: { title, body },
          bubbles: true,
          composed: true
        }));
  
        this.shadowRoot.querySelector('#note-form').reset();
      });
    }
  }
  
  customElements.define("note-form", NoteForm);
  