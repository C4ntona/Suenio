const canvas = document.querySelector("canvas");
const c = canvas.getContext('2d');

socket = io();

const devicePixelRatio = window.devicePixelRatio || 1

canvas.width = 1280;
canvas.height = 720;

const x = canvas.width / 2
const y = canvas.height / 2

const frontEndPlayers = {}

socket.on('updatePlayers', (backEndPlayers) => {

  const canvas = document.querySelector("canvas");
  const c = canvas.getContext('2d');

  c.clearRect(0, 0, canvas.width, canvas.height);

  for (const id in backEndPlayers) {
    const backEndPlayer = backEndPlayers[id]

    if (!frontEndPlayers[id]) {
      frontEndPlayers[id] = new Player({
        x: backEndPlayer.x,
        y: backEndPlayer.y,
        width: 50,
        height: 50,
        src: "../img/barbarian.png"
      })
    } else {
      if (id === socket.id) {
        // if a player already exists
        frontEndPlayers[id].x = backEndPlayer.x
        frontEndPlayers[id].y = backEndPlayer.y

        const lastBackendInputIndex = playerInputs.findIndex((input) => {
          return backEndPlayer.sequenceNumber === input.sequenceNumber
        })

        if (lastBackendInputIndex > -1)
          playerInputs.splice(0, lastBackendInputIndex + 1)

        playerInputs.forEach((input) => {
          frontEndPlayers[id].x += input.dx
          frontEndPlayers[id].y += input.dy
        })
      } else {
        // for all other players

        gsap.to(frontEndPlayers[id], {
          x: backEndPlayer.x,
          y: backEndPlayer.y,
          duration: 0.015,
          ease: 'linear'
        })
      }
    }
  }

  for (const id in frontEndPlayers) {
    if (!backEndPlayers[id]) {
      delete frontEndPlayers[id]
    }
  }
})

let animationId
function animate() {
  animationId = requestAnimationFrame(animate)
  c.fillStyle = 'rgba(0, 0, 0, 0)'
  c.fillRect(0, 0, canvas.width, canvas.height)

  for (const id in frontEndPlayers) {
    const frontEndPlayer = frontEndPlayers[id]
    frontEndPlayer.draw()
  }
}

animate()

const keys = {
  w: {
    pressed: false
  },
  a: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  }
}


const SPEED = 10
const playerInputs = []
let sequenceNumber = 0
setInterval(() => {
  if (keys.w.pressed) {
    sequenceNumber++
    playerInputs.push({ sequenceNumber, dx: 0, dy: -SPEED })
    frontEndPlayers[socket.id].y -= SPEED
    socket.emit('keydown', { keycode: 'KeyW', sequenceNumber})
  }

  if (keys.a.pressed) {
    sequenceNumber++
    playerInputs.push({ sequenceNumber, dx: -SPEED, dy: 0 })
    frontEndPlayers[socket.id].x -= SPEED
    socket.emit('keydown', { keycode: 'KeyA', sequenceNumber })
  }

  if (keys.s.pressed) {
    sequenceNumber++
    playerInputs.push({ sequenceNumber, dx: 0, dy: SPEED })
    frontEndPlayers[socket.id].y += SPEED
    socket.emit('keydown', { keycode: 'KeyS', sequenceNumber })
  }

  if (keys.d.pressed) {
    sequenceNumber++
    playerInputs.push({ sequenceNumber, dx: SPEED, dy: 0 })
    frontEndPlayers[socket.id].x += SPEED
    socket.emit('keydown', { keycode: 'KeyD', sequenceNumber })
  }
},15)

window.addEventListener('keydown', (event) => {
  if (!frontEndPlayers[socket.id]) return

  switch (event.code) {
    case 'KeyW':
      keys.w.pressed = true
      break

    case 'KeyA':
      keys.a.pressed = true
      break

    case 'KeyS':
      keys.s.pressed = true
      break

    case 'KeyD':
      keys.d.pressed = true
      break
  }
})

