const table = document.getElementById("table-body");

async function loadClasses() {
    const classesRequest = await fetch('/class/all');

    const classes = await classesRequest.json();

    classes.forEach((turma) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${turma.nome}</td>
                        <td>${turma.curso}</td>
                        <td>${turma.periodo}</td>`;
        table.appendChild(tr);
    });
}

loadClasses();