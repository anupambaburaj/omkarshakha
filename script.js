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
            Follow us: <a href="https://www.facebook.com/cltomkar/" target="_blank">Facebook</a> <BR>
            &copy; 2025 Omkar Shakha All rights reserved.</p>
        </div>
    </footer>
`;

// Insert into the page
document.getElementById('header-placeholder').innerHTML = headerContent;
document.getElementById('footer-placeholder').innerHTML = footerContent;

// Color Palette for Senders
const colorMap = {};
const palette = ['#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#009688', '#4caf50', '#ff9800'];

function getPersistentColor(name) {
    if (!colorMap[name]) {
        // Assign next available color from palette
        const index = Object.keys(colorMap).length % palette.length;
        colorMap[name] = palette[index];
    }
    return colorMap[name];
}

// Google Sheets Config
const SPREADSHEET_ID = '1TQ43EAPutGvl75KovXx0wOtN979JDfAj_KBMIxxNeLQ';

// Helper to render columns 2, 3, and 4 inside the bubble
function renderRemainingColumns(rowArray) {
    let html = '';
    // Loop through indices 1, 2, and 3
    for (let j = 1; j <= 3; j++) {
        if (rowArray[j]) {
            let text = rowArray[j].trim().replace(/^"|"$/g, '');
            
            // If the text looks like an HTML link, render as HTML, else as text
            if (text.toLowerCase().includes('<a href=')) {
                html += `<div class="col-data">${text}</div>`;
            } else if (text !== "") {
                 // Check if this is Column 4 (index 3)
                if (j === 3) {
                    html += `<div class="col-when"><strong>When:</strong> ${text}</div>`;
                } else {
                    // Standard display for Columns 2 and 3
                    html += `<div class="col-data">${text}</div>`;
                }
            }
        }
    }
    return html;
}

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

        //const headerRow = document.getElementById('table-header');
        const tableBody = document.getElementById('table-body');

        // Clear existing content
        //headerRow.innerHTML = '';
        tableBody.innerHTML = '';

        // Render Headers (First Row)
		/*
        if (rows.length > 0) {
            rows[0].forEach(text => {
                const th = document.createElement('th');
                th.textContent = text.replace(/^"|"$/g, "").trim(); 
                headerRow.appendChild(th);
            });
        }*/

        // Inside your loadSheetData loop:
		for (let i = 1; i < rows.length; i++) {
			if (rows[i].length < 5) continue; 

			const col1 = rows[i][0].replace(/^"|"$/g, '').trim(); // Primary text
			const col5 = rows[i][4].replace(/^"|"$/g, '').trim(); // Sender Name
			
			const tr = document.createElement('tr');
			const td = document.createElement('td');

			const senderColor = getPersistentColor(col5);

			// Build the WhatsApp bubble structure
			td.innerHTML = `
				<span class="whatsapp-header" style="color: ${senderColor};">
					${col5}
				</span>
				<div class="message-bubble">
					<span class="col-bold">${col1}</span>
					<div class="message-content">${renderRemainingColumns(rows[i])}</div>
				</div>
			`;
			
			tr.appendChild(td);
			tableBody.appendChild(tr);
		}
    } catch (err) {
        console.error("Error loading data:", err);
    }
}



loadSheetData();