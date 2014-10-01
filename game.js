var ctx, self, enemies = [], speed, enemys, score, c, ctx, paused, time, mov, tsize, revives, endgamereq, width, height;

function move() {
  if (endgamereq) gameOver();
  ctx.canvas.width  = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  ctx.font = tsize + 'px sans';
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.lineWidth = 5;
  enemys = Math.floor(ctx.canvas.width * ctx.canvas.height / 38880);
  for (var i = enemies.length; i < enemys; i++) {
    enemies[i] = new enemy(i);
    enemies[i].init();
  }
  for (var i = 0; i < enemys; i++) enemies[i].move();
  self.move();
  mov = requestAnimationFrame(move);
  time--;
  text();
  if (time == 0) endgamereq = true;
}

function key(type, event) {
  switch (event.keyCode) {
    case 37:
      if (type == 'down') self.dir = 'l';
      else self.dir = null;
      break;
    case 39:
      if (type == 'down') self.dir = 'r';
      else self.dir = null;
      break;
    case 13:
      if (paused == true && type == 'down') {
        mov = requestAnimationFrame(move);
        paused = false;
      }
      else if (type == 'down') {
        cancelAnimationFrame(mov);
        paused = true;
      }
      break;
  }
}

function gameOver() {
  var message;
  var oldHighScore = JSON.parse(localStorage.highScore);
  function popup(beat) {
    function highScore(name) {
      this.score = score;
      this.name = name;
    }
    if (beat == true) {
      var name = prompt('You collected ' + score + ' coins. ' + message + ' Enter your name and press OK to play again.');
      var highScore = new highScore(name);
      localStorage.highScore = JSON.stringify(highScore);
    }
    else {
      alert('You collected ' + score + ' coins. ' + message + ' Press OK to play again.');
    }
  }
  if (!(localStorage.highScore)) {
    message = 'Because you haven\'t played before, your score for this game is the new local high score.';
    popup(true);
  }
  else if (oldHighScore.score > score) {
    message = 'You failed to beat high score, ' + oldHighScore.name + '\'s high score of ' + oldHighScore.score + ' points!';
    popup(false);
  }
  else if (oldHighScore.score < score) {
    message = 'You beat ' + oldHighScore.name + '\'s high score of ' + oldHighScore.score + ' points!';
    popup(true);
  }
  else {
    message = 'You tied the local high score!';
    popup(false);
  }
  location.reload();
}

function evaluate(x, y, radius, num, color) {
  if (Math.sqrt(Math.pow(x - self.x, 2) + Math.pow(y - self.y, 2)) < radius + self.radius && color != 'white' && color != 'red') {
    score++;
    time += 10;
    if (color == 'cyan') {
      if (time < 3600){
        time = 3600;
        if (revives == 0) {
          endgamereq = true;
        }
        revives--;
      }
      score--;
      return 'red';
    }
    else return 'white';
  }
  else return color;
}

function self(i) {
  this.radius = 30;
  this.x = ctx.canvas.width / 2;
  this.y = ctx.canvas.height - 50 - this.radius;
  this.dir = null;
  this.move = function() {
    if (this.dir == 'r' && this.x + this.radius <= ctx.canvas.width) this.x += speed * 2;
    if (this.dir == 'l' && this.x - this.radius >= 0) this.x -= speed * 2;
    if (this.x + this.radius > ctx.canvas.width) this.x = ctx.canvas.width - this.radius;
    this.y = ctx.canvas.height - 50 - this.radius;
    ctx.beginPath();
    ctx.strokeStyle = 'magenta';
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function enemy(num) {
  this.num = num;
  this.radius = 10;
  this.init = function() {
    this.color = 'yellow';
    this.speed = (Math.random() * 4 + 1) / 2;
    this.x = Math.floor(Math.random() * (ctx.canvas.width - (this.radius * 2 - 1))) + this.radius;
    this.y = -(this.radius * 2);
    this.rand = Math.floor(Math.random() * 40);
    if (this.rand == 0) {
      this.color = 'cyan';
      this.speed *= 3;
    }
  }
  this.move = function() {
    this.y += speed * this.speed;
    this.color = evaluate(this.x, this.y, this.radius, this.num, this.color);
    if (this.y - this.radius >= ctx.canvas.height && enemies.length <= enemys) this.init();
    else if (enemies.length > enemys) enemies.splice(this.num, 1)
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function text() {
  ctx.fillStyle = 'white';
  ctx.textAlign = 'left';
  ctx.fillText('Cycles remaining: ' + time, 2, 2 + tsize);
  ctx.textAlign = 'center';
  ctx.fillText('Coins collected: ' + score, ctx.canvas.width / 2, 2 + tsize);
  ctx.textAlign = 'right';
  ctx.fillText('Revives remaining: ' + revives, ctx.canvas.width - 2, 2 + tsize);
}

function init() {
  endgamereq = false;
  revives = 2;
  paused = true;
  tsize = 20;
  c = document.getElementById('c');
  ctx = c.getContext('2d');
  ctx.canvas.width  = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  enemys = Math.floor(ctx.canvas.width * ctx.canvas.height / 38880);
  ctx.font = tsize + 'px sans';
  ctx.lineWidth = 5;
  for (var i = 0; i < enemys; i++) {
    enemies[i] = new enemy(i);
    enemies[i].init();
  }
  self = new self();
  speed = 3;
  score = 0;
  time = 3600;
  self.move();
  text();
}

window.onload = function() {init();}
document.onkeydown = function() {key('down', event);}
document.onkeyup = function() {key('up', event);}