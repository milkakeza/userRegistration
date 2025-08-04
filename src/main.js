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

  const table = document.getElementById("userTableBody");
  const newRow = document.createElement("tr");

  newRow.innerHTML = `
<td>${firstName || ""}</td>
<td>${lastName || ""}</td>
<td>${idNumber}</td>
<td>${address}</td>
<td>${age}</td>
<td>${gender}</td>
<td>${maritalStatus}</td>
<td><button onClick = "this.closest('tr').remove()"><i class="fa-solid fa-trash"></i></button></td>
`;

  table.appendChild(newRow);

  this.reset();
  document.getElementById("modal").classList.add("hidden");
});

const openModal = document.getElementById("openModalBtn");
const closeModal = document.getElementById("closeModalBtn");
const modal = document.getElementById("modal");

openModal.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});
