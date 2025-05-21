 async function cargarTransmisiones() {
    const response = await fetch('transmisiones.json');
    const transmisiones = await response.json();
    const listContainer = document.getElementById('streamList');
    const mainPlayer = document.getElementById('mainPlayer');

    transmisiones.forEach((transmision, index) => {
      const card = document.createElement('div');
      card.className = 'stream-card';
      card.textContent = transmision.titulo;
      card.addEventListener('click', () => {
        document.querySelectorAll('.stream-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        mainPlayer.src = transmision.url;
      });
      listContainer.appendChild(card);

      // Cargar la primera transmisión por defecto
      if (index === 0) {
        card.classList.add('active');
        mainPlayer.src = transmision.url;
      }
    });
  }

  cargarTransmisiones();