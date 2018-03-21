var xhr = new XMLHttpRequest();
xhr.open('GET', '/api-placeholder-response.json');
xhr.onload = function () {
  if (xhr.status === 200) {
    var response = JSON.parse(xhr.responseText);
    document.getElementById('box').innerHTML = ["<pre>", JSON.stringify(response), "</pre>"].join();
  }
};
xhr.send();
