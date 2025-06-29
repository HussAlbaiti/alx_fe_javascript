document.addEventListener('DOMContentLoaded', function () {
    const quotes = [
        { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
        { text: "Life is what happens when you're busy making other plans.", category: "Life" },
        { text: "Do not take life too seriously. You will never get out of it alive.", category: "Humor" }
    ];

    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteBtn = document.getElementById('newQuote');

    // Display a random quote using innerHTML
    function showRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.innerHTML = "<strong>No quotes available. Please add one!</strong>";
            return;
        }

        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        quoteDisplay.innerHTML = `"${quote.text}" — <em>[${quote.category}]</em>`;
    }

    // Create the form dynamically (as expected)
    function createAddQuoteForm() {
        const container = document.getElementById('quoteFormContainer');

        const quoteInput = document.createElement('input');
        quoteInput.type = 'text';
        quoteInput.id = 'newQuoteText';
        quoteInput.placeholder = 'Enter a new quote';

        const categoryInput = document.createElement('input');
        categoryInput.type = 'text';
        categoryInput.id = 'newQuoteCategory';
        categoryInput.placeholder = 'Enter quote category';

        const addButton = document.createElement('button');
        addButton.textContent = 'Add Quote';
        addButton.onclick = addQuote;

        container.appendChild(quoteInput);
        container.appendChild(categoryInput);
        container.appendChild(addButton);
    }

    // Add quote to the array and DOM
    function addQuote() {
        const text = document.getElementById('newQuoteText').value.trim();
        const category = document.getElementById('newQuoteCategory').value.trim();

        if (text === "" || category === "") {
            alert("Please fill in both fields.");
            return;
        }

        quotes.push({ text, category });

        // Clear inputs
        document.getElementById('newQuoteText').value = "";
        document.getElementById('newQuoteCategory').value = "";

        alert("Quote added!");
    }

    // Initialize everything
    createAddQuoteForm();
    newQuoteBtn.addEventListener('click', showRandomQuote);
});
