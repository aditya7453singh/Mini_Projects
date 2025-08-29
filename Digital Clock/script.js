function updateClock() {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      let seconds = now.getSeconds();
      let ampm = hours >= 12 ? 'PM' : 'AM';

      // Convert to 12-hour format
      hours = hours % 12;
      hours = hours ? hours : 12;

      // Pad with leading zeros
      hours = hours < 10 ? '0' + hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;

      // Time string
      const timeString = `${hours}:${minutes}:${seconds} ${ampm}`;
      document.getElementById('clock').innerText = timeString;

      // Date string
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const dateString = now.toLocaleDateString(undefined, options);
      document.getElementById('date').innerText = dateString;
    }

    function toggleMode() {
      document.body.classList.toggle("light");
    }

    setInterval(updateClock, 1000);
    updateClock();