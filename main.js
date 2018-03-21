var xhr = new XMLHttpRequest();
xhr.open('GET', '/api-placeholder-response.json');
xhr.onload = function () {
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

    console.log(report);
  } else {
    alert('API did not provide a response: HTTP' . xhr.status);
  }
};
xhr.send();
