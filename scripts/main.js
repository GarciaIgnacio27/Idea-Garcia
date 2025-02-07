const DateTime = luxon.DateTime;
let citas = [];

const fetchCitas = async () => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users'); // API simulada con nombres reales
        if (!response.ok) {
            throw new Error('Error al obtener las citas');
        }
        const data = await response.json();
        return data.slice(0, 3).map(item => ({ nombre: `${item.name}`, fecha: new Date().toISOString().split('T')[0] }));
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
};

const saveCita = async (nombre, edad, fecha) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const errorMessage = document.getElementById('error-message');
            if (edad < 18) {
                errorMessage.style.display = 'block';
                reject("Debe ser mayor de edad para reservar una cita.");
            } else {
                errorMessage.style.display = 'none';
                resolve({ nombre, edad, fecha });
            }
        }, 1000);
    });
};

const updateCalendar = async () => {
    const citasList = document.getElementById('citas-list');
    citasList.innerHTML = "";
    citas = await fetchCitas(); // Obtener citas desde API
    
    citas.forEach((cita, index) => {
        const li = document.createElement('li');
        li.classList.add('cita-item');
        li.textContent = `${cita.nombre} - ${cita.fecha}`;
        
        // Botón para editar la cita
        const editBtn = document.createElement('button');
        editBtn.textContent = "Editar";
        editBtn.classList.add('btn', 'btn-warning', 'btn-sm', 'ms-2');
        editBtn.addEventListener('click', () => editCita(index));
        
        // Botón para cancelar la cita
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = "Cancelar";
        cancelBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'ms-2');
        cancelBtn.addEventListener('click', () => cancelCita(index));
        
        li.appendChild(editBtn);
        li.appendChild(cancelBtn);
        citasList.appendChild(li);
    });
};

const editCita = (index) => {
    const cita = citas[index];
    Swal.fire({
        title: "Editar Cita",
        html:
            `<input id='edit-nombre' class='swal2-input' value='${cita.nombre}'>`,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
        preConfirm: () => {
            const nuevoNombre = document.getElementById('edit-nombre').value;
            if (!nuevoNombre) {
                Swal.showValidationMessage("El campo no puede estar vacío");
                return false;
            }
            citas[index].nombre = nuevoNombre;
            updateCalendar();
        }
    });
};

const cancelCita = (index) => {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará la cita de forma permanente.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, cancelar cita",
        cancelButtonText: "No, mantener cita"
    }).then((result) => {
        if (result.isConfirmed) {
            citas.splice(index, 1);
            updateCalendar();
            Swal.fire("Cita cancelada", "La cita ha sido eliminada con éxito.", "success");
        }
    });
};

document.getElementById('submitBtn').addEventListener('click', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const edad = parseInt(document.getElementById('edad').value);
    const fecha = document.getElementById('fecha').value;

    if (!nombre || !edad || !fecha) {
        Swal.fire('Error', 'Por favor, complete todos los campos.', 'error');
        return;
    }
    
    try {
        const cita = await saveCita(nombre, edad, fecha);
        citas.push(cita);
        updateCalendar();
    } catch (error) {
        console.error('Error:', error);
    }
});

document.addEventListener("DOMContentLoaded", updateCalendar);

