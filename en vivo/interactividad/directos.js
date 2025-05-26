// Variables globales para el control de espectadores
let viewersInterval;
const viewersBase = {
  youtube: 1000,
  facebook: 1500,
  instagram: 800
};

// Convertir URL a formato embebido
function convertirUrlEmbebida(url) {
  if (!url) return '';

  if (url.includes("youtube.com/watch?v=")) {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  if (url.includes("facebook.com") && !url.includes("plugins/video.php")) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&autoplay=1`;
  }

  if (url.includes("instagram.com") && !url.includes("/embed")) {
    return url.endsWith("/") ? `${url}embed` : `${url}/embed`;
  }

  return url;
}

// Verificar que la URL es segura para usar en iframe
function esUrlSegura(url) {
  const pattern = /^https:\/\/(www\.)?(youtube\.com|facebook\.com|instagram\.com|twitch\.tv)/;
  return pattern.test(url);
}

async function cargarTransmisiones() {
  try {
    const response = await fetch('./data/transmisiones.json');
    const transmisiones = await response.json();
    const listContainer = document.getElementById('streamList');
    const mainPlayer = document.getElementById('mainPlayer');
    const streamTitle = document.getElementById('streamTitle');
    const streamPlatform = document.getElementById('streamPlatform');
    const streamViewers = document.getElementById('streamViewers');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const streamScroll = document.getElementById('streamScroll');

    function generarEspectadores(plataforma, base) {
      const variacion = Math.floor(Math.random() * 300) - 150;
      return base + variacion;
    }

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
        if (card.classList.contains('active')) {
          streamViewers.innerHTML = `<img src="../img/icon-view.png" alt="Vistas" class="view-icon" /> ${nuevosEspectadores.toLocaleString()}`;
        }
      });
    }

    function actualizarReproductor(transmision) {
      if (esUrlSegura(transmision.url)) {
        const urlEmbed = convertirUrlEmbebida(transmision.url);
        mainPlayer.src = urlEmbed;
      } else {
        mainPlayer.src = '';
        console.warn('URL insegura o no compatible:', transmision.url);
      }

      streamTitle.textContent = transmision.titulo;
      streamPlatform.innerHTML = `
        <img src="../img/icon-${transmision.plataforma}.svg" alt="${transmision.plataforma}" class="platform-icon-img" />
        ${transmision.plataforma.charAt(0).toUpperCase() + transmision.plataforma.slice(1)}
      `;

      const espectadoresIniciales = generarEspectadores(
        transmision.plataforma,
        viewersBase[transmision.plataforma]
      );
      streamViewers.innerHTML = `<img src="../img/icon-view.png" alt="Vistas" class="view-icon"/> ${espectadoresIniciales.toLocaleString()}`;
    }

    transmisiones.forEach((transmision, index) => {
      const card = document.createElement('div');
      card.className = 'stream-card';
      const espectadoresIniciales = generarEspectadores(
        transmision.plataforma,
        viewersBase[transmision.plataforma]
      );
      card.innerHTML = `
        <img src="../img/icon-${transmision.plataforma}.svg" alt="${transmision.plataforma}" class="platform-icon-img" />
        <h3>${transmision.titulo}</h3>
        <p>${transmision.disciplina}</p>
        <div class="viewers">
            <img src="../img/icon-view.png" alt="Vistas" class="view-icon" />
          <span class="viewers-count">${espectadoresIniciales.toLocaleString()}</span>
        </div>
      `;
      card.addEventListener('click', () => {
        if (viewersInterval) clearInterval(viewersInterval);
        document.querySelectorAll('.stream-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        actualizarReproductor(transmision);
        viewersInterval = setInterval(actualizarContadores, 3000);
      });

      listContainer.appendChild(card);

      if (index === 0) {
        card.classList.add('active');
        actualizarReproductor(transmision);
      }
    });

    viewersInterval = setInterval(actualizarContadores, 3000);

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

document.addEventListener('DOMContentLoaded', cargarTransmisiones);
