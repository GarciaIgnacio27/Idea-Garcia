function mostrarNombre (nombre){
    alert("Hola " + nombre + " ¿Listo para tu cita?");
}

let nombre = prompt("Ingrese su nombre")
mostrarNombre(nombre)

const reservations = JSON.parse(localStorage.getItem('reservations')) || []; // Recuperar reservas desde el almacenamiento local

        // Evento para agregar una nueva reserva
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
            reservations.push(newReservation); // Agregar la nueva reserva al array
            localStorage.setItem('reservations', JSON.stringify(reservations)); // Guardar reservas en almacenamiento local

            alert(`Reserva confirmada para ${name} el ${date} a las ${time}.`);
            updateCalendar(); // Actualizar el calendario dinámico

            // Limpiar los campos del formulario
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('date').value = '';
            document.getElementById('time').value = '';
        });

        // Evento para mostrar el calendario al hacer clic en el enlace
        document.getElementById('calendarLink').addEventListener('click', function(e) {
            e.preventDefault();
            const calendar = document.getElementById('calendar');
            calendar.style.display = 'block';
            updateCalendar(); // Mostrar reservas dinámicamente
        });

        // Función para actualizar el calendario con las reservas
        function updateCalendar(filteredReservations = null) {
            const reservationList = document.getElementById('reservationList');
            reservationList.innerHTML = ''; // Limpiar la lista antes de actualizar

            (filteredReservations || reservations).forEach((reservation, index) => {
                const li = document.createElement('li');
                li.textContent = `${reservation.name} - ${reservation.date} a las ${reservation.time}`;

                // Botón para modificar la reserva
                const modifyBtn = document.createElement('button');
                modifyBtn.textContent = 'Modificar';
                modifyBtn.addEventListener('click', function() {
                    const newDate = prompt('Introduce la nueva fecha (YYYY-MM-DD):', reservation.date);
                    const newTime = prompt('Introduce la nueva hora (HH:MM):', reservation.time);

                    if (newDate && newTime) {
                        reservations[index].date = newDate;
                        reservations[index].time = newTime;
                        localStorage.setItem('reservations', JSON.stringify(reservations));
                        updateCalendar();
                        alert('Reserva modificada con éxito.');
                    } else {
                        alert('No se realizaron cambios.');
                    }
                });

                // Botón para eliminar la reserva
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Anular';
                deleteBtn.addEventListener('click', function() {
                    if (confirm('¿Estás seguro de que deseas anular esta reserva?')) {
                        reservations.splice(index, 1);
                        localStorage.setItem('reservations', JSON.stringify(reservations));
                        updateCalendar();
                        alert('Reserva anulada con éxito.');
                    }
                });

                li.appendChild(modifyBtn);
                li.appendChild(deleteBtn);
                reservationList.appendChild(li);
            });
        }

        // Evento para buscar y filtrar reservas
        document.getElementById('filterBtn').addEventListener('click', function() {
            const searchValue = document.getElementById('search').value.toLowerCase();

            const filteredReservations = reservations.filter(reservation =>
                reservation.name.toLowerCase().includes(searchValue)
            );

            if (filteredReservations.length === 0) {
                alert('No se encontraron reservas con ese nombre.');
            }

            updateCalendar(filteredReservations);
        });

        // Cargar reservas al iniciar
        document.addEventListener('DOMContentLoaded', function() {
            updateCalendar();
        });