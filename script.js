// ************************ Drag and drop ***************** //
var dropArea = document.getElementById("drop-area");
var fileElem = document.getElementById("fileElem");
var gallery = document.getElementById("gallery");

// Prevent default drag behaviors
["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, preventDefaults, false);
  document.body.addEventListener(eventName, preventDefaults, false);
});

// Highlight drop area when item is dragged over it
["dragenter", "dragover"].forEach((eventName) => {
  dropArea.addEventListener(eventName, highlight, false);
});
["dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, unhighlight, false);
});

dropArea.addEventListener("DOMNodeInserted", function () {
  $(".uploadIcon").css("display", "none");
  if ($("#gallery").children().length > 1) {
    $("#gallery").children().first().remove();
  }
});

// Handle dropped files
dropArea.addEventListener("drop", handleDrop, false);

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function highlight(e) {
  dropArea.classList.add("highlight");
}

function unhighlight(e) {
  dropArea.classList.remove("active");
}

function handleDrop(e) {
  var dt = e.dataTransfer;
  var files = dt.files;
  handleFiles(files);
}

function handleFiles(files) {
  files = [...files];
  files.forEach(previewFile);
}

function previewFile(file) {
  var reader = new FileReader();
  reader.onloadend = function () {
    dropArea.style.height = "100%";
    let img = document.createElement("img");
    img.src = reader.result;
    gallery.appendChild(img);
    setDataForImage(file);
  };
  reader.readAsDataURL(file);
}

//********************paste********************//
var input = document.querySelector("#text");
window.addEventListener("paste", function (event) {
  console.log("paste");
  var items = (event.clipboardData || event.originalEvent.clipboardData).items;
  for (index in items) {
    var item = items[index];
    if (item.kind === "file") {
      var blob = item.getAsFile();
      var reader = new FileReader();
      reader.onload = function (event) {
        let img = document.createElement("img");
        img.src = event.target.result;
        document.getElementById("gallery").appendChild(img);
        setDataForImage(blob);
      };
      reader.readAsDataURL(blob);
    }
  }
});

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $("#image_upload_preview").attr("src", e.target.result);
      setDataForImage(e.target);
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function setDataForImage(file) {
  var nameImage = $("#nameImage");
  var sizeImage = $("#sizeImage");
  var typeImage = $("#typeImage");
  var timemodifiImage = $("#timemodifiImage");
  var datemodifiImage = $("#datemodifiImage");
  console.log("file", file);
  nameImage.text(file.name);
  sizeImage.text(file.size);
  typeImage.text(file.type);
  timemodifiImage.text(file.lastModified);
  datemodifiImage.text(file.lastModifiedDate);
}

var saveImageBtn = $("#save-image");
var containerImage = $("#container-image");

var count = 0;
saveImageBtn.click(function () {
  var image = $("#gallery").children().first();
  var getImage = image[0].getAttribute("src");
  //    $('#output').html(function(i, val) { return val*1+1 });

  if (getImage != null) {
    var containerBox = document.createElement("div");
    containerBox.style.width = "200px";
    containerBox.style.display = "inline-block";
    containerBox.style.padding = "5px";

    var img = document.createElement("img");
    img.src = getImage;
    img.style.width = "100%";

    containerBox.classList = "conteiner";
    containerBox.id = "item_" + count++;
    containerBox.style.position = "relative";

    var btnDelete = document.createElement("div");
    btnDelete.style.position = "absolute";
    btnDelete.style.width = "20px";
    btnDelete.style.height = "20px";
    btnDelete.style.borderRadius = "50%";
    btnDelete.style.top = "-10px";
    btnDelete.style.right = "-10px";
    btnDelete.style.background = "#f2f2f2";
    btnDelete.id = "itemDelete";
    btnDelete.style.zIndex = "999999";

    containerBox.append(btnDelete);
    containerBox.append(img);
    containerImage.append(containerBox);
  } else {
    console.log("нечего сохранять");
  }
});

var deleteImageBtn = $("#delete-image");
deleteImageBtn.click(function () {
  var image = $("#gallery").children().first().remove();
  $(".uploadIcon").css("display", "block");
  dropArea.style.height = "400px";
});

document
  .getElementById("container-image")
  .addEventListener("DOMNodeInserted", function () {
    $("#container-image")
      .children()
      .each(function (key, elem) {
        $("#" + elem.getAttribute("id")).click(function () {
          $("#gallery").children().first().remove();
          var file = dataURLtoFile($(this).find("img").attr("src"));
          previewFile(file);
        });
        var deleteBtn = $("#" + elem.getAttribute("id")).find("#itemDelete");
        deleteBtn.click(function () {
          $("#" + elem.getAttribute("id")).remove();
        });
      });
  });

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
