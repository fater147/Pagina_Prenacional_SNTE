// Variables globales para el control de espectadores
let viewersInterval;
const viewersBase = {
  youtube: 1000,
  facebook: 1500,
  instagram: 800
};

async function cargarTransmisiones() {
  try {
    const response = await fetch('../data/transmisiones.json');
    const transmisiones = await response.json();
    const listContainer = document.getElementById('streamList');
    const mainPlayer = document.getElementById('mainPlayer');
    const streamTitle = document.getElementById('streamTitle');
    const streamPlatform = document.getElementById('streamPlatform');
    const streamViewers = document.getElementById('streamViewers');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const streamScroll = document.getElementById('streamScroll');

    // Función para generar números aleatorios de espectadores
    function generarEspectadores(plataforma, base) {
      const variacion = Math.floor(Math.random() * 300) - 150;
      return base + variacion;
    }

    // Función para actualizar todos los contadores
    function actualizarContadores() {
      document.querySelectorAll('.stream-card').forEach((card, index) => {
        const transmision = transmisiones[index];
        const nuevosEspectadores = generarEspectadores(
          transmision.plataforma, 
          viewersBase[transmision.plataforma]
        );
        
        const viewersElement = card.querySelector('.viewers-count');
        if (viewersElement) {
          viewersElement.textContent = nuevosEspectadores.toLocaleString();
        }
        
        // Si es la transmisión activa, actualizar también el reproductor principal
        if (card.classList.contains('active')) {
          streamViewers.innerHTML = `<i class="fas fa-eye"></i> ${nuevosEspectadores.toLocaleString()}`;
        }
      });
    }

    // Función para actualizar el reproductor principal
    function actualizarReproductor(transmision) {
      mainPlayer.src = transmision.url;
      streamTitle.textContent = transmision.titulo;
      streamPlatform.innerHTML = `<i class="fab fa-${transmision.plataforma}"></i> ${transmision.plataforma.charAt(0).toUpperCase() + transmision.plataforma.slice(1)}`;
      
      // Generar número inicial de espectadores
      const espectadoresIniciales = generarEspectadores(
        transmision.plataforma, 
        viewersBase[transmision.plataforma]
      );
      streamViewers.innerHTML = `<i class="fas fa-eye"></i> ${espectadoresIniciales.toLocaleString()}`;
    }

    // Crear tarjetas de transmisión
    transmisiones.forEach((transmision, index) => {
      const card = document.createElement('div');
      card.className = 'stream-card';
      
      // Generar número inicial de espectadores
      const espectadoresIniciales = generarEspectadores(
        transmision.plataforma, 
        viewersBase[transmision.plataforma]
      );
      
      card.innerHTML = `
        <i class="fab fa-${transmision.plataforma} platform-icon ${transmision.plataforma}"></i>
        <h3>${transmision.titulo}</h3>
        <p>${transmision.disciplina}</p>
        <div class="viewers">
          <i class="fas fa-eye"></i>
          <span class="viewers-count">${espectadoresIniciales.toLocaleString()}</span>
        </div>
      `;
      
      card.addEventListener('click', () => {
        // Detener el intervalo anterior si existe
        if (viewersInterval) clearInterval(viewersInterval);
        
        document.querySelectorAll('.stream-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        actualizarReproductor(transmision);
        
        // Iniciar actualización en tiempo real para esta transmisión
        viewersInterval = setInterval(actualizarContadores, 3000);
      });
      
      listContainer.appendChild(card);

      // Cargar la primera transmisión por defecto
      if (index === 0) {
        card.classList.add('active');
        actualizarReproductor(transmision);
      }
    });

    // Iniciar la actualización en tiempo real
    viewersInterval = setInterval(actualizarContadores, 3000);

    // Navegación entre transmisiones
    prevBtn.addEventListener('click', () => {
      streamScroll.scrollBy({ left: -250, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      streamScroll.scrollBy({ left: 250, behavior: 'smooth' });
    });

  } catch (error) {
    console.error('Error al cargar las transmisiones:', error);
    const errorMsg = document.createElement('div');
    errorMsg.textContent = 'No se pudieron cargar las transmisiones. Intenta más tarde.';
    errorMsg.style.color = 'red';
    errorMsg.style.textAlign = 'center';
    errorMsg.style.padding = '2rem';
    document.querySelector('main').appendChild(errorMsg);
  }
}

// Cargar transmisiones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', cargarTransmisiones);