const table = document.getElementById("table-body");

async function loadDocents() {
    const docentsRequest = await fetch('/docent/all')

    const docents = await docentsRequest.json()

    docents.forEach((docent) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${docent.nome}</td>
                        <td>${docent.area}</td>
                        <td>${docent.email}</td>
                        <td>${docent.telefone}</td>
                        <td><button class="btn btn-danger" onclick="deleteDocent(${docent.id})">Excluir</button>`;
        table.appendChild(tr);
    })
    
}

async function deleteDocent(id) {
    const deleteDocentRequest = await fetch(`/docent/delete/${id}`, { method: 'POST' });

    if(!deleteDocentRequest.ok) {
        const error = await deleteDocentRequest.json();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
        })
        return;
    }

    Swal.fire({
        icon: 'success',
        title: 'Sucesso',
        text: 'Docente deletado com sucesso',
    }).then(() => {
        window.location.reload();
    })
}

loadDocents();