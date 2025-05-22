document.querySelectorAll('.boton-imagen').forEach(function(boton) {
  boton.addEventListener('click', function() {
    // Busca el siguiente elemento hermano con la clase 'opciones'
    var opciones = this.nextElementSibling;
    if (opciones && opciones.classList.contains('opciones')) {
      opciones.style.display = opciones.style.display === 'none' ? 'block' : 'none';
    }
  });
});