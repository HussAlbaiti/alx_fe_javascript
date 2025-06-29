// Global Variables
const quotes = [];
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');

// Load quotes from localStorage
function loadQuotes() {
    const stored = localStorage.getItem('quotes');
    if (stored) {
        quotes.push(...JSON.parse(stored));
    }
}

// Save quotes to localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Show a random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = "<strong>No quotes available. Please add one!</strong>";
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    quoteDisplay.innerHTML = `"${quote.text}" — <em>[${quote.category}]</em>`;

    // Optional: Save last shown quote index to sessionStorage
    sessionStorage.setItem('lastQuoteIndex', randomIndex);
}

// Create the form to add a quote
function createAddQuoteForm() {
    const container = document.createElement('div');

    const textInput = document.createElement('input');
    textInput.id = 'newQuoteText';
    textInput.placeholder = 'Enter a new quote';

    const categoryInput = document.createElement('input');
    categoryInput.id = 'newQuoteCategory';
    categoryInput.placeholder = 'Enter quote category';

    const addButton = document.createElement('button');
    addButton.textContent = 'Add Quote';
    addButton.onclick = addQuote;

    container.appendChild(textInput);
    container.appendChild(categoryInput);
    container.appendChild(addButton);

    document.body.appendChild(container);
}

// Add a new quote
function addQuote() {
    const text = document.getElementById('newQuoteText').value.trim();
    const category = document.getElementById('newQuoteCategory').value.trim();

    if (text === '' || category === '') {
        alert('Please fill in both the quote and category.');
        return;
    }

    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    alert('Quote added!');
    
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
}

// Export quotes to a JSON file
function exportQuotesToJson() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                alert('Quotes imported successfully!');
            } else {
                alert('Invalid file format. Must be an array of quotes.');
            }
        } catch (err) {
            alert('Failed to parse JSON file.');
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// On Page Load
document.addEventListener('DOMContentLoaded', () => {
    loadQuotes();
    createAddQuoteForm();

    const lastIndex = sessionStorage.getItem('lastQuoteIndex');
    if (lastIndex !== null && quotes[lastIndex]) {
        quoteDisplay.innerHTML = `"${quotes[lastIndex].text}" — <em>[${quotes[lastIndex].category}]</em>`;
    }

    newQuoteBtn.addEventListener('click', showRandomQuote);

    // Add import/export buttons (optional, if not already in HTML)
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Export Quotes';
    exportBtn.onclick = exportQuotesToJson;
    document.body.appendChild(exportBtn);

    const importInput = document.createElement('input');
    importInput.type = 'file';
    importInput.accept = '.json';
    importInput.onchange = importFromJsonFile;
    document.body.appendChild(importInput);
});
