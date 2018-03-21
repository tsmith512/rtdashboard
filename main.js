var xhr = new XMLHttpRequest();
xhr.open('GET', '/api-placeholder-response.json');
xhr.onload = () => {
  if (xhr.status === 200) {
    const response = JSON.parse(xhr.responseText);

    // New array to hold the filtered report:
    const report = [];

    // If this ain't quick and dirty, I don't know what is:
    for (const team in response) {
      if (! response.hasOwnProperty(team)) {
        continue;
      }

      for (const computer in response[team]) {
        if (! response[team].hasOwnProperty(computer)) {
          continue;
        }

        let teamName = team;
        let computerName = computer;
        let computerNetwork = response[team][computer];

        report.push({team: teamName, machine: computerName, network: computerNetwork});
      }
    }

    report.forEach((line) => {
      const table = document.getElementById("report");
      const row = table.insertRow(-1);

      // So we can style coffee shop "attendees"
      row.classList.add((line.network.indexOf("offee") > -1) ? "coffee" : "no-coffee");

      // To ensure the right order, select props each instead of iterating
      ['team', 'machine', 'network'].forEach((prop, index) => {
        const cell = row.insertCell(index);

        // Append a text node to the cell
        const value = document.createTextNode(line[prop]);
        cell.appendChild(value);
      });
    });
  } else {
    alert('API did not provide a response: HTTP' . xhr.status);
  }
};
xhr.send();

// @TODO: We should just resubmit the AJAX request but this will do for the prototype
const refresher = window.setTimeout(function() { window.location.reload(true); }, (60 * 1000));
