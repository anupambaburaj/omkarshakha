// Define the Header Content
const headerContent = `
    <header>
        <nav>
            <a href="index.html">Home</a>
            <a href="balagokulam.html">Balagokulam</a>
            <a href="surya_namaskar.html">Surya Namaskar</a>
            <a href="sewa.html">Sewa</a>
            <a href="report.html">Report</a>
        </nav>
    </header>
`;

// Define the Footer Content
const footerContent = `
    <footer>
        <div class="footer-info">
            <p>Contact us: <a href="tel:+19803692983,1">+1 (980) 369-2983 ext:1</a>
            Follow us: <a href="https://www.facebook.com/cltomkar/" target="_blank">Facebook</a>
            &copy; 2025 Omkar Shakha All rights reserved.</p>
        </div>
    </footer>
`;

// Insert into the page
document.getElementById('header-placeholder').innerHTML = headerContent;
document.getElementById('footer-placeholder').innerHTML = footerContent;

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

        // Safety Check: If Google returns HTML instead of CSV (due to sharing permissions)
        if (csvData.includes('<!DOCTYPE html>')) {
            console.error("Access Denied: Check Google Sheet sharing settings.");
            return;
        }

        // --- THE FIX FOR COMMAS ---
        // This splits the CSV by lines, then splits each line by commas NOT inside quotes
        const rows = csvData.split(/\r?\n/).map(row => {
            // Regex: match commas only if they are not followed by an odd number of quotes
            return row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        });

        const tableBody = document.getElementById('table-body');

        // Clear existing content
        tableBody.innerHTML = '';
// We skip i=0 (the CSV header)
        for (let i = 1; i < rows.length; i++) {
            if (rows[i].length < 5) continue; 

            // Extract values (using 0-based indexing)
            const col1 = rows[i][0].replace(/^"|"$/g, '').trim(); // Primary text
            const col5 = rows[i][4].replace(/^"|"$/g, '').trim(); // WhatsApp Header text
            
            const tr = document.createElement('tr');
            const td = document.createElement('td');

            // Construct the WhatsApp Message Structure
            td.innerHTML = `
                <div class="whatsapp-header">${col5}</div>
                <div class="message-bubble">
                    <span class="col-bold">${col1}</span>
                    ${renderRemainingColumns(rows[i])}
                </div>
            `;
            
            tr.appendChild(td);
            tableBody.appendChild(tr);
        }
    } catch (err) {
        console.error("Error:", err);
    }
}

// Helper to render other columns (2, 3, 4) inside the bubble
function renderRemainingColumns(rowArray) {
    let html = '';
    // Loop through indices 1, 2, 3 (Columns 2, 3, 4)
    for (let j = 1; j <= 3; j++) {
        if (rowArray[j]) {
            let text = rowArray[j].trim().replace(/^"|"$/g, '');
            html += `<div style="margin-top:5px;">${text}</div>`;
        }
    }
    return html;
}
loadSheetData();