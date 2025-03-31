const table = document.getElementById("table-body");

async function loadCoordenators() {
    const coordenatorsRequest = await fetch('/coordenator/all');

    const coordenators = await coordenatorsRequest.json();

    coordenators.forEach((coordenator) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${coordenator.nome}</td>
                        <td>${coordenator.email}</td>
                        <td>${coordenator.telefone}</td>`;
        table.appendChild(tr);
    });
}

loadCoordenators();