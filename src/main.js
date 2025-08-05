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
<td class = "p-10">${firstName || ""}</td>
<td class = "p-10">${lastName || ""}</td>
<td class = "p-10">${idNumber}</td>
<td class = "p-10">${address}</td>
<td class = "p-10">${age}</td>
<td class = "p-10">${gender}</td>
<td class = "p-10">${maritalStatus}</td>
<td class = "p-10"><button onClick = "this.closest('tr').remove()"><i class="fa-solid fa-trash"></i></button></td>
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
