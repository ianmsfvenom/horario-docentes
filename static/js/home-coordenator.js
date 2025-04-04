const table = document.getElementById("table-body");

const classFilter = document.getElementById('class-filter');
const dayOfWeekFilter = document.getElementById('day-of-week-filter');
const docentFilter = document.getElementById('docent-filter');

const docentNameAddSelect = document.getElementById('docent-select');
const classAddSelect = document.getElementById('class-select');
const dayOfWeekAddSelect = document.getElementById('day-of-week-select');
const startTimeAddSelect = document.getElementById('start-time');
const endTimeAddSelect = document.getElementById('end-time');

const docentNameEditSelect = document.getElementById('edit-docent-select');
const classEditSelect = document.getElementById('edit-class-select');
const dayOfWeekEditSelect = document.getElementById('edit-day-of-week-select');
const startTimeEditSelect = document.getElementById('edit-start-time');
const endTimeEditSelect = document.getElementById('edit-end-time');

const exportButton = document.getElementById('export-button');

var schedules;
var editId;
var filteredSchedules = [];

async function loadData() {
    const schedulesRequest = await fetch('/schedule/all')
    const classesRequest = await fetch('/class/all')
    const docentsRequest = await fetch('/docent/all')

    schedules = await schedulesRequest.json()
    filteredSchedules = schedules
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
                        <td>${horaFim}</td>
                        <td><button id="edit-schedule-button-${schedule.id}" class="btn btn-primary" onclick="editSchedule(${schedule.id})">Editar</button>
                        <button class="btn btn-danger" onclick="deleteSchedule(${schedule.id})">Excluir</button></td>`;
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

        const option3 = document.createElement("option");
        option3.value = turma.id;
        option3.textContent = turma.nome;
        classEditSelect.appendChild(option3);
    })

    docents.forEach((docente) => {
        const option = document.createElement("option");
        option.value = docente.id;
        option.textContent = docente.nome;
        docentFilter.appendChild(option);

        const option2 = document.createElement("option");
        option2.value = docente.id;
        option2.textContent = docente.nome;
        docentNameAddSelect.appendChild(option2);

        const option3 = document.createElement("option");
        option3.value = docente.id;
        option3.textContent = docente.nome;
        docentNameEditSelect.appendChild(option3);
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
                        <td>${horaFim}</td>
                        <td><button id="edit-schedule-button-${horario.id}" class="btn btn-primary" onclick="editSchedule(${horario.id})">Editar</button>
                        <button class="btn btn-danger" onclick="deleteSchedule(${horario.id})">Excluir</button></td>`;
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

    if(!docentId || !classId || !dayOfWeek || !startTime || !endTime) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Preencha todos os campos',
        })
        return;
    }
    
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

async function deleteSchedule(id) {
    const deleteScheduleRequest = await fetch(`/schedule/delete/${id}`, {
        method: "POST"
    });

    if(!deleteScheduleRequest.ok) {
        const error = await deleteScheduleRequest.json();
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
            text: 'Horário deletado com sucesso',
        }).then(() => {
            window.location.reload();
        })
    }
}

async function editSchedule(id) {
    editId = id;

    const scheduleRequest = await fetch(`/schedule/${id}`, {
        method: "GET"
    });

    if(!scheduleRequest.ok) {
        const error = await scheduleRequest.json();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
        })
        return;
    }
    
    const schedule = await scheduleRequest.json();

    docentNameEditSelect.value = schedule.docente_id;
    classEditSelect.value = schedule.turma_id;
    dayOfWeekEditSelect.value = schedule.dia_semana;
    startTimeEditSelect.value = schedule.hora_inicio.split('T')[1].split(':')[0] + ":" + schedule.hora_inicio.split('T')[1].split(':')[1];
    endTimeEditSelect.value = schedule.hora_fim.split('T')[1].split(':')[0] + ":" + schedule.hora_fim.split('T')[1].split(':')[1];

    const bootstrapModal = new bootstrap.Modal(document.getElementById('editScheduleModal'));
    bootstrapModal.show();
}

const editSubmitBtn = document.getElementById('submit-edit-schedule-button');
editSubmitBtn.addEventListener('click', async () => {
    const docentId = docentNameEditSelect.value;
    const classId = classEditSelect.value;
    const dayOfWeek = dayOfWeekEditSelect.value;
    const startTime = startTimeEditSelect.value;
    const endTime = endTimeEditSelect.value;

    if(!docentId || !classId || !dayOfWeek || !startTime || !endTime) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Preencha todos os campos',
        })
        return;
    }

    const editScheduleRequest = await fetch(`/schedule/update/${editId}`, {
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

    if(editScheduleRequest.ok) {
        Swal.fire({
            icon: 'success',
            title: 'Sucesso',
            text: 'Horário editado com sucesso',
        }).then(() => {
            window.location.reload();
        })
    } else {
        const error = await editScheduleRequest.json();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
        })
    }
});

exportButton.addEventListener('click', async () => {

    const schedulesArray = filteredSchedules.map(schedule => {
        const horaInicio = schedule.hora_inicio.split('T')[1].split(':')[0] + ":" + schedule.hora_inicio.split('T')[1].split(':')[1];
        const horaFim = schedule.hora_fim.split('T')[1].split(':')[0] + ":" + schedule.hora_fim.split('T')[1].split(':')[1];
        return ({
            docente: schedule.docentes.nome,
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