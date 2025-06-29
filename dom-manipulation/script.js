// Final script.js for Dynamic Quote Generator with localStorage, filtering, and server sync

let quotes = [];
let lastSync = 0;

// On page load
document.addEventListener('DOMContentLoaded', () => {
  loadQuotes();
  populateCategories();
  restoreFilter();
  filterQuotes();

  document.getElementById('newQuote').addEventListener('click', filterQuotes);

  // Sync every 30 seconds
  setInterval(syncWithServer, 30000);
});

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
  localStorage.setItem('lastSync', Date.now());
}

function loadQuotes() {
  quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
  lastSync = parseInt(localStorage.getItem('lastSync'), 10) || 0;
}

function displayRandomQuote(filtered = quotes) {
  const quoteDisplay = document.getElementById('quoteDisplay');
  if (filtered.length === 0) {
    quoteDisplay.innerHTML = '<p>No quotes available in this category.</p>';
    return;
  }
  const quote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerHTML = `<p>"${quote.text}" <em>- ${quote.category}</em></p>`;
  sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

function filterQuotes() {
  const selected = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selected);
  const filtered = selected === 'all' ? quotes : quotes.filter(q => q.category === selected);
  displayRandomQuote(filtered);
}

function restoreFilter() {
  const saved = localStorage.getItem('selectedCategory');
  if (saved) document.getElementById('categoryFilter').value = saved;
}

function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();
  if (!text || !category) return alert('Please enter both quote and category.');

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  filterQuotes();
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json';
  link.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert('Quotes imported successfully.');
      } else {
        alert('Invalid JSON format.');
      }
    } catch {
      alert('Error parsing JSON.');
    }
  };
  reader.readAsText(event.target.files[0]);
}

async function syncWithServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const serverData = await response.json();
    const serverQuotes = serverData.slice(0, 10).map(p => ({ text: p.body, category: 'Server Quote' }));
    const newEntries = serverQuotes.filter(sq => !quotes.some(lq => lq.text === sq.text));

    if (newEntries.length) {
      quotes.push(...newEntries);
      saveQuotes();
      populateCategories();
      filterQuotes();
      notifyUser(`Synced ${newEntries.length} new quotes from server.`);
    }
  } catch (err) {
    console.error('Sync failed', err);
  }
}

function notifyUser(msg) {
  const banner = document.createElement('div');
  banner.textContent = msg;
  banner.style = 'position:fixed;top:10px;right:10px;background:#ffd;padding:10px;border:1px solid #aaa;z-index:1000;';
  document.body.appendChild(banner);
  setTimeout(() => document.body.removeChild(banner), 4000);
}
