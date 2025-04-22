class NoteFooter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                footer {
                    background-color: #6a0dad;
                    color: white;
                    text-align: center;
                    padding: 10px;
                    font-size: 0.9em;
                }
            </style>
            <footer>
                <p>&copy; 2025 Rizky Hanifa Afania</p>
            </footer>
        `;
    }
}

customElements.define('note-footer', NoteFooter);
