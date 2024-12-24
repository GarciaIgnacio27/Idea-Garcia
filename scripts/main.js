function mostrarNombre (nombre){
    alert("Hola " + nombre + " ¿Listo para tu cita?");
}

let nombre = prompt("Ingrese su nombre")
mostrarNombre(nombre)

const reservations = [];

document.getElementById('submitBtn').addEventListener('click', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    if (!name || !email || !date || !time) {
        alert('Por favor, completa todos los campos antes de reservar.');
        return;
    }

    const newReservation = { name, email, date, time };
    reservations.push(newReservation);
    alert(`Reserva confirmada para ${name} el ${date} a las ${time}.`);

    updateCalendar();
});

document.getElementById('calendarLink').addEventListener('click', function(e) {
    e.preventDefault();
    const calendar = document.getElementById('calendar');
    calendar.style.display = 'block';
    updateCalendar();
});

function updateCalendar() {
    const reservationList = document.getElementById('reservationList');
    reservationList.innerHTML = '';

    reservations.forEach(reservation => {
        const li = document.createElement('li');
        li.textContent = `${reservation.name} - ${reservation.date} a las ${reservation.time}`;
        reservationList.appendChild(li);
    });
}