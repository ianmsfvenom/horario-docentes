const addClassButton = document.getElementById("add-class-button");
const nameField = document.getElementById("class-name");
const courseField = document.getElementById("class-course");
const periodField = document.getElementById("class-period");
const table = document.getElementById("table-body");
var editId = null;

const editClassNameField = document.getElementById("edit-class-name");
const editClassCourseField = document.getElementById("edit-class-course");
const editClassPeriodField = document.getElementById("edit-class-period");

addClassButton.addEventListener("click", async () => {
    if(!nameField.value || !courseField.value || !periodField.value) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Preencha todos os campos',
        })
    }

    const addClassRequest = await fetch("/class/create", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ nome: nameField.value, curso: courseField.value, periodo: periodField.value })
    });

    if(!addClassRequest.ok) {
        const error = await addClassRequest.json();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
        })
        return;
    } else {
        Swal.fire({
            icon: 'success',
            title: 'Sucesso',
            text: 'Turma criada com sucesso',
        })

        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${nameField.value}</td>
                        <td>${courseField.value}</td>
                        <td>${periodField.value}</td>`;
        table.appendChild(tr);

        nameField.value = "";
        courseField.value = "";
        periodField.value = "";
    }
})

async function loadClasses() {
    const classesRequest = await fetch('/class/all');

    const classes = await classesRequest.json();

    classes.forEach((turma) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${turma.nome}</td>
                        <td>${turma.curso}</td>
                        <td>${turma.periodo}</td>
                        <td><button class="btn btn-danger" onclick="deleteClass(${turma.id})">Excluir</button>
                        <button id="edit-class-button-${turma.id}" class="btn btn-primary ms-2" onclick="editClass(${turma.id})">Editar</button></td>`;
        table.appendChild(tr);
    });
}

loadClasses();

async function  deleteClass(id) {
    const deleteClassRequest = await fetch(`/class/delete/${id}`, {
        method: "POST"
    });

    if(!deleteClassRequest.ok) {
        const error = await deleteClassRequest.json();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
        })
        return;
    } else {
        Swal.fire({
            icon: 'success',
            title: 'Sucesso',
            text: 'Turma deletada com sucesso',
        }).then(() => {
            window.location.reload();
        })
    }
}

async function editClass(id) {
    editId = id;

    const editClassButton = document.getElementById(`edit-class-button-${id}`);

    editClassNameField.value = editClassButton.parentElement.parentElement.children[0].textContent;
    editClassCourseField.value = editClassButton.parentElement.parentElement.children[1].textContent;
    editClassPeriodField.value = editClassButton.parentElement.parentElement.children[2].textContent;

    var modal = new bootstrap.Modal(document.getElementById('editClassModal'));
    modal.show();
}

const editClassButton = document.getElementById("edit-class-button");
editClassButton.addEventListener("click", async () => {
    
    if(!editClassNameField.value || !editClassCourseField.value || !editClassPeriodField.value) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Preencha todos os campos',
        })
    }

    const editClassRequest = await fetch(`/class/edit/${editId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ nome: editClassNameField.value, curso: editClassCourseField.value, periodo: editClassPeriodField.value })
    });

    if(!editClassRequest.ok) {
        const error = await editClassRequest.json();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
        })
        return;
    } else {
        Swal.fire({
            icon: 'success',
            title: 'Sucesso',
            text: 'Turma editada com sucesso',
        }).then(() => {
            window.location.reload();
        })
    }
})