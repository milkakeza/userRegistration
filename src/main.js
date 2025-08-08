let editingRow = null;
let isEditMode = false;
let editingUserId = null;

// API Configuration
const API_BASE_URL = "http://localhost:8080/api/users";

// API Helper Functions
async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    alert("Error: " + error.message);
    throw error;
  }
}

// API Functions
async function createUser(userData) {
  return await apiRequest(API_BASE_URL, {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

async function getAllUsers() {
  return await apiRequest(API_BASE_URL);
}

async function getUserById(id) {
  return await apiRequest(`${API_BASE_URL}/${id}`);
}

async function updateUser(id, userData) {
  return await apiRequest(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
}

async function deleteUserById(id) {
  return await apiRequest(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });
}

// Helper function to map form data to API format
function mapFormDataToAPI(
  firstName,
  lastName,
  idNumber,
  address,
  age,
  gender,
  maritalStatus
) {
  return {
    name: `${firstName} ${lastName}`.trim(),
    address: address,
    age: age ? parseInt(age) : null,
    nationalId: idNumber,
    status: "ACTIVE",
    gender: gender.toUpperCase(),
  };
}

// Helper function to split full name
function splitFullName(fullName) {
  const parts = fullName.trim().split(" ");
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "";
  return [firstName, lastName];
}

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

// Load all users from API
async function loadUsers() {
  try {
    const response = await getAllUsers();
    const users = response.data || [];

    // Clear existing table rows (except empty state)
    const tableBody = document.getElementById("userTableBody");
    const rows = tableBody.querySelectorAll("tr:not(#emptyState)");
    rows.forEach((row) => row.remove());

    // Add users to table
    users.forEach((user, index) => {
      const [firstName, lastName] = splitFullName(user.name || "");
      createUserRowFromAPI(
        user.id,
        index + 1,
        firstName,
        lastName,
        user.nationalId,
        user.address,
        user.age,
        user.gender,
        "Active" // Default marital status since API doesn't have this field
      );
    });

    updateUserCount();
  } catch (error) {
    console.error("Failed to load users:", error);
  }
}

// Form submission handler
document.querySelector("form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value;
  const idNumber = document.getElementById("idNumber").value;
  const address = document.getElementById("address").value;
  const age = document.getElementById("age").value;
  const gender =
    document.querySelector('input[name="gender"]:checked')?.value || "";
  const maritalStatus = document.getElementById("maritalStatus").value;

  const [firstName, lastName] = splitFullName(fullName);
  const apiData = mapFormDataToAPI(
    firstName,
    lastName,
    idNumber,
    address,
    age,
    gender,
    maritalStatus
  );

  try {
    if (isEditMode && editingRow && editingUserId) {
      // Update existing user
      const response = await updateUser(editingUserId, apiData);
      if (response.status === "success") {
        updateUserRowFromAPI(
          editingRow,
          response.data.id,
          firstName,
          lastName,
          response.data.nationalId,
          response.data.address,
          response.data.age,
          response.data.gender,
          maritalStatus
        );
        alert("User updated successfully!");
      }
      resetEditMode();
    } else {
      // Create new user
      const response = await createUser(apiData);
      if (response.status === "success") {
        const userNo = document.getElementById("userTableBody").children.length;
        createUserRowFromAPI(
          response.data.id,
          userNo,
          firstName,
          lastName,
          response.data.nationalId,
          response.data.address,
          response.data.age,
          response.data.gender,
          maritalStatus
        );
        alert("User created successfully!");
      }
    }

    updateUserCount();
    this.reset();
    closeModal();
  } catch (error) {
    console.error("Failed to save user:", error);
  }
});

// Create new user row from API data
function createUserRowFromAPI(
  userId,
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
  newRow.dataset.userId = userId; // Store user ID for API operations

  const displayGender = gender
    ? gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase()
    : "";
  const displayAge = age !== null && age !== undefined ? age : "";

  newRow.innerHTML = `
    <td class="px-6 py-4">${userNo}</td>
    <td class="px-6 py-4 text-gray-900 font-medium">${firstName || ""}</td>
    <td class="px-6 py-4 text-gray-900 font-medium">${lastName || ""}</td>
    <td class="px-6 py-4 text-gray-600 font-mono text-sm">${idNumber}</td>
    <td class="px-6 py-4 text-gray-600 max-w-xs truncate" title="${address}">${address}</td>
    <td class="px-6 py-4 text-gray-600">${displayAge}</td>
    <td class="px-6 py-4">
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        displayGender === "Male"
          ? "bg-blue-100 text-blue-800"
          : displayGender === "Female"
          ? "bg-pink-100 text-pink-800"
          : "bg-gray-100 text-gray-800"
      }">
        ${displayGender}
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
        <button class="delete-btn p-2 hover:bg-gray-100 rounded-lg transition-all duration-200" title="Delete User">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </td>
  `;

  table.appendChild(newRow);
}

// Update existing user row from API data
function updateUserRowFromAPI(
  row,
  userId,
  firstName,
  lastName,
  idNumber,
  address,
  age,
  gender,
  maritalStatus
) {
  const cells = row.querySelectorAll("td");
  row.dataset.userId = userId;

  const displayGender = gender
    ? gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase()
    : "";
  const displayAge = age !== null && age !== undefined ? age : "";

  cells[1].textContent = firstName || "";
  cells[2].textContent = lastName || "";
  cells[3].textContent = idNumber;
  cells[4].textContent = address;
  cells[4].title = address;
  cells[5].textContent = displayAge;

  // Update gender badge
  cells[6].innerHTML = `
    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      displayGender === "Male"
        ? "bg-blue-100 text-blue-800"
        : displayGender === "Female"
        ? "bg-pink-100 text-pink-800"
        : "bg-gray-100 text-gray-800"
    }">
      ${displayGender}
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
  const userId = row.dataset.userId;

  isEditMode = true;
  editingRow = row;
  editingUserId = userId;

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
async function deleteUser(row) {
  const userId = row.dataset.userId;

  if (
    confirm(
      "Are you sure you want to delete this user? This action cannot be undone."
    )
  ) {
    try {
      const response = await deleteUserById(userId);
      if (response.status === "success") {
        row.remove();
        updateUserCount();
        alert("User deleted successfully!");
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  }
}

// Reset edit mode
function resetEditMode() {
  isEditMode = false;
  editingRow = null;
  editingUserId = null;
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

// Initialize - Load users from API on page load
document.addEventListener("DOMContentLoaded", () => {
  updateRadioButtons();
  loadUsers();
});

// Also initialize immediately in case DOMContentLoaded already fired
updateRadioButtons();
loadUsers();
