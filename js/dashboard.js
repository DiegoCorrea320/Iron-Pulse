document.addEventListener('DOMContentLoaded', () => {
  const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
  if (!usuarioActivo) {
    alert('Por favor inicia sesión primero.');
    window.location.href = 'login.html';
    return;
  }

  // Mostrar nombre del usuario
  document.getElementById('usuarioNombre').textContent = usuarioActivo.nombre;

  let rutinaSeleccionada = null;

  // Mostrar historial
  function mostrarHistorial() {
    const historial = JSON.parse(localStorage.getItem(`historial_${usuarioActivo.email}`)) || [];
    const historialDiv = document.getElementById('historialPesos');

    if (historial.length === 0) {
      historialDiv.innerHTML = '<p>No hay registros todavía.</p>';
      return;
    }

    let html = '<ul>';
    historial.forEach(entry => {
      html += `<li>${entry.fecha}: ${entry.rutina} - Peso: ${entry.peso} kg</li>`;
    });
    html += '</ul>';

    historialDiv.innerHTML = html;

    // Actualizar gráfico
    actualizarGrafico(historial);
  }

  // Guardar peso
  window.guardarPeso = function () {
    const pesoInput = document.getElementById('peso');
    const peso = parseFloat(pesoInput.value);

    if (!rutinaSeleccionada) {
      alert('Selecciona una rutina primero.');
      return;
    }
    if (isNaN(peso) || peso <= 0) {
      alert('Ingresa un peso válido.');
      return;
    }

    const historial = JSON.parse(localStorage.getItem(`historial_${usuarioActivo.email}`)) || [];

    const fecha = new Date().toLocaleDateString();

    // Verificar si ya hay registro para hoy y rutina
    const ultimoRegistro = historial.length > 0 ? historial[historial.length - 1] : null;

    let mensaje = '';

    if (ultimoRegistro && ultimoRegistro.rutina === rutinaSeleccionada) {
      if (peso > ultimoRegistro.peso) {
        mensaje = '¡Impresionante! Subiste el peso, ¡sigue así!';
      } else if (peso === ultimoRegistro.peso) {
        mensaje = 'Buen trabajo, pero la próxima vez ¡dale un poquito más de caña!';
      } else {
        mensaje = 'No te desanimes, hoy fue difícil, mañana será mejor.';
      }
    } else {
      mensaje = '¡Vamos! A darle con todo en esta rutina.';
    }

    historial.push({ fecha, rutina: rutinaSeleccionada, peso });

    localStorage.setItem(`historial_${usuarioActivo.email}`, JSON.stringify(historial));
    pesoInput.value = '';

    mostrarHistorial();
    mostrarMensaje(mensaje);
  };

  // Seleccionar rutina
  window.seleccionarRutina = function (rutina) {
    rutinaSeleccionada = rutina;
    alert(`Has seleccionado la rutina: ${rutina}`);
  };

  // Mostrar mensaje motivador con gracia
  function mostrarMensaje(texto) {
    const mensajeElem = document.getElementById('mensajeMotivador');
    const mensajesExtra = [
      "No seas vago o vaga, ¡anda a entrenar!",
      "¿Descansar? ¡Claro, pero después del gym!",
      "Si Iron Pulse está latiendo, no hay excusas.",
      "¡Ponte las pilas y a romperla hoy!",
      "El único peso que no se levanta es el que no intentas."
    ];
    const aleatorio = mensajesExtra[Math.floor(Math.random() * mensajesExtra.length)];
    mensajeElem.textContent = texto + " — " + aleatorio;
  }

  // Cerrar sesión
  window.cerrarSesion = function () {
    localStorage.removeItem('usuarioActivo');
    window.location.href = 'login.html';
  };

  // Gráfico con Chart.js
  let grafico = null;
  function actualizarGrafico(historial) {
    const ctx = document.getElementById('graficoProgreso').getContext('2d');

    // Ordenar historial por fecha
    historial.sort((a,b) => new Date(a.fecha) - new Date(b.fecha));

    // Filtrar por rutina seleccionada
    const filtrado = historial.filter(entry => entry.rutina === rutinaSeleccionada);

    if (grafico) {
      grafico.destroy();
    }

    grafico = new Chart(ctx, {
      type: 'line',
      data: {
        labels: filtrado.map(e => e.fecha),
        datasets: [{
          label: `Progreso de peso (${rutinaSeleccionada})`,
          data: filtrado.map(e => e.peso),
          borderColor: 'orange',
          backgroundColor: 'rgba(255, 140, 0, 0.2)',
          tension: 0.3,
          fill: true,
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: Math.max(...filtrado.map(e => e.peso), 10) + 5,
          }
        }
      }
    });
  }

  // Inicializar historial al cargar
  mostrarHistorial();
  mostrarMensaje('¡Vamos con todo hoy!');
});
