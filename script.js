document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('student-form');
  const firstNameInput = document.getElementById('firstName');
  const lastNameInput = document.getElementById('lastName');
  const ageInput = document.getElementById('age');
  const studentList = document.getElementById('student-list');
  let selectedRow = null;

  // Function to add a new student
  function addStudent() {
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const age = ageInput.value.trim();

    if (!firstName || !lastName || !age) {
      showAlert('Please fill in all fields', 'danger');
      return;
    }

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${firstName}</td>
      <td>${lastName}</td>
      <td>${age}</td>
      <td>
        <a href="#" class="btn btn-warning btn-sm edit">Edit</a>
        <a href="#" class="btn btn-danger btn-sm delete">Delete</a>
      </td>
    `;
    studentList.appendChild(newRow);
    saveToLocalStorage(firstName, lastName, age);
    showAlert('Student added successfully', 'success');
    clearFields();
  }

  // Function to edit a student
  function editStudent(row) {
    selectedRow = row;
    firstNameInput.value = selectedRow.cells[0].innerText;
    lastNameInput.value = selectedRow.cells[1].innerText;
    ageInput.value = selectedRow.cells[2].innerText;
  }

  // Function to delete a student
  function deleteStudent(row) {
    row.remove();
    removeStudentFromLocalStorage(row.cells[0].innerText, row.cells[1].innerText, row.cells[2].innerText);
    showAlert('Student deleted successfully', 'success');
    clearFields();
  }

  // Event listener for form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (selectedRow === null) {
      addStudent();
    } else {
      selectedRow.cells[0].innerText = firstNameInput.value.trim();
      selectedRow.cells[1].innerText = lastNameInput.value.trim();
      selectedRow.cells[2].innerText = ageInput.value.trim();
      updateLocalStorage();
      showAlert('Student updated successfully', 'success');
      clearFields();
      selectedRow = null;
    }
  });

  // Event listener for edit and delete buttons
  studentList.addEventListener('click', function(e) {
    if (e.target.classList.contains('edit')) {
      editStudent(e.target.parentElement.parentElement);
    } else if (e.target.classList.contains('delete')) {
      deleteStudent(e.target.parentElement.parentElement);
    }
  });

  // Function to show alerts
  function showAlert(message, className) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${className} mt-3`;
    alertDiv.appendChild(document.createTextNode(message));
    form.appendChild(alertDiv); // Memasukkan notifikasi ke dalam form

    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  }

  // Function to clear input fields
  function clearFields() {
    firstNameInput.value = '';
    lastNameInput.value = '';
    ageInput.value = '';
  }

  // Function to save student data to Local Storage
  function saveToLocalStorage(firstName, lastName, age) {
    let students = JSON.parse(localStorage.getItem('students')) || [];
    students.push({ firstName, lastName, age });
    localStorage.setItem('students', JSON.stringify(students));
  }

  // Function to remove student data from Local Storage
  function removeStudentFromLocalStorage(firstName, lastName, age) {
    let students = JSON.parse(localStorage.getItem('students')) || [];
    students = students.filter(student => !(student.firstName === firstName && student.lastName === lastName && student.age === age));
    localStorage.setItem('students', JSON.stringify(students));
  }

  // Function to update Local Storage after editing a student
  function updateLocalStorage() {
    let students = [];
    const rows = studentList.getElementsByTagName('tr');
    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName('td');
      const firstName = cells[0].innerText;
      const lastName = cells[1].innerText;
      const age = cells[2].innerText;
      students.push({ firstName, lastName, age });
    }
    localStorage.setItem('students', JSON.stringify(students));
  }

  // Function to load students from Local Storage when the page loads
  function loadStudentsFromLocalStorage() {
    let students = JSON.parse(localStorage.getItem('students')) || [];
    students.forEach(student => {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td>${student.firstName}</td>
        <td>${student.lastName}</td>
        <td>${student.age}</td>
        <td>
          <a href="#" class="btn btn-warning btn-sm edit">Edit</a>
          <a href="#" class="btn btn-danger btn-sm delete">Delete</a>
        </td>
      `;
      studentList.appendChild(newRow);
    });
  }

  // Load students from Local Storage when the page loads
  loadStudentsFromLocalStorage();
});
