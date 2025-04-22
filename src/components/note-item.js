class NoteItem extends HTMLElement {
  constructor() {
    super();
    this._data = null;
    this.attachShadow({ mode: 'open' });
  }

  set note(data) {
    this._data = data;
    this.render();
  }

  get note() {
    return this._data;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .note {
          border: 1px solid #ccc;
          padding: 16px;
          margin-bottom: 12px;
          border-radius: 8px;
        }
        .note h3 {
          margin: 0;
          font-size: 20px;
        }
        .note p {
          margin: 8px 0;
        }
        .note small {
          color: gray;
        }
        .actions {
          margin-top: 10px;
        }
        button {
          margin-right: 8px;
          padding: 4px 8px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .delete {
          background-color: #ff4d4d;
          color: white;
        }
        .archive {
          background-color: #007bff;
          color: white;
        }
      </style>
      <div class="note">
        <h3>${this._data.title}</h3>
        <p>${this._data.body}</p>
        <small>${new Date(this._data.createdAt).toLocaleString()}</small>
        <div class="actions">
          <button class="archive">${this._data.archived ? 'Unarchive' : 'Archive'}</button>
          <button class="delete">Delete</button>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector('.delete').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('noteDeleted', {
        detail: { id: this._data.id },
        bubbles: true,
        composed: true
      }));
    });

    this.shadowRoot.querySelector('.archive').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('noteArchived', {
        detail: {
            id: this._data.id,
            archived: this._data.archived
          },
          bubbles: true,
          composed: true
      }));
    });
  }
}

customElements.define('note-item', NoteItem);
