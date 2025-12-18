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


const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQfh8WhlDiSdrW5m0zyeh3ClHM8O6PUiwjpPGO-4BvGjhntZYDzcp6lLJ4cnpK5v4nbXuZkbE3mXXTY/pub?output=csv';

async function loadSheetData() {
    try {
        const response = await fetch(sheetUrl);
        const data = await response.text();
        
        // Split data into rows and cells
        const rows = data.split('\n').map(row => row.split(','));
        
        const headerRow = document.getElementById('table-header');
        const tableBody = document.getElementById('table-body');

        // 1. Clear existing content
        headerRow.innerHTML = '';
        tableBody.innerHTML = '';

        // 2. Create Headers (from the first row of the sheet)
        rows[0].forEach(columnText => {
            const th = document.createElement('th');
            th.textContent = columnText;
            headerRow.appendChild(th);
        });

        // 3. Create Data Rows
        for (let i = 1; i < rows.length; i++) {
            if (rows[i].length < 2) continue; // Skip empty rows
            
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
    } catch (error) {
        console.error('Error fetching sheet data:', error);
    }
}

// Initialize the function
loadSheetData();