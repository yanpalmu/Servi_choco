// ===== REPRODUCTOR YOUTUBE =====
    const canciones = [
      { id: 'dXqP4QL82eY', nombre: 'Chocó Mix 1' },
      { id: 'oeYMgEGAR98', nombre: 'Chocó Mix 2' },
      { id: 'uNSH5Tj40sA', nombre: 'Chocó Mix 3' },
      { id: 'BFO7Yc7QCr8', nombre: 'Chocó Mix 4' },
    ];
    
    let ytPlayer = null;
    let currentSong = 0;
    let isPlaying = false;
    let ytReady = false;
    
    // Cargar API de YouTube
    function loadYTApi() {
      if (document.getElementById('yt-api-script')) return;
      const tag = document.createElement('script');
      tag.id = 'yt-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = function() {
      ytReady = true;
      ytPlayer = new YT.Player('yt-player', {
        height: '1', width: '1',
        videoId: canciones[currentSong].id,
        playerVars: { autoplay: 0, controls: 0, loop: 0 },
        events: {
          onStateChange: onPlayerStateChange
        }
      });
    };

    function onPlayerStateChange(event) {
      if (event.data === YT.PlayerState.ENDED) {
        nextSong();
      }
    }

    function toggleMusic() {
      if (!ytReady) {
        loadYTApi();
        setTimeout(toggleMusic, 1200);
        return;
      }
      if (!isPlaying) {
        ytPlayer.loadVideoById(canciones[currentSong].id);
        ytPlayer.playVideo();
        isPlaying = true;
        document.getElementById('music-toggle').classList.add('playing');
        document.getElementById('music-icon').innerHTML = '&#9646;&#9646;';
        document.getElementById('music-info').classList.add('visible');
        document.getElementById('music-bars').classList.add('active');
        document.getElementById('music-name').textContent = canciones[currentSong].nombre;
      } else {
        ytPlayer.pauseVideo();
        isPlaying = false;
        document.getElementById('music-toggle').classList.remove('playing');
        document.getElementById('music-icon').innerHTML = '&#9654;';
        document.getElementById('music-bars').classList.remove('active');
      }
    }

    function nextSong() {
      currentSong = (currentSong + 1) % canciones.length;
      if (isPlaying && ytReady) {
        ytPlayer.loadVideoById(canciones[currentSong].id);
        ytPlayer.playVideo();
      }
      document.getElementById('music-name').textContent = canciones[currentSong].nombre;
    }

    function prevSong() {
      currentSong = (currentSong - 1 + canciones.length) % canciones.length;
      if (isPlaying && ytReady) {
        ytPlayer.loadVideoById(canciones[currentSong].id);
        ytPlayer.playVideo();
      }
      document.getElementById('music-name').textContent = canciones[currentSong].nombre;
    }

    // Pre-cargar la API al hacer scroll
    window.addEventListener('scroll', function preLoad() {
      loadYTApi();
      window.removeEventListener('scroll', preLoad);
    }, { once: true });