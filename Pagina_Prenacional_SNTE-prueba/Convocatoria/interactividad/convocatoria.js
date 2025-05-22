document.addEventListener('DOMContentLoaded', () => {
    const targetDate = new Date('2025-06-22T00:00:00').getTime();
    const countdownContainer = document.getElementById('countdown');

    function updateCountdown() {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        countdownContainer.innerHTML = "<strong>¡El evento ha comenzado!</strong>";
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      countdownContainer.innerHTML = `<div class="countdown-box"><span class="num">${days}</span><span class="label">Días</span></div>
                                      <div class="countdown-box"><span class="num">${hours}</span><span class="label">Horas</span></div>
                                      <div class="countdown-box"><span class="num">${minutes}</span><span class="label">Min</span></div>
                                      <div class="countdown-box"><span class="num">${seconds}</span><span class="label">Seg</span></div>`;
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
  });
