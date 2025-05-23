const apiBase = "http://localhost:8080";

document.addEventListener("DOMContentLoaded", cargarCitas);

async function cargarCitas() {
    try {
        const response = await fetch(`${apiBase}/Citas`);
        if (!response.ok) throw new Error("Error al obtener los Citas");

        const Citas = await response.json();

        ["Citaselect", "citacita"].forEach(id => {
            const select = document.getElementById(id);
            select.innerHTML = "<option value=''>Seleccione una cita</option>";
            Citas.forEach(Citaidcita => {
                const option = document.createElement("option");
                option.value = Citaidcita.id;
                option.textContent = Citaidcita.nombre;
                select.appendChild(option);
            });
        });
    } catch (error) {
        mostrarNotificacion("Error al cargar los Citas", "error");
    }
}

async function consultarDisponibilidad() {
    const idcita = document.getElementById("Citaselect").value;
    const fecha = document.getElementById("fechaConsulta").value;
    const hora = document.getElementById("horaConsulta").value;

    if (!idcita || !fecha || !hora) {
        mostrarNotificacion("Por favor, complete todos los campos.", "warning");
        return;
    }

    try {
        const response = await fetch(`${apiBase}/citas`);
        if (!response.ok) throw new Error("Error al obtener citas");

        const citas = await response.json();
        const fechaIngresada = new Date(fecha).toISOString().split("T")[0];
        const agendada = citas.some(r =>
            r.idcita === idcita &&
            r.fecha.split("T")[0] === fechaIngresada &&
            r.horaInicio <= hora &&
            r.horaFin > hora
        );

        mostrarNotificacion(agendada ? "El cita está citado." : "La cita está disponible.", agendada ? "info" : "success");
    } catch (error) {
        mostrarNotificacion("No se pudo verificar la disponibilidad.", "error");
    }
}

async function citarcita() {
    const cita = {
        idcita: document.getElementById("citacita").value,
        fecha: document.getElementById("fechacita").value,
        horaInicio: document.getElementById("horaIniciocita").value,
        horaFin: document.getElementById("horaFincita").value,
        proposito: document.getElementById("propositocita").value,
        usuario: document.getElementById("usuariocita").value,
        estado: "Confirmada"
    };

    if (!cita.idcita || !cita.fecha || !cita.horaInicio || !cita.horaFin || !cita.proposito || !cita.usuario) {
        mostrarNotificacion("Por favor, complete todos los campos.", "warning");
        return;
    }

    try {
        const response = await fetch(`${apiBase}/citas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cita)
        });

        if (!response.ok) throw new Error("Error al crear la cita");
        mostrarNotificacion("cita creada con éxito!", "success");
    } catch (error) {
        mostrarNotificacion("No se pudo crear la cita.", "error");
    }
}

async function cancelarcita() {
    const id = document.getElementById("idcitaCancelar").value;

    if (!id) {
        mostrarNotificacion("Por favor, ingrese el ID de la cita.", "warning");
        return;
    }

    try {
        const response = await fetch(`${apiBase}/citas/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("Error al cancelar la cita");
        mostrarNotificacion("cita cancelada con éxito!", "success");
    } catch (error) {
        mostrarNotificacion("No se pudo cancelar la cita.", "error");
    }
}

function mostrarNotificacion(mensaje, tipo) {
    Swal.fire({
        text: mensaje,
        icon: tipo,
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000
    });
}