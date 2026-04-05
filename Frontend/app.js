const API_URL = "https://qr-backend-dg9e.onrender.com/api/qr";

// ✅ Setup dropdown ONCE
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("typeSelect").addEventListener("change", updateInput);
});

// ✅ UPDATE INPUT
function updateInput() {
  const type = document.getElementById("typeSelect").value;
  const container = document.getElementById("inputContainer");

  let html = "";

  if (type === "text") {
    html = `<input id="input" type="text" placeholder="Enter text">`;
  } else if (type === "url") {
    html = `<input id="input" type="url" placeholder="https://example.com">`;
  } else {
    html = `<input id="input" type="file">`;
  }

  container.innerHTML = `
    ${html}
    <button type="button" id="generateBtn">Generate QR</button>
  `;

  // ✅ Attach ONLY ONCE
  document.getElementById("generateBtn").onclick = generateQR;
}

// ✅ GENERATE QR
async function generateQR() {
  const type = document.getElementById("typeSelect").value;
  const input = document.getElementById("input");
  const qrDiv = document.getElementById("qrcode");

  try {
    let res;

    // TEXT / URL
    if (type === "text" || type === "url") {
      if (!input.value) return alert("Enter value");

      res = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: input.value
        })

      });

    } 
    // FILE
    else {
      const file = input.files[0];
      if (!file) return alert("Select a file");

      const formData = new FormData();
      formData.append("file", fileInput.files[0]);

      res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData
      });
    }

    if (!res.ok) {
      const err = await res.text();
      console.error(err);
      qrDiv.innerHTML = "Server error!";
      return;
    }

    const data = await res.json();

    // ✅ ONLY update once (NO clearing before)
    qrDiv.innerHTML = `<img src="${data.qr}" width="200">`;

  } catch (err) {
    console.error(err);
    qrDiv.innerHTML = "Error generating QR";
  }
}

// ✅ HISTORY
async function loadHistory() {
  const qrDiv = document.getElementById("qrcode");
  qrDiv.innerHTML = "Loading history...";

  try {
    const res = await fetch(`${API_URL}/history`);
    const data = await res.json();

    qrDiv.innerHTML = "";

    data.forEach(item => {
      const img = document.createElement("img");
      img.src = item.qr_code;
      img.width = 100;
      img.style.margin = "10px";
      qrDiv.appendChild(img);
    });

  } catch (err) {
    qrDiv.innerHTML = "Error loading history";
  }
}

// ✅ DOWNLOAD
function downloadQR() {
  const img = document.querySelector("#qrcode img");
  if (!img) return alert("Generate QR first");

  const link = document.createElement("a");
  link.href = img.src;
  link.download = "qr.png";
  link.click();
}