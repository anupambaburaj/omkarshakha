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



// Replace with your actual Spreadsheet ID (the long string in your URL)
const SPREADSHEET_ID = '1TQ43EAPutGvl75KovXx0wOtN979JDfAj_KBMIxxNeLQ';

async function loadSheetData() {
    const table = document.getElementById('data-table');
    const gid = table.getAttribute('data-gid'); // Detects the GID from HTML
    
    // Construct the specific CSV URL for that tab
const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${gid}`;
    
    try {
        const response = await fetch(url);
        const csvText = await response.text();

        // PapaParse automatically handles commas inside quotes and removes the quotes for you
        const results = Papa.parse(csvText, {
            header: false, // Set to true if you want objects instead of arrays
            skipEmptyLines: true
        });

        const rows = results.data; // This is now a clean array of arrays
        
        // ... proceed with your table rendering logic using rows ...
    } catch (err) {
        console.error(err);
    }


        const headerRow = document.getElementById('table-header');
        const tableBody = document.getElementById('table-body');

        // Render Headers
        rows[0].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text.replace(/"/g, ""); // Removes extra quotes
            headerRow.appendChild(th);
        });

        // Render Rows
        for (let i = 1; i < rows.length; i++) {
            if (rows[i].length < 2) continue;
            const tr = document.createElement('tr');
            rows[i].forEach(cellText => {
			const td = document.createElement('td');
    
			// 1. Clean up the text (remove leading/trailing quotes often added by CSVs)
			let cleanText = cellText.trim().replace(/^"|"$/g, '');

			// 2. Check if the text contains an HTML link tag
			if (cleanText.toLowerCase().includes('<a href=')) {
				// Use innerHTML to render the code as a real clickable link
				td.innerHTML = cleanText;
			} else {
				// Use textContent for normal text to keep it simple and safe
				td.textContent = cleanText;
		}
    
    tr.appendChild(td);
});
            tableBody.appendChild(tr);
        }
}

loadSheetData();