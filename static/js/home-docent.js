const table = document.getElementById("table-body");
const docentNameCard = document.getElementById("docent-card-name");
const classFilter = document.getElementById('class-filter');
const dayOfWeekFilter = document.getElementById('day-of-week-filter');
const schedules = [];
var filteredSchedules = [];

async function loadData() {

    const docentRequest = await fetch("/docent");
    const classRequest = await fetch("/class/all");

    const docent = await docentRequest.json();
    const classes = await classRequest.json();
    
    docentNameCard.textContent = `Docente: ${docent.nome}`;

    docent.horarios_docentes.forEach((horario) => {
        schedules.push(horario);
        const horaInicio = horario.hora_inicio.split('T')[1].split(':')[0] + ":" + horario.hora_inicio.split('T')[1].split(':')[1];
        const horaFim = horario.hora_fim.split('T')[1].split(':')[0] + ":" + horario.hora_inicio.split('T')[1].split(':')[1];
        
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${horario.turmas.nome}</td>
                        <td>${horario.dia_semana}</td>
                        <td>${horaInicio}</td>
                        <td>${horaFim}</td>`;
        table.appendChild(tr);
    });
    
    classes.forEach((turma) => {
        const option = document.createElement("option");
        option.value = turma.id;
        option.textContent = turma.nome;
        classFilter.appendChild(option);
    })
}

loadData();

function filterSchedules() {
    const selectedClass = classFilter.value;
    const selectedDay = dayOfWeekFilter.value;

    console.log(selectedClass, selectedDay);
    
    filteredSchedules = schedules.filter((horario) => {
        const checkTurma = selectedClass == 'all' || horario.turma_id == selectedClass;
        const checkDay = selectedDay == 'all' || horario.dia_semana == selectedDay;
        
        return checkTurma && checkDay;
    });

    table.innerHTML = '';
    filteredSchedules.forEach((horario) => {
        const horaInicio = horario.hora_inicio.split('T')[1].split(':')[0] + ":" + horario.hora_inicio.split('T')[1].split(':')[1];
        const horaFim = horario.hora_fim.split('T')[1].split(':')[0] + ":" + horario.hora_inicio.split('T')[1].split(':')[1];
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${horario.turmas.nome}</td>
                        <td>${horario.dia_semana}</td>
                        <td>${horaInicio}</td>
                        <td>${horaFim}</td>`;
        table.appendChild(tr);
    });
}

classFilter.addEventListener('change', filterSchedules)

dayOfWeekFilter.addEventListener('change', filterSchedules)