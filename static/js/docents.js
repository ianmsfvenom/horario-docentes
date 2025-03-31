const table = document.getElementById("table-body");

async function loadDocents() {
    const docentsRequest = await fetch('/docent/all')

    const docents = await docentsRequest.json()

    docents.forEach((docent) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${docent.nome}</td>
                        <td>${docent.area}</td>
                        <td>${docent.email}</td>
                        <td>${docent.telefone}</td>`;
        table.appendChild(tr);
    })
    
}

loadDocents();