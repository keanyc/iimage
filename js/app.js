var app;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var img = new Image();

(function () {
  'use strict';

  app = {
    i: 0,
    speed: 500,
    playing: false,
    direction: 'forward',
    init: function () {
      app.bindEvents();
      app.render();
    },
    bindEvents: function () {
      document.getElementById('ctrl-play-and-stop').addEventListener('click', app.togglePlayStop, false);
      document.getElementById('ctrl-backward').addEventListener('click', app.prev, false);
      document.getElementById('ctrl-forward').addEventListener('click', app.next, false);
      document.getElementById('play').addEventListener('click', app.play, false);
      document.getElementById('stop').addEventListener('click', app.stop, false);
      document.getElementById('backward').addEventListener('click', app.backward, false);
      document.getElementById('forward').addEventListener('click', app.forward, false);
      document.getElementById('prev').addEventListener('click', app.prev, false);
      document.getElementById('next').addEventListener('click', app.next, false);
      document.getElementById('photo-list').addEventListener('click', app.render, false);
    },
    render: function (e) {
      if (typeof e !== 'undefined') {
        app.i = +e.target.dataset.id;
      }
      img.onload = app.renderImage;
      img.src = app.photo[app.i];
      app.list();
    },
    renderImage: function () {
      var image = document.createElement('IMG');
      image.src = img.src;
      EXIF.getData(image, function() {
        var allMetaData = EXIF.getAllTags(this);
        // alert(JSON.stringify(allMetaData, null, "\t"));

        ctx.save();

        if (parseInt(allMetaData.Orientation) === 3) {
          ctx.translate(canvas.width, canvas.height);
          ctx.rotate(Math.PI);
          ctx.drawImage(img, canvas.width / 2 - img.width / 2, canvas.height / 2 - img.height / 2);
        } else if (parseInt(allMetaData.Orientation) === 6) {
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(Math.PI / 2);
          ctx.drawImage(img, -img.width / 2, -img.height / 2);
        } else {
          ctx.drawImage(img, canvas.width / 2 - img.width / 2, canvas.height / 2 - img.height / 2);
        }

        ctx.restore();
      });
    },
    play: function () {
      var i = app.i;

      if (app.playing === true || ! app.photo) {
        return;
      }

      app.playing = true;
      app.interval = setInterval(function () {
        app.render();
        i = app.direction === 'forward' ? i + 1 : i - 1;

        if (i >= app.photo.length) {
          i = 0;
        } else if (i < 0) {
          i = app.photo.length - 1;
        }

        app.i = i;
      }, app.speed);
    },
    stop: function () {
      app.playing = false;
      clearInterval(app.interval);
    },
    togglePlayStop: function () {
      if (app.playing === false) {
        app.play();
      } else {
        app.stop();
      }
    },
    setSpeed: function () {
      var speed = app.speed;

      switch(speed){
      case 100:
        speed = 500;
        break;
      case 500:
        speed = 1000;
        break;
      default:
        speed = 100;
      }

      return speed;
    },
    backward: function () {
      if (app.direction === 'backward') {
        app.speed = app.setSpeed();
      } else {
        app.direction = 'backward';
      }

      app.replay();
    },
    forward: function () {
      if (app.direction === 'forward') {
        app.speed = app.setSpeed();
      } else {
        app.direction = 'forward';
      }

      app.replay();
    },
    replay: function () {
      app.stop();
      app.play();
    },
    prev: function () {
      var i = app.i;

      app.stop();
      i = i - 1;

      if (i <= 0) {
        i = 0;
      }

      app.render();
      app.i = i;
    },
    next: function () {
      var i = app.i;

      app.stop();
      i = i + 1;

      if (i >= app.photo.length) {
        i = app.photo.length - 1;
      }

      app.render();
      app.i = i;
    },
    list: function () {
      var html = '';
      var range = 4;
      var index = +app.i;
      var start = index - range + 1;
      var end = index + range;

      if (start < 0) {
        start = 0;
      }

      if (end > app.photo.length) {
        end = app.photo.length;
      }

      for (var i = start; i < end; i++) {
        if (i === index) {
          html = html + '<img src="' + app.photo[i] + '" class="icon" data-id="' + i + '" style="margin: 0 10px;" />';
        } else {
          html = html + '<img src="' + app.photo[i] + '" class="icon" data-id="' + i + '" />';
        }
      }

      document.getElementById('photo-list').innerHTML = html;
    }
  };
})();
