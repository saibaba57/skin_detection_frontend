const uploadBox = document.getElementById("uploadBox");
const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const analyzeBtn = document.getElementById("analyzeBtn");
const loader = document.getElementById("loader");

uploadBox.addEventListener("click", () => imageInput.click());

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  preview.src = URL.createObjectURL(file);
  preview.style.display = "block";
  analyzeBtn.disabled = false;
});

analyzeBtn.addEventListener("click", async () => {
  loader.style.display = "block";

  const formData = new FormData();
  formData.append("image", imageInput.files[0]);

  const response = await fetch("http://127.0.0.1:5000/predict", {
    method: "POST",
    body: formData
  });

  const data = await response.json();

  loader.style.display = "none";
  document.getElementById("resultCard").style.display = "block";
  document.getElementById("result").innerText = data.prediction;
  document.getElementById("confidence").innerText = data.confidence + "%";
});

function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      document.getElementById("video").srcObject = stream;
    });
}
