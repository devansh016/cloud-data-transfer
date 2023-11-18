function download_file() {
  location.href = `/download-file?shareid=${
    document.getElementById("shareid").value
  }&password=${document.getElementById("d_pass").value}`;
}

function login_user() {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    email: document.getElementById("l_email").value,
    password: document.getElementById("l_pass").value,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("/api/auth/signin", requestOptions)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      document.getElementById("alert_message_1").innerHTML = result.message;
      location.href = "/upload.html";
      return result;
    })
    .catch((error) => console.log("error", error));
}

function register_user() {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    name: document.getElementById("r_name").value,
    email: document.getElementById("r_email").value,
    password: document.getElementById("r_pass").value,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("/api/auth/signup", requestOptions)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      document.getElementById("alert_message_2").innerHTML = result.message;
      return result;
    })
    .catch((error) => console.log("error", error));
}

function upload_file() {
  var formdata = new FormData();
  formdata.append("inputFile", document.getElementById("file").files[0]);

  var requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow",
  };

  fetch("/api/file/upload/", requestOptions)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      getallfileslist();
      document.getElementById("alert_message_1").innerHTML = result.message;
    })
    .catch((error) => console.log("error", error));
}

function share_file() {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    fileid: document.getElementById("files").value,
    email: document.getElementById("file_email").value,
    password: document.getElementById("file_pass").value,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("/api/file/share", requestOptions)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      document.getElementById("alert_message_2").innerHTML = result.message;
      return result;
    })
    .catch((error) => console.log("error", error));
}

function getallfileslist() {
  document.getElementById("files").innerHTML = "";

  var myHeaders = new Headers();
  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch("/api/file/", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      result = JSON.parse(result);
      for (var k in result.files) {
        var x = document.getElementById("files");
        var option = document.createElement("option");
        option.text = result.files[k].filename;
        option.value = result.files[k].fileid;
        x.add(option);
      }

      // console.log(result.files);
    })
    .catch((error) => console.log("error", error));
}