window.addEventListener('keyup', (event) => {
  if (!frontEndPlayers[socket.id]) return

  switch (event.code) {
    case 'KeyW':
      keys.w.pressed = false
      break

    case 'KeyA':
      keys.a.pressed = false
      break

    case 'KeyS':
      keys.s.pressed = false
      break

    case 'KeyD':
      keys.d.pressed = false
      break
  }
});

window.addEventListener('load',()=>{
  $(function() {  
      $('.btn-6')
        .on('mouseenter', function(e) {
                var parentOffset = $(this).offset(),
                  relX = e.pageX - parentOffset.left,
                  relY = e.pageY - parentOffset.top;
                $(this).find('span').css({top:relY, left:relX})
        })
        .on('mouseout', function(e) {
                var parentOffset = $(this).offset(),
                  relX = e.pageX - parentOffset.left,
                  relY = e.pageY - parentOffset.top;
            $(this).find('span').css({top:relY, left:relX})
        });
  });
});
  
  $(document).ready(function() {
    
    function showResult(result) {
      var notification = $('#notification');
      notification.text("Se ha hecho una tirada de " + result);
      notification.fadeIn();
  
      setTimeout(function() {
      notification.fadeOut();
      }, 3000);
    }
  
    socket.on('showResultToAll', function(result) {
      showResult(result);
    });
  
    function changeBackground(imageUrl) {
      const canvas1 = document.getElementById('canvas1');
      canvas1.style.backgroundImage = `url(../img/${imageUrl}.jpg)`;
    }
  
    socket.on('backgroundChange', function(newBackground){
      changeBackground(newBackground);
    })
  
      //Function to pop a little window that shows a pair of dices
  
      $('#dice-btn').click(function() {
  
        var overlay = document.createElement('div');
        overlay.className = 'overlay';
        
        var closeBtn = document.createElement('span');
        closeBtn.className = 'close-btn';
        closeBtn.innerHTML = 'x';
        closeBtn.addEventListener('click', function() {
          document.body.removeChild(overlay);
        });
        
        var dice1 = document.createElement('img');
        dice1.src = '../img/1.PNG';
        dice1.className = 'dice';
        
        var dice2 = document.createElement('img');
        dice2.src = '../img/1.PNG';
        dice2.className = 'dice';
  
        var resultText = document.createElement('p');
        resultText.className = 'result-text';
        
        var rollBtn = document.createElement('button');
        rollBtn.innerHTML = 'Tirar';
        rollBtn.addEventListener('click', function() {
          var result1 = Math.floor(Math.random() * 6) + 1;
          var result2 = Math.floor(Math.random() * 6) + 1;
          total = result1 + result2;
          
          dice1.src = `../img/${result1}.PNG`;
          dice2.src = `../img/${result2}.PNG`;
  
          resultText.innerHTML = 'Resultado: ' + total;
        });
        
        rollBtn.addEventListener('click', function() {
          rollBtn.innerHTML = 'Tirar otra vez';
          rollBtn.append(resultText);
          socket.emit('diceResult', total);
        });
        
        overlay.appendChild(closeBtn);
        overlay.appendChild(dice1);
        overlay.appendChild(dice2);
        overlay.appendChild(rollBtn);
        
        document.body.appendChild(overlay);
      });
  
        
      //Function to pop the chat on screen
  
      $('#chat-btn').click(function(){

        if(!document.getElementById("events")){
          const chatDiv = document.getElementById('chat');
  
            const canvasDiv = document.getElementById('canvas1');
    
            canvasDiv.style.zIndex = -1;
    
            chatDiv.style.zIndex = 1;
    
            chatDiv.innerHTML = `<!DOCTYPE html>
            <html lang="en">
              <head>
                <title>RPS</title>
                <link rel="stylesheet" href="styles/chat.css">
              </head>
              <body>
                <div class="rps-wrapper">
                  <span id='close'>X</span>
                  <ul id="events"></ul>
                  <div class="controls">
                    <div class="chat-wrapper">
                      <form id="chat-form">
                        <input id="text" autocomplete="off" title="chat"/>
                        <button id="say">Say</button>
                      </form>
                    </div>
            
                    <div class="button-wrapper">
                      <button id="rock" class="turn">Rock</button>
                      <button id="paper" class="turn">Paper</button>
                      <button id="scissors" class="turn">Scissors</button>
                    </div>
                  </div>
                </div>
              </body>
            </html>`;
    
            const writeEvent = (text) => {
              // <ul> element
              const parent = document.querySelector('#events');
            
              // <li> element
              const el = document.createElement('li');
              el.innerHTML = text;
            
              parent.appendChild(el);
            };
            
            const onFormSubmitted = (e) => {
              e.preventDefault();
            
              const input = document.querySelector('#text');
              const text = input.value;
              input.value = '';
            
              socket.emit('message', text);
            };
            
            const addButtonListeners = () => {
              ['rock', 'paper', 'scissors'].forEach((id) => {
                const button = document.getElementById(id);
                button.addEventListener('click', () => {
                  socket.emit('turn', id);
                });
              });
            };
            
            writeEvent('Welcome to RPS');
        
            socket.on('message', writeEvent);
            
            document
              .querySelector('#chat-form')
              .addEventListener('submit', onFormSubmitted);
            
            addButtonListeners();

            function cerrarChat() {
              console.log("si");
              var chatDiv = document.getElementById("chat");
              chatDiv.style.visibility = "hidden";
            }

            document.getElementById("close").addEventListener("click",cerrarChat)
        }else{
          var chatDiv = document.getElementById("chat");
          chatDiv.style.visibility = "visible";
        }
      })
  
        //Function that allows the user to change the current map
        $('#changeMap-btn').click(function() {
  
          // Crea el div del mapa
          var mapDiv = $('<div></div>').addClass('map-overlay');
      
          // Crea la x para cerrar el div
          var closeBtn = $('<span></span>').addClass('close-btn').text('x');
          closeBtn.click(function() {
            mapDiv.remove();
          });
      
          // Crea las imágenes del mapa
          var image1 = $('<img>').attr('src', '../img/tabern.jpg').attr('id', 'tabern');
          var image2 = $('<img>').attr('src', '../img/sea.jpg').attr('id', 'sea');
          var image3 = $('<img>').attr('src', '../img/castle.jpg').attr('id', 'castle');
          var image4 = $('<img>').attr('src', '../img/fields.jpg').attr('id', 'fields');
      
          // Agrega los elementos al div del mapa
          mapDiv.append(closeBtn);
      
          var row1 = $('<div></div>').addClass('row');
          row1.append(image1);
          row1.append(image2);
          mapDiv.append(row1);
      
          var row2 = $('<div></div>').addClass('row');
          row2.append(image3);
          row2.append(image4);
          mapDiv.append(row2);
  
          image1.click(function(){
            socket.emit('changeBackground', "tabern");
          })
  
          image2.click(function(){
            socket.emit('changeBackground', "sea");
          })
  
          image3.click(function(){
            socket.emit('changeBackground', "castle");
          })
  
          image4.click(function(){
            socket.emit('changeBackground', "fields");
          })
      
          // Agrega el div del mapa al cuerpo del documento
          $('body').append(mapDiv);
        });


        function dragContainer(event, containerId){
          let container = document.getElementById(containerId);
          isDragging = true;
          offsetX = event.clientX - container.offsetLeft;
          offsetY = event.clientY - container.offsetTop;
        }
        
        function dropContainer(event, containerId){
          if (isDragging) {
            let container = document.getElementById(containerId);
            container.style.left = event.clientX - offsetX + 'px';
            container.style.top = event.clientY - offsetY + 'px';
            isDragging = false;
      
            const position = {
              left: container.style.left,
              top: container.style.top,
            };
            socket.emit('updatePosition', containerId, position);
          }
        }


        function animateSpritesheet(containerId, spritesheetPath, frameWidth, frameHeight, framesPerSecond) {
          const container = document.getElementById(containerId);
          container.style.width = frameWidth + 'px';
          container.style.height = frameHeight + 'px';
        
          const spritesheet = new Image();
          spritesheet.src = spritesheetPath;
        
          const canvas = document.createElement('canvas');
          canvas.width = frameWidth;
          canvas.height = frameHeight;
          container.appendChild(canvas);
        
          const ctx = canvas.getContext('2d');
        
          let currentFrame = 0;
        
          function drawNextFrame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(
              spritesheet,
              currentFrame * frameWidth,
              0,
              frameWidth,
              frameHeight,
              0,
              0,
              frameWidth,
              frameHeight
            );
        
            currentFrame++;
        
            if (currentFrame * frameWidth >= spritesheet.width) {
              currentFrame = 0;
            }
        
            setTimeout(drawNextFrame, 1000 / framesPerSecond);
          }
        
          spritesheet.onload = drawNextFrame;
        
          let isDragging = false;
          let offsetX = 0;
          let offsetY = 0;
        
           container.onmousedown = function (event) {
             isDragging = true;
             offsetX = event.clientX - container.offsetLeft;
             offsetY = event.clientY - container.offsetTop;
           };
        
           document.onmouseup = function (event) {
             if (isDragging) {
               container.style.left = event.clientX - offsetX + 'px';
               container.style.top = event.clientY - offsetY + 'px';
               isDragging = false;
        
               const position = {
                 left: container.style.left,
                 top: container.style.top,
               };
               socket.emit('updatePosition', containerId, position);
             }
           };
        }

        // Obtener los divs arrastrables
        const draggableDivs = document.querySelectorAll('.draggable');

        // Añadir el evento de arrastre a cada div
        draggableDivs.forEach((div) => {
          div.addEventListener('mousedown', (event) => {
            const startX = event.clientX;
            const startY = event.clientY;
            const startLeft = parseInt(div.style.left || 0, 10);
            const startTop = parseInt(div.style.top || 0, 10);

            function handleDrag(event) {
              const newX = event.clientX;
              const newY = event.clientY;

              const deltaX = newX - startX;
              const deltaY = newY - startY;

              div.style.left = startLeft + deltaX + 'px';
              div.style.top = startTop + deltaY + 'px';

              // Enviar la posición actualizada al servidor a través de Socket.io
              socket.emit('dragDiv', { id: div.id, left: div.style.left, top: div.style.top });
            }

            function handleDragEnd() {
              document.removeEventListener('mousemove', handleDrag);
              document.removeEventListener('mouseup', handleDragEnd);
            }

            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('mouseup', handleDragEnd);
          });
        });
        
        animateSpritesheet("keeseContainer",'../assets/Monster_Creatures_Fantasy(Version 1.3)/Flying eye/Attack3.png', 150, 150, 8);

        animateSpritesheet("bokoblinContainer", '../assets/Monster_Creatures_Fantasy(Version 1.3)/Goblin/Attack3.png', 150, 150, 8);

        animateSpritesheet("stalfosContainer", '../assets/Monster_Creatures_Fantasy(Version 1.3)/Skeleton/Attack3.png', 150, 150, 8);

        animateSpritesheet("setaDarkSoulsContainer", '../assets/Monster_Creatures_Fantasy(Version 1.3)/Mushroom/Attack3.png', 150, 150, 8);

        // Escuchar el evento de arrastre de un div actualizado desde el servidor
        socket.on('dragDiv', (data) => {
          const { id, left, top } = data;

          const divToUpdate = document.getElementById(id);
          if (divToUpdate) {
            divToUpdate.style.left = left;
            divToUpdate.style.top = top;
          }
        });

        function eliminateDiv(divId){
          const eliminatedDiv = divId;
          socket.emit('eliminateDiv', eliminatedDiv);
        }

        socket.on('eliminateDiv', (divId)=>{
          console.log(divId);
          document.getElementById(divId).remove();
        });

        $('#keeseContainer').dblclick(()=>eliminateDiv('keeseContainer'));
        $('#bokoblinContainer').dblclick(()=>eliminateDiv('bokoblinContainer'));
        $('#stalfosContainer').dblclick(()=>eliminateDiv('stalfosContainer'));
        $('#setaDarkSoulsContainer').dblclick(()=>eliminateDiv('setaDarkSoulsContainer'));
  });
