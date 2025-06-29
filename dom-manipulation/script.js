document.addEventListener('DOMContentLoaded', function () {
    // Quotes array with initial content
    const quotes = [
        { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
        { text: "Life is what happens when you're busy making other plans.", category: "Life" },
        { text: "Do not take life too seriously. You will never get out of it alive.", category: "Humor" }
    ];

    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteBtn = document.getElementById('newQuote');
    const addQuoteBtn = document.getElementById('addQuoteBtn');
    const quoteInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');

    // Function to display a random quote
    function showRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.innerHTML = "No quotes available. Please add one!";
            return;
        }

        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        quoteDisplay.innerHTML = `"${quote.text}" — [${quote.category}]`;
    }

    // Function to add a new quote
    function addQuote() {
        const text = quoteInput.value.trim();
        const category = categoryInput.value.trim();

        if (text === "" || category === "") {
            alert("Please fill in both quote and category fields.");
            return;
        }

        // Add to array
        quotes.push({ text, category });

        // Optional: Clear inputs
        quoteInput.value = "";
        categoryInput.value = "";

        alert("Quote added!");
    }

    // Attach event listeners
    newQuoteBtn.addEventListener('click', showRandomQuote);
    addQuoteBtn.addEventListener('click', addQuote);
});
