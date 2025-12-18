// Function to provide a set of WhatsApp-style colors
function getRandomColor() {
    const colors = [
        '#075e54', '#128c7e', '#34b7f1', '#25d366', 
        '#3e6184', '#8e44ad', '#c0392b', '#d35400', 
        '#2c3e50', '#2980b9'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Google Sheets Config
const SPREADSHEET_ID = '1TQ43EAPutGvl75KovXx0wOtN979JDfAj_KBMIxxNeLQ';

async function loadSheetData() {
    const table = document.getElementById('data-table');
    if (!table) return;

    const gid = table.getAttribute('data-gid'); 
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${gid}`;

    try {
        const response = await fetch(url);
        const csvData = await response.text();
        
        // Handle CSV split (ignoring commas inside quotes)
        const rows = csvData.split(/\r?\n/).map(row => {
            return row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        });

        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = '';

        for (let i = 1; i < rows.length; i++) {
            if (rows[i].length < 5) continue; 

            // Clean data
            const col1 = rows[i][0].replace(/^"|"$/g, '').trim(); // Primary (Bold)
            const col5 = rows[i][4].replace(/^"|"$/g, '').trim(); // Header (Random Color)
            
            const tr = document.createElement('tr');
            const td = document.createElement('td');

            // Construct HTML with Bold Column 1 and Random Color Column 5
            td.innerHTML = `
                <div class="whatsapp-header" style="background-color: ${getRandomColor()};">
                    ${col5}
                </div>
                <div class="message-bubble">
                    <span class="col-bold">${col1}</span>
                    ${renderRemainingColumns(rows[i])}
                </div>
            `;
            
            tr.appendChild(td);
            tableBody.appendChild(tr);
        }
    } catch (err) {
        console.error("Error loading data:", err);
    }
}

function renderRemainingColumns(rowArray) {
    let html = '';
    // Process columns 2, 3, 4 (indices 1, 2, 3)
    for (let j = 1; j <= 3; j++) {
        if (rowArray[j]) {
            let text = rowArray[j].trim().replace(/^"|"$/g, '');
            // Check for hyperlinks
            if (text.toLowerCase().includes('<a href=')) {
                html += `<div class="col-data">${text}</div>`;
            } else {
                html += `<div class="col-data">${text}</div>`;
            }
        }
    }
    return html;
}

loadSheetData();