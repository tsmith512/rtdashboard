const refresher = window.setTimeout(function() { rtdFetchReport(); }, (60 * 1000));
window.rtdRefreshing = false;
rtdFetchReport();

function rtdFetchReport() {
  // This endpoint takes a while to respond, if we're already waiting, don't
  // try again.
  if (window.rtdRefreshing) { return; }

  let path = 'http://127.0.0.1/all';

  // Visit #test to load the sample data
  if (window.location.hash.indexOf("test") > -1) {
    path = 'api-placeholder-response.json';
  }

  const xhr = new XMLHttpRequest();
  xhr.open('GET', path);
  xhr.addEventListener("load", rtdBuildReport);

  window.rtdRefreshing = true;
  console.log("updating: " + new Date().toLocaleString());

  xhr.send();
}

function rtdBuildReport() {
  const xhr = this;

  if (xhr.status === 200) {
    const response = JSON.parse(xhr.responseText);

    // New array to hold the filtered report:
    const report = [];

    // If this ain't quick and dirty, I don't know what is:
    for (let i = 0; i < response.length; i++) {

      // team = {"Key": "team-name", "Value": [{...machines...}]}
      let team = response[i];

      for (let j = 0; j < team.Value.length; j++) {

        // computer = {"Key": "computer-name", "Value": "network-name"}
        let computer = team.Value[j];

        let teamName = team.Key;
        let computerName = computer.Key;
        let computerNetwork = computer.Value;

        // @TODO: Currently, non-coffee-shop computers are displayed but greyed
        // out. If we wanted to filter them out completely, here would be the
        // right place to do that.

        report.push({team: teamName, machine: computerName, network: computerNetwork});
      }
    }

    // We may be "refreshing" the table, empty it first.
    document.getElementById("report").innerHTML = null;

    report.forEach((line) => {
      const table = document.getElementById("report");
      const row = table.insertRow(-1);


      // So we can style coffee shop "attendees" and also I don't know if the
      // SSIDs will be capitalized like the API sample or not
      row.classList.add((line.network.indexOf("offee") > -1) ? "coffee" : "no-coffee");

      // To ensure the right order, select props each instead of iterating
      ['team', 'machine', 'network'].forEach((prop, index) => {
        const cell = row.insertCell(index);

        // Append a text node to the cell
        const value = document.createTextNode(line[prop]);
        cell.appendChild(value);
      });
    });

    // Unset the flag so we know it's safe to update again.
    window.rtdRefreshing = false;
  } else {
    alert('API did not provide a response: HTTP' . xhr.status);
  }
}
