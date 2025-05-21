document.getElementById("dob").addEventListener("change", function () {
  const dob = new Date(this.value);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  document.getElementById("age").value = age;
});

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("dob").max = new Date().toISOString().split("T")[0];
  displayTable();
});

document.getElementById("confirmPassword").addEventListener("input", function () {
  const password = document.getElementById("password").value;
  this.setCustomValidity(password !== this.value ? "Passwords do not match" : "");
});

document.getElementById("password").addEventListener("input", function () {
  const confirm = document.getElementById("confirmPassword");
  confirm.setCustomValidity(this.value !== confirm.value ? "Passwords do not match" : "");
});

document.getElementById("email").addEventListener("input", function () {
  this.setCustomValidity(isValidEmail(this.value.trim()) ? "" : "Invalid email format");
});

function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;
  return regex.test(email);
}

const form = document.getElementById("applicationForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  form.classList.add("was-validated");

  const emailInput = document.getElementById("email");
  const email = emailInput.value.trim();

  if (!isValidEmail(email)) {
    emailInput.setCustomValidity("Invalid email format");
    emailInput.reportValidity();
    return;
  } else {
    emailInput.setCustomValidity("");
  }

  const position = document.querySelector('input[name="position"]:checked');
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    document.getElementById("confirmPassword").setCustomValidity("Passwords do not match");
    return;
  } else {
    document.getElementById("confirmPassword").setCustomValidity("");
  }

  const editIndex = form.getAttribute("data-edit-index");

  if (form.checkValidity() && position) {
    const userData = {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      dob: document.getElementById("dob").value,
      age: document.getElementById("age").value,
      gender: document.getElementById("gender").value,
      email: email,
      position: position.value,
      languages: ["java", "javascript", "python"]
        .filter(id => document.getElementById(id).checked)
        .map(id => document.getElementById(id).value),
    };

    const existingData = JSON.parse(localStorage.getItem("applicationData")) || [];

    if (editIndex !== null && editIndex !== "") {
      existingData[editIndex] = userData;
      form.removeAttribute("data-edit-index");
      alert("Entry updated!");
    } else {
      existingData.push(userData);
      alert("Form submitted and data saved!");
    }

    localStorage.setItem("applicationData", JSON.stringify(existingData));
    form.reset();
    document.getElementById("age").value = "";
    form.classList.remove("was-validated");
    displayTable();
  }
});

function displayTable() {
  const data = JSON.parse(localStorage.getItem("applicationData")) || [];
  if (data.length === 0) return;

  const container = document.getElementById("tableContainer");
  container.innerHTML = `
    <h4 class="text-center fst-italic fw-bolder text-shadow">Submitted Applications</h4>
    <div class="table-responsive">
      <table class="table table-borderless table-striped table-hover caption-top border border-5">
        <caption class="text-bg-success p-2 fs-5 fw-semibold">All Applications</caption>
        <thead class="table-success">
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>DOB</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Email</th>
            <th>Position</th>
            <th>Languages</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${data.map((entry, index) => `
            <tr>
              <td>${entry.firstName}</td>
              <td>${entry.lastName}</td>
              <td>${entry.dob}</td>
              <td>${entry.age}</td>
              <td>${entry.gender}</td>
              <td>${entry.email}</td>
              <td>${entry.position}</td>
              <td>${entry.languages.join(", ")}</td>
              <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editEntry(${index})">Update</button>
                <button class="btn btn-sm btn-danger" onclick="deleteEntry(${index})">Delete</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function deleteEntry(index) {
  const data = JSON.parse(localStorage.getItem("applicationData")) || [];
  if (confirm("Are you sure you want to delete this entry?")) {
    data.splice(index, 1);
    localStorage.setItem("applicationData", JSON.stringify(data));
    displayTable();
  }
}

function editEntry(index) {
  const data = JSON.parse(localStorage.getItem("applicationData")) || [];
  const entry = data[index];

  document.getElementById("firstName").value = entry.firstName;
  document.getElementById("lastName").value = entry.lastName;
  document.getElementById("dob").value = entry.dob;
  document.getElementById("dob").dispatchEvent(new Event("change"));
  document.getElementById("gender").value = entry.gender;
  document.getElementById("email").value = entry.email;

  document.querySelectorAll('input[name="position"]').forEach(r => r.checked = r.value === entry.position);
  ["java", "javascript", "python"].forEach(id => {
    document.getElementById(id).checked = entry.languages.includes(document.getElementById(id).value);
  });

  form.setAttribute("data-edit-index", index);
}