let editingRow = null;
let isEditMode = false;
let userCounter = 1;

// Update user count display
function updateUserCount() {
  const count = document.getElementById("userTableBody").children.length - 1;
  document.getElementById("userCount").textContent = Math.max(0, count);

  // Show/hide empty state
  const emptyState = document.getElementById("emptyState");
  if (count <= 0) {
    emptyState.style.display = "table-row";
  } else {
    emptyState.style.display = "none";
  }
}

// Form submission handler
document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value;
  const idNumber = document.getElementById("idNumber").value;
  const address = document.getElementById("address").value;
  const age = document.getElementById("age").value;
  const gender =
    document.querySelector('input[name="gender"]:checked')?.value || "";
  const maritalStatus = document.getElementById("maritalStatus").value;

  const [firstName, lastName] = fullName.trim().split(" ");

  if (isEditMode && editingRow) {
    updateUserRow(
      editingRow,
      firstName,
      lastName,
      idNumber,
      address,
      age,
      gender,
      maritalStatus
    );
    resetEditMode();
  } else {
    createNewUserRow(
      userCounter,
      firstName,
      lastName,
      idNumber,
      address,
      age,
      gender,
      maritalStatus
    );
    userCounter++;
  }

  updateUserCount();
  this.reset();
  closeModal();
});

// Create new user row
function createNewUserRow(
  userNo,
  firstName,
  lastName,
  idNumber,
  address,
  age,
  gender,
  maritalStatus
) {
  const table = document.getElementById("userTableBody");
  const newRow = document.createElement("tr");
  newRow.className = "hover:bg-gray-50 transition-colors duration-200";
  newRow.innerHTML = `
        <td class="px-6 py-4">${userNo}</td>
        <td class="px-6 py-4 text-gray-900 font-medium">${firstName || ""}</td>
        <td class="px-6 py-4 text-gray-900 font-medium">${lastName || ""}</td>
        <td class="px-6 py-4 text-gray-600 font-mono text-sm">${idNumber}</td>
        <td class="px-6 py-4 text-gray-600 max-w-xs truncate" title="${address}">${address}</td>
        <td class="px-6 py-4 text-gray-600">${age}</td>
        <td class="px-6 py-4">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              gender === "Male"
                ? "bg-blue-100 text-blue-800"
                : gender === "Female"
                ? "bg-pink-100 text-pink-800"
                : "bg-gray-100 text-gray-800"
            }">
                ${gender}
            </span>
        </td>
        <td class="px-6 py-4">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ${maritalStatus}
            </span>
        </td>
        <td class="px-6 py-4">
            <div class="flex gap-2 justify-center">
                <button class="edit-btn p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200" title="Edit User">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn p-2  hover:bg-gray-100 rounded-lg transition-all duration-200" title="Delete User">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
  table.appendChild(newRow);
}

// Update existing user row
function updateUserRow(
  row,
  firstName,
  lastName,
  idNumber,
  address,
  age,
  gender,
  maritalStatus
) {
  const cells = row.querySelectorAll("td");
  cells[1].textContent = firstName || "";
  cells[2].textContent = lastName || "";
  cells[3].textContent = idNumber;
  cells[4].textContent = address;
  cells[4].title = address;
  cells[5].textContent = age;

  // Update gender badge
  cells[6].innerHTML = `
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          gender === "Male"
            ? "bg-blue-100 text-blue-800"
            : gender === "Female"
            ? "bg-pink-100 text-pink-800"
            : "bg-gray-100 text-gray-800"
        }">
            ${gender}
        </span>
    `;

  // Update marital status badge
  cells[7].innerHTML = `
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            ${maritalStatus}
        </span>
    `;
}

// Edit user function
function editUser(row) {
  const cells = row.querySelectorAll("td");

  isEditMode = true;
  editingRow = row;

  const firstName = cells[1].textContent;
  const lastName = cells[2].textContent;
  const fullName = `${firstName} ${lastName}`.trim();

  document.getElementById("fullName").value = fullName;
  document.getElementById("idNumber").value = cells[3].textContent;
  document.getElementById("address").value = cells[4].textContent;
  document.getElementById("age").value = cells[5].textContent;

  const gender = cells[6].textContent.trim();
  const genderRadio = document.querySelector(
    `input[name="gender"][value="${gender}"]`
  );
  if (genderRadio) {
    genderRadio.checked = true;
    updateRadioButtons();
  }

  document.getElementById("maritalStatus").value = cells[7].textContent.trim();

  document.getElementById("modalTitle").textContent = "Edit User Information";
  document.getElementById("submitBtn").textContent = "Update User";
  document.querySelector(
    ".bg-gradient-to-r.from-blue-500.to-purple-500 i"
  ).className = "fas fa-user-edit text-white text-xl";

  openModal();
}

// Delete user function
function deleteUser(row) {
  if (
    confirm(
      "Are you sure you want to delete this user? This action cannot be undone."
    )
  ) {
    row.remove();
    updateUserCount();
  }
}

// Reset edit mode
function resetEditMode() {
  isEditMode = false;
  editingRow = null;
  document.getElementById("modalTitle").textContent = "Add New User";
  document.getElementById("submitBtn").textContent = "Add User";
  document.querySelector(
    ".bg-gradient-to-r.from-blue-500.to-purple-500 i"
  ).className = "fas fa-user-plus text-white text-xl";
}

// Modal functions
function openModal() {
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modalContent");
  modal.classList.remove("hidden");
  setTimeout(() => {
    modalContent.classList.remove("scale-95", "opacity-0");
    modalContent.classList.add("scale-100", "opacity-100");
  }, 10);
}

function closeModal() {
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modalContent");
  modalContent.classList.remove("scale-100", "opacity-100");
  modalContent.classList.add("scale-95", "opacity-0");
  setTimeout(() => {
    modal.classList.add("hidden");
    resetEditMode();
  }, 300);
}

// Custom radio button styling
function updateRadioButtons() {
  document.querySelectorAll('input[name="gender"]').forEach((radio) => {
    const customRadio = radio.nextElementSibling;
    const dot = customRadio.querySelector("div");

    if (radio.checked) {
      customRadio.classList.add("border-blue-500");
      dot.classList.remove("hidden");
    } else {
      customRadio.classList.remove("border-blue-500");
      dot.classList.add("hidden");
    }
  });
}

// Event delegation for edit and delete buttons
document
  .getElementById("userTableBody")
  .addEventListener("click", function (e) {
    const button = e.target.closest("button");
    if (!button) return;

    const row = button.closest("tr");

    if (button.classList.contains("edit-btn")) {
      editUser(row);
    } else if (button.classList.contains("delete-btn")) {
      deleteUser(row);
    }
  });

// Radio button change handler
document.addEventListener("change", function (e) {
  if (e.target.name === "gender") {
    updateRadioButtons();
  }
});

// Modal controls
document.getElementById("openModalBtn").addEventListener("click", () => {
  resetEditMode();
  document.querySelector("form").reset();
  updateRadioButtons();
  openModal();
});

document.getElementById("closeModalBtn").addEventListener("click", closeModal);

window.addEventListener("click", (e) => {
  if (e.target === document.getElementById("modal")) {
    closeModal();
  }
});

// Initialize
updateUserCount();
updateRadioButtons();
