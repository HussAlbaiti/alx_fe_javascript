// Final Script.js for Dynamic Quote Generator

let quotes = [];
const quoteDisplay = document.getElementById('quoteDisplay');
const categoryFilter = document.getElementById('categoryFilter');

// Load quotes and preferences from local storage
function loadQuotes() {
  const storedQuotes = JSON.parse(localStorage.getItem('quotes') || '[]');
  quotes = storedQuotes;
  populateCategories();
  const lastCategory = localStorage.getItem('lastCategory') || 'all';
  categoryFilter.value = lastCategory;
  filterQuotes();
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Show random quote (optionally filtered by category)
function showRandomQuote() {
  const category = categoryFilter.value;
  const filteredQuotes = category === 'all' ? quotes : quotes.filter(q => q.category === category);
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = '<p>No quotes available for this category.</p>';
    return;
  }
  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  quoteDisplay.innerHTML = `<p>${randomQuote.text}</p><small>${randomQuote.category}</small>`;
  sessionStorage.setItem('lastQuote', JSON.stringify(randomQuote));
}

// Add new quote
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();
  if (!text || !category) return alert('Please enter both quote text and category.');
  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  filterQuotes();
  postQuoteToServer(newQuote);
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

// Populate categories from quotes array
function populateCategories() {
  const categories = ['all', ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

// Filter quotes by category
function filterQuotes() {
  localStorage.setItem('lastCategory', categoryFilter.value);
  showRandomQuote();
}

// Export quotes to JSON
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert('Quotes imported successfully!');
    } catch (e) {
      alert('Invalid JSON file.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Simulate fetching quotes from server using async/await
async function fetchQuotesFromServer() {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    const serverQuotes = await res.json();
    const serverData = serverQuotes.slice(0, 5).map(post => ({ text: post.title, category: 'Server' }));
    const newQuotes = serverData.filter(q => !quotes.some(local => local.text === q.text));
    if (newQuotes.length > 0) {
      quotes = [...quotes, ...newQuotes];
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert('Synced with server and updated new quotes.');
    }
  } catch (err) {
    console.error('Failed to fetch from server:', err);
  }
}

// Post new quote to server (simulated)
async function postQuoteToServer(quote) {
  try {
    await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quote)
    });
    console.log('Posted quote to server:', quote);
  } catch (err) {
    console.error('Failed to post quote to server:', err);
  }
}

// Sync local data with server periodically
function syncQuotes() {
  fetchQuotesFromServer();
}

setInterval(syncQuotes, 30000); // sync every 30 seconds

document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.addEventListener('DOMContentLoaded', () => {
  loadQuotes();
  const lastQuote = sessionStorage.getItem('lastQuote');
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    quoteDisplay.innerHTML = `<p>${quote.text}</p><small>${quote.category}</small>`;
  }
});