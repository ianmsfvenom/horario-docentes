const table = document.getElementById("table-body");

async function loadCoordenators() {
    const coordenatorsRequest = await fetch('/coordenator/all');

    const coordenators = await coordenatorsRequest.json();

    coordenators.forEach((coordenator) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${coordenator.nome}</td>
                        <td>${coordenator.email}</td>
                        <td>${coordenator.telefone}</td>
                        <td><button class="btn btn-danger" onclick="deleteCoordenator(${coordenator.id})">Excluir</button>`;
        table.appendChild(tr);
    });
}
loadCoordenators();

async function deleteCoordenator(id) {
    const deleteRequest = await fetch(`/coordenator/delete/${id}`, {
        method: 'POST',
    });

    if (deleteRequest.ok) {
        Swal.fire({
            icon: 'success',
            title: 'Sucesso',
            text: 'Coordenador deletado com sucesso',
        })
        window.location.reload();
    } else {
        const error = await deleteRequest.json();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
        })
    }

}