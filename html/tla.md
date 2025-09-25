---
title: TLA
layout: default
---

  <style>
    /* --- Styles for Centering --- */
    /*
    body {
      font-family: sans-serif;
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f7f7f7;
    }
    */

    .container {
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      background-color: white;
    }
    
    /* --- NEW: Style for the entry count --- */
    #entry-count {
      margin-bottom: 15px;
      font-style: italic;
      color: #555;
    }

    /* --- Modified Existing Styles --- */
    #search-container { 
      margin-bottom: 15px; 
    }
    #search-input { 
      padding: 6px; 
      width: 250px; 
    }

    table { 
      border-collapse: collapse; 
    }

    th, td { 
      padding: 8px 12px; 
      border: 1px solid #ccc; 
      text-align: left; 
    }

    thead th { 
      background-color: #f2f2f2; 
      cursor: pointer; 
      position: relative; 
    }
    thead th:hover { 
      background-color: #e6e6e6; 
    }
    thead th::after { 
      content: ''; 
      position: absolute; 
      right: 8px; 
      top: 50%; 
      transform: translateY(-50%); 
      opacity: 0.5; 
    }
    thead th.sort-asc::after { content: ' ▲'; }
    thead th.sort-desc::after { content: ' ▼'; }
  </style>
  
  <div class="container">
    <h2>TLA - Three Letter Acronym List</h2>
    
    <div id="entry-count"></div>

    <div id="search-container">
      <label for="search-input">Search:</label>
      <input type="search" id="search-input" placeholder="Search all columns...">
    </div>
    
    <table id="my-table">
      <thead></thead>
      <tbody></tbody>
    </table>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
  
  <script>
    const dataUrl = 'https://ivarada.github.io/html/tla.txt';
    
    let tableData = [];
    let headers = [];
    let sortColumn = -1;
    let sortDirection = 'asc';
    let searchTerm = '';

    Papa.parse(dataUrl, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        tableData = results.data;
        if (tableData.length > 0) {
          headers = Object.keys(tableData[0]);
          const tlaIndex = headers.indexOf('TLA');
          if (tlaIndex !== -1) sortColumn = tlaIndex;
        }
        
        document.getElementById('search-input').addEventListener('input', handleSearch);
        renderTable(); 
      },
      error: function(err) {
        console.error("Error parsing data:", err);
        document.querySelector("tbody").innerHTML = `<tr><td colspan="100%">Error loading data.</td></tr>`;
      }
    });

    function renderTable() {
      let displayData = [...tableData];
      const countElement = document.getElementById('entry-count');

      if (searchTerm) {
        displayData = displayData.filter(row => {
          return Object.values(row).some(value => 
            String(value).toLowerCase().includes(searchTerm)
          );
        });
      }

      // --- NEW: Update the entry count text ---
      if (tableData.length === displayData.length) {
        countElement.textContent = `Total entries: ${tableData.length}`;
      } else {
        countElement.textContent = `Showing ${displayData.length} of ${tableData.length} entries`;
      }

      if (sortColumn !== -1) {
        const headerKey = headers[sortColumn];
        displayData.sort((a, b) => {
          const valA = a[headerKey] || '';
          const valB = b[headerKey] || '';
          if (valA < valB) return -1;
          if (valA > valB) return 1;
          return 0;
        });

        if (sortDirection === 'desc') {
          displayData.reverse();
        }
      }
      
      buildTable(displayData);
    }

    function buildTable(data) {
      const tableHead = document.querySelector("#my-table thead");
      const tableBody = document.querySelector("#my-table tbody");
      
      let headerHTML = "<tr>";
      headers.forEach((header, index) => {
        let className = '';
        if (index === sortColumn) {
          className = sortDirection === 'asc' ? 'sort-asc' : 'sort-desc';
        }
        headerHTML += `<th class="${className}" data-column-index="${index}">${header}</th>`;
      });
      headerHTML += "</tr>";
      tableHead.innerHTML = headerHTML;

      document.querySelectorAll("#my-table thead th").forEach(th => {
        th.addEventListener("click", handleHeaderClick);
      });
      
      let bodyHTML = "";
      for (const row of data) {
        bodyHTML += "<tr>";
        for (const header of headers) {
          bodyHTML += `<td>${row[header] || ""}</td>`;
        }
        bodyHTML += "</tr>";
      }
      tableBody.innerHTML = bodyHTML;
    }

    function handleSearch(event) {
      searchTerm = event.target.value.toLowerCase();
      renderTable();
    }

    function handleHeaderClick(event) {
      const clickedColumnIndex = parseInt(event.target.dataset.columnIndex);

      if (clickedColumnIndex === sortColumn) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        sortColumn = clickedColumnIndex;
        sortDirection = 'asc';
      }
      
      renderTable();
    }
  </script>
