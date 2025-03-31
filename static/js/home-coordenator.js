const table = document.getElementById("table-body");

const classFilter = document.getElementById('class-filter');
const dayOfWeekFilter = document.getElementById('day-of-week-filter');
const docentFilter = document.getElementById('docent-filter');

const docentNameAddSelect = document.getElementById('docent-select');
const classAddSelect = document.getElementById('class-select');
const dayOfWeekAddSelect = document.getElementById('day-of-week-select');
const startTimeAddSelect = document.getElementById('start-time');
const endTimeAddSelect = document.getElementById('end-time');

var schedules;

async function loadData() {
    const schedulesRequest = await fetch('/schedule/all')
    const classesRequest = await fetch('/class/all')
    const docentsRequest = await fetch('/docent/all')

    schedules = await schedulesRequest.json()
    var classes = await classesRequest.json()
    var docents = await docentsRequest.json()

    schedules = schedules.map((schedule) => {
        if (schedule.dia_semana === "Ter_a") schedule.dia_semana = "Terça";
        return schedule;
    })

    schedules.forEach((schedule) => {

        const horaInicio = schedule.hora_inicio.split('T')[1].split(':')[0] + ":" + schedule.hora_inicio.split('T')[1].split(':')[1];
        const horaFim = schedule.hora_fim.split('T')[1].split(':')[0] + ":" + schedule.hora_fim.split('T')[1].split(':')[1];

        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${schedule.docentes.nome}</td>
                        <td>${schedule.turmas.nome}</td>
                        <td>${schedule.dia_semana}</td>
                        <td>${horaInicio}</td>
                        <td>${horaFim}</td>`;
        table.appendChild(tr);
    });

    classes.forEach((turma) => {
        const option = document.createElement("option");
        option.value = turma.id;
        option.textContent = turma.nome;
        classFilter.appendChild(option);

        const option2 = document.createElement("option");
        option2.value = turma.id;
        option2.textContent = turma.nome;
        classAddSelect.appendChild(option2);
    })

    docents.forEach((docente) => {
        const option = document.createElement("option");
        option.value = docente.id;
        option.textContent = docente.nome;
        docentFilter.appendChild(option);

        const option2 = document.createElement("option");
        option2.value = docente.id;
        option2.textContent = docente.nome;
        docentNameAddSelect.appendChild(option);
    })
}

loadData()

function filterSchedules() {
    const selectedClass = classFilter.value;
    const selectedDay = dayOfWeekFilter.value;
    const selectedDocent = docentFilter.value;
    
    filteredSchedules = schedules.filter((horario) => {
        const checkTurma = selectedClass == 'all' || horario.turma_id == selectedClass;
        const checkDay = selectedDay == 'all' || horario.dia_semana == selectedDay;
        const checkDocent = selectedDocent == 'all' || horario.docente_id == selectedDocent;
        
        return checkTurma && checkDay && checkDocent;
    });

    table.innerHTML = '';
    filteredSchedules.forEach((horario) => {
        const horaInicio = horario.hora_inicio.split('T')[1].split(':')[0] + ":" + horario.hora_inicio.split('T')[1].split(':')[1];
        const horaFim = horario.hora_fim.split('T')[1].split(':')[0] + ":" + horario.hora_fim.split('T')[1].split(':')[1];
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${horario.docentes.nome}</td>
                        <td>${horario.turmas.nome}</td>
                        <td>${horario.dia_semana}</td>
                        <td>${horaInicio}</td>
                        <td>${horaFim}</td>`;
        table.appendChild(tr);
    });
}

classFilter.addEventListener('change', filterSchedules);
dayOfWeekFilter.addEventListener('change', filterSchedules);
docentFilter.addEventListener('change', filterSchedules);

const addScheduleBtn = document.getElementById('submit-schedule-button');

addScheduleBtn.addEventListener('click', async () => {
    const docentId = docentNameAddSelect.value;
    const classId = classAddSelect.value;
    const dayOfWeek = dayOfWeekAddSelect.value;
    const startTime = startTimeAddSelect.value;
    const endTime = endTimeAddSelect.value;
    
    const schedulesRequest = await fetch('/schedule/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            docente_id: docentId,
            turma_id: classId,
            dia_semana: dayOfWeek,
            hora_inicio: startTime,
            hora_fim: endTime
        })
    });

    if(schedulesRequest.ok) {
        Swal.fire({
            icon: 'success',
            title: 'Sucesso',
            text: 'Horário adicionado com sucesso',
        }).then(() => {
            window.location.reload();
        })
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Erro ao adicionar horário',
        })
    }
});