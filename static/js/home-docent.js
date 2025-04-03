const table = document.getElementById("table-body");
const docentNameCard = document.getElementById("docent-card-name");
const classFilter = document.getElementById('class-filter');
const dayOfWeekFilter = document.getElementById('day-of-week-filter');
const exportButton = document.getElementById('export-button');

const schedules = [];
var filteredSchedules = [];

async function loadData() {

    const docentRequest = await fetch("/docent");
    const classRequest = await fetch("/class/all");

    const docent = await docentRequest.json();
    const classes = await classRequest.json();
    
    docentNameCard.textContent = `Docente: ${docent.nome}`;

    docent.horarios_docentes.forEach((horario) => {
        horario.docente = docent.nome;
        console.log(horario);
        
        schedules.push(horario);
        filteredSchedules.push(horario);
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

exportButton.addEventListener('click', async () => {

    const schedulesArray = filteredSchedules.map(schedule => {
        const horaInicio = schedule.hora_inicio.split('T')[1].split(':')[0] + ":" + schedule.hora_inicio.split('T')[1].split(':')[1];
        const horaFim = schedule.hora_fim.split('T')[1].split(':')[0] + ":" + schedule.hora_fim.split('T')[1].split(':')[1];
        return ({
            docente: schedule.docente,
            turma: schedule.turmas.nome,
            dia_semana: schedule.dia_semana,
            hora_inicio: horaInicio,
            hora_fim: horaFim
        })
    });

    const exportRequest = await fetch('/export/schedules', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(schedulesArray)
    });

    if(exportRequest.ok) {
        const blob = await exportRequest.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'horarios.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        const error = await exportRequest.json();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
        })
    }
})