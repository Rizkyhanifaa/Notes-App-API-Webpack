class NoteHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                header {
                    background-color: #6a0dad;
                    color: white;
                    text-align: center;
                    font-size: 1em;
                    font-weight: bold;
                    position: sticky;
                    top: 0;
                    padding: 5px;
                    width: 100%; 
                    left: 0; 
                    right: 0;
                }
            </style>
            <header>
                <h1>Notes App</h1>
            </header>
        `;
    }
}

customElements.define('note-header', NoteHeader);
