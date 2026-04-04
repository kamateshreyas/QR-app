const API_URL = "http://localhost:3000/api/qr";

// Keep your existing function
function updateInput() {
  const select = document.getElementById('typeSelect');
  const container = document.getElementById('inputContainer');
  const type = select.value;

  let html = '';

  switch(type) {
    case 'text':
      html = '<input id="input" type="text" placeholder="Enter text here...">';
      break;
    case 'url':
      html = '<input id="input" type="url" placeholder="https://example.com">';
      break;
    case 'image':
      html = '<input id="input" type="file" accept="image/*">';
      break;
    case 'video':
      html = '<input id="input" type="file" accept="video/*">';
      break;
    case 'audio':
      html = '<input id="input" type="file" accept="audio/*">';
      break;
    case 'file':
      html = '<input id="input" type="file">';
      break;
    default:
      html = '<p>Select option</p>';
  }

  container.innerHTML = html + '<button onclick="generateQR()">Generate QR</button>';
}

// 🔥 UPDATED generateQR
async function generateQR() {
  try {
    const type = document.getElementById('typeSelect').value;
    const input = document.getElementById('input');
    const qrContainer = document.getElementById('qrcode');

    qrContainer.innerHTML = "Loading...";

    let res;

    if (type === "text" || type === "url") {
      res = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type,
          content: input.value
        })
      });
    } else {
      const file = input.files[0];
      if (!file) return alert("Select file");

      const formData = new FormData();
      formData.append("file", file);

      res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData
      });
    }

    if (!res.ok) throw new Error("Server error");

    const data = await res.json();
    displayQR(data.qrCode);

  } catch (err) {
    console.error(err);
    document.getElementById('qrcode').innerHTML = "Error generating QR";
  }
}

// Display QR
function displayQR(qr) {
  const qrContainer = document.getElementById('qrcode');
  qrContainer.innerHTML = `<img src="${qr}" width="200">`;
}

// 🔥 NEW: Load history
async function loadHistory() {
  const res = await fetch(`${API_URL}/history`);
  const data = await res.json();

  console.log("History:", data);
}

// 🔥 NEW: Download QR
function downloadQR() {
  const img = document.querySelector("#qrcode img");
  if (!img) return alert("Generate QR first");

  const link = document.createElement("a");
  link.href = img.src;
  link.download = "qr-code.png";
  link.click();
}