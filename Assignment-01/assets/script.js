// --- 1) Element references ---
const board      = document.getElementById('board');
const noteText   = document.getElementById('noteText');
const addBtn     = document.getElementById('addBtn');
const pinColor   = document.getElementById('pincolor');
const sizeSelect = document.getElementById('sizeSelect');

// --- 2) State + persistence helpers ---
let pins = loadPins().map(p => ({
    // defaults first, then stored fields override
    id: p.id || String(Date.now() + Math.random()),
    text: p.text ?? '',
    color: p.color || (document.getElementById('pincolor')?.value || '#ffeb3b'),
    size: (p.size === 'small' || p.size === 'medium' || p.size === 'large') ? p.size : 'medium',
    createdAt: p.createdAt || Date.now()
  }));
const VIEW_KEY = 'pinboard_view';
let view = loadView(); // 'card' | 'list'

function loadView() {
  return localStorage.getItem(VIEW_KEY) || 'card';
}
function saveView() {
  localStorage.setItem(VIEW_KEY, view);
}


function loadPins() {
  try {
    const raw = localStorage.getItem('pins');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('LocalStorage read failed:', e);
    return [];
  }
}

function savePins() {
  try {
    localStorage.setItem('pins', JSON.stringify(pins));
  } catch (e) {
    console.warn('LocalStorage write failed:', e);
  }
}

const listBtn = document.getElementById('listViewBtn');
const cardBtn = document.getElementById('cardViewBtn');
cardBtn?.addEventListener('click', () => {
    view = 'card';
    saveView();
    applyView();
  });
  
  listBtn?.addEventListener('click', () => {
    view = 'list';
    saveView();
    applyView();
  });

// --- 3) Rendering ---
function createPinNode(pin) {
    const card = document.createElement('div');
    card.className = `pin ${pin.size}`; // size: small | medium | large
    card.style.backgroundColor = pin.color;
    card.dataset.id = pin.id;
  
    // --- Close (X) button in top-right ---
    const closeBtn = document.createElement('button');
    closeBtn.className = 'pin-close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Delete pin');
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', () => removePin(pin.id)); 
  
    // --- Editable text area ---
    const content = document.createElement('div');
    content.className = 'pin-content';
    content.contentEditable = 'true';
    content.textContent = pin.text;
    content.setAttribute('role', 'textbox');
    content.setAttribute('aria-label', 'Edit pin text');
  
    // Save edits (light debounce)
    let t;
    content.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        updatePin(pin.id, { text: content.textContent.trim() });
      }, 150);
    });
  
    // Build structure (X + content) and return
    card.appendChild(closeBtn);
    card.appendChild(content);
    return card;
  }
  

function render() {
        board.innerHTML = '';
        pins.forEach(pin => {
          const node = createPinNode(pin); 
          board.appendChild(node);         
        });
      }





function applyView() {
    // toggle classes on the board
    board.classList.toggle('card-view', view === 'card');
    board.classList.toggle('list-view', view === 'list');
  
    // a11y: pressed state
    listBtn.setAttribute('aria-pressed', String(view === 'list'));
    cardBtn.setAttribute('aria-pressed', String(view === 'card'));
  }
  

// --- 4) CRUD ---
function addPin(text) {
  const clean = text.trim();
  if (!clean) return;

  const newPin = {
    id: (crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now() + Math.random()),
    text: clean,
    color: pinColor.value,
    size: sizeSelect.value, // "small" | "medium" | "large"
    createdAt: Date.now()
  };

  pins.unshift(newPin);
  savePins();
  render();
}

function updatePin(id, patch) {
  const i = pins.findIndex(p => p.id === id);
  if (i === -1) return;
  pins[i] = { ...pins[i], ...patch };
  savePins();
}

function removePin(id) {
  pins = pins.filter(p => p.id !== id);
  savePins();
  render();
}

// --- 5) UI wiring ---
addBtn.addEventListener('click', () => {
  addPin(noteText.value);
  noteText.value = '';
  noteText.focus();
});

noteText.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addPin(noteText.value);
    noteText.value = '';
    noteText.focus();
  }
});

// --- 6) Initial paint ---
render();
applyView(); 
