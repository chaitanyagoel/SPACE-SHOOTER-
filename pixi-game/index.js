document.addEventListener("DOMContentLoaded", () => {  
  document.getElementsByClassName('pause')[0].addEventListener('click', handleGamePause);
  let i;
  myFunction();
  function myFunction() {
    setInterval(function(){ 
      if(i==0){
        i=1;
        var favicon = document.querySelector('link[rel="shortcut icon"]');
        if (!favicon) {
          favicon = document.createElement('link');
          favicon.setAttribute('rel', 'shortcut icon');
          var head = document.querySelector('head');
          head.appendChild(favicon);
        }
        favicon.setAttribute('type', 'image/png');
        favicon.setAttribute('href','images/logo4.png');
        document.getElementById("logo").src = 'images/logo3.png' ;
        document.getElementById("choose_text").style.color = "red" ;
        document.getElementById("heading").style.color = "red" ;
        
      }
      else{
        i=0;
        document.getElementById("logo").src = 'images/logo2.png' ;
        document.getElementById("choose_text").style.color = "white" ;
        document.getElementById("heading").style.color = "white" ;

        var favicon = document.querySelector('link[rel="shortcut icon"]');
        if (!favicon) {
          favicon = document.createElement('link');
          favicon.setAttribute('rel', 'shortcut icon');
          var head = document.querySelector('head');
          head.appendChild(favicon);
        }
        favicon.setAttribute('type', 'image/png');
        favicon.setAttribute('href','images/logo.png');
      }
     }, 500);
  }
});
function handleName(e){
  console.log(document.getElementById("playerNameInput").value);
  let name=document.getElementById("playerNameInput").value;
  localStorage.setItem('plane_shooter_name', name);
  console.log(localStorage.getItem('plane_shooter_name'));
}
$("#playerNameInput").keypress(function(e){
  if(e.keyCode == 13) {
    if(state != GamePaused){
      e.preventDefault();
    }
      $("#playerNameButton").click();
      return false;
  }
})


let Application = PIXI.Application,loader = PIXI.loader,Sprite = PIXI.Sprite,Rectangle = PIXI.Rectangle;

let app = new Application({ 
    width: 1000, 
    height: 600,                       
    antialias: true, 
    transparent: false, 
    resolution: 1
  }
);

app.renderer.view.style.display = 'block';
app.renderer.view.style.margin='150px auto 100px';

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

document.body.appendChild(app.view);
loader
  .add("space", "images/bg2.jpg")
  .add("images/character.json")
  .add("sound","images/bulletsound2.mp3")
  .add("level1","images/level1.png")
  .add("level2","images/level2.png")
  .add("level3","images/level3.png")
  .add("level4","images/level4.png")
  .add("level5","images/level5.png")
  .add("level6","images/level6.png")
  .on("progress", loadProgressHandler)
  .load(setup);

function loadProgressHandler(loader, resource) {
  console.log("loading.. "); 
}

let Defenders, PauseContainer;
let space, shooter, defender, bullet; 
let spaceVelocity = 2, shooterMaxVelocity = 10, defendersVelocity=4,flagSpeed1=0 ;
let numberOfDefenders = 5, xDefenderOffset = 1000,bomb =20,Nuclearbomb=3,Laserbomb=3;
let scorebombIncrease=0,healthText, scoreText,killText,LaserText,stageText,highestScoreText;

//for level change
var rad = document.myForm.easy;
var prev = null;
for (let i = 0; i < rad.length; i++) {
    rad[i].addEventListener('change', function() {
        if (this !== prev) {
            prev = this;
        }
        console.log((this.value-'0'))
        defendersVelocity=this.value-'0';
    });
}

let textStyle = new PIXI.TextStyle({
  fontFamily: "Futura",
  fontStyle: "italic",
  fontSize: 20,
  fill: "white",
  stroke: 'black',
  strokeThickness: 2,
  fontVariant: "small-caps",
});

let GameOverTextStyle = new PIXI.TextStyle({
  fontFamily: "Futura",
  fontStyle: "italic",
  fontWeight:"bold",
  fontSize: 50,
  fill: "red",
  fontVariant: "small-caps",
});

function setup() {

  space1 = new Sprite(loader.resources.space.texture);
  space1.width = 1000;
  space1.height = 600;
  app.stage.addChild(space1);

  space2 = new Sprite(loader.resources.space.texture);
  space2.width = 1000;
  space2.height = 600;
  space2.position.set(1000,0);
  app.stage.addChild(space2);

  renderBullet = () => {
    bullet = new PIXI.Graphics();
    bullet.beginFill(0xFFFF00);
    bullet.drawEllipse(0, 0, 10,3.3);
    bullet.beginFill(0xD98C18);
    bullet.drawEllipse(0, 0, 5, 3.3);
    bullet.beginFill(0xD91818);
    bullet.drawEllipse(6, 0, 5, 3.3);
    bullet.endFill();
    bullet.velocity = 10;
    bullet.value=1;
    bullet.kill=1;
    return bullet;
  }

  renderBomb = () => {
    bullet = new PIXI.Graphics();
    bullet.beginFill(0xFFFF00);
    bullet.drawEllipse(0, 0, 50,30);
    bullet.beginFill(0xff8533);   
    bullet.drawEllipse(5, 0, 30, 30);
    bullet.beginFill(0xff751a);   
    bullet.drawEllipse(15, 0, 20, 29);
    bullet.beginFill(0xff1a1a);
    bullet.drawEllipse(30, 0, 20,25);
    bullet.endFill();
    bullet.velocity = 8;
    bullet.value=2;
    bullet.kill=2;
    return bullet;
  }

  renderLaser = () => {
    bullet = new PIXI.Graphics();
    bullet.beginFill(0xFFFF00);
    bullet.drawRect(-3000,-5, 1000,5);
    bullet.beginFill(0xff8533); 
    bullet.drawRect(-1000,-5, 5000,5); 
    bullet.beginFill(0xff751a); 
    bullet.drawRect(-2000,-5, 1000,5);  
    bullet.beginFill(0xff1a1a);
    bullet.drawRect(0,-5, 300,5);
    bullet.endFill();
    bullet.velocity = 1;
    bullet.value=30;
    bullet.kill=30;
    return bullet;
  }

  Bullets = new PIXI.Container();
  app.stage.addChild(Bullets);

  let characters = PIXI.loader.resources["images/character.json"].textures;

  Defenders = new PIXI.Container();

  for (let i = 0; i < numberOfDefenders; i++) {
    defender = new Sprite(characters["defender"]);
    let xPosition = randomInt(xDefenderOffset, 2000);
    let yPosition = randomInt(0, app.stage.height - defender.height);
    defender.x = xPosition;
    defender.y = yPosition;
    defender.attack=0;
    defender.score=1;
    defender.level=1;   
    Defenders.addChild(defender);
  }

  app.stage.addChild(Defenders);

  shooter = new Sprite(characters["shooter"]);

  app.stage.addChild(shooter);
  shooter.width = characters["shooter"].width;
  shooter.height = characters["shooter"].height;

  shooter.pivot.y -= shooter.height / 2;
  
  shooter.position.set(10, 200);
  shooter.vx = 4;
  shooter.vy = 4;
  shooter.health = 10;
  shooter.score = 0;

  shooter.hitArea = new PIXI.Ellipse(shooter.pivot.x, shooter.pivot.y, shooter.width, shooter.height);

  PauseContainer = new PIXI.Container();
  const background = new PIXI.Graphics();
  background.beginFill('black', 0.5);
  background.drawRect(0, 0, 1000, 600);
  background.endFill();
  PauseContainer.addChild(background);

  CircleButton = new PIXI.Graphics();
  CircleButton.beginFill(0xFFFFFF);
  CircleButton.drawCircle(0, 0, 60);
  CircleButton.endFill();
  CircleButton.x = PauseContainer.width/2;
  CircleButton.y = PauseContainer.height/2;

  CircleButtonTextStyle = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 25,
    fill: "red",
    textTransform: 'uppercase',
    stroke: '#000000',
    strokeThickness: 1.5,
  });
  
  CircleButtonText = new PIXI.Text("START!", CircleButtonTextStyle);
  CircleButtonText.position.set(-45, -15);
  CircleButton.addChild(CircleButtonText);
  PauseContainer.addChild(CircleButton);
  CircleButton.interactive = true;
  CircleButton.buttonMode = true;
  CircleButton.on('pointerdown', handleCircButtonPressed);
  app.stage.addChild(PauseContainer);

  healthText = new PIXI.Text(`Health: ${shooter.health}`, textStyle);
  app.stage.addChild(healthText);
  healthText.position.set(20, 10);

  scoreText = new PIXI.Text(`Score: ${shooter.score}`, textStyle);
  app.stage.addChild(scoreText);
  scoreText.position.set(125, 10);

  bombText = new PIXI.Text(`Bomb: ${bomb}`, textStyle);
  app.stage.addChild(bombText);
  bombText.position.set(230, 10);
  
  LaserText=new PIXI.Text(`Laser: ${Laserbomb}`, textStyle);
  app.stage.addChild(LaserText);
  LaserText.position.set(330, 10);

  killText = new PIXI.Text(`Last Killed:  No kills yet   :P`, textStyle);
  app.stage.addChild(killText);
  killText.position.set(420, 10);

  stageText = new PIXI.Text(`Stage: 0 `, textStyle);
  app.stage.addChild(stageText);
  stageText.position.set(820, 10);

  highestScoreText = new PIXI.Text(`Highest Score: ${JSON.parse(localStorage.getItem('plane_shooter_highest_score') ? localStorage.getItem('plane_shooter_highest_score') : '0')}`, textStyle);
  app.stage.addChild(highestScoreText);
  highestScoreText.position.set(20, 570);

  gameOverText = new PIXI.Text('Oops.. Game Over!', GameOverTextStyle);
  gameWinText = new PIXI.Text(' You Won ..', GameOverTextStyle);
  app.ticker.add(() => gameLoop());

  state = GamePaused;
}

gameLoop = () => {
  state();
}

function play() {
  handleKeyButtons();

  space1.x -= spaceVelocity;
  space2.x -= spaceVelocity;
  if (space1.x == -1000) space1.x = 1000;
  if (space2.x == -1000) space2.x = 1000;

  Bullets.children.forEach(Bullet => {
    Bullet.x += Bullet.velocity;

    if(Bullet.x == 1000 + Bullet.width) {
      Bullets.removeChild(Bullet);
    }
  });

    Defenders.children.forEach((Allien, index) => {
    Allien.x -= defendersVelocity + index/1.5;
    if(shooter.x + shooter.width >= Allien.x && shooter.y + shooter.height+50 >= Allien.y && 
      shooter.x <= Allien.x + Allien.width && shooter.y+50 <= Allien.y + Allien.height) {
      
      if(Allien.level==1){
          shooter.health -= 1;
      }
      else if(Allien.level==2){
        shooter.health -= 1;
      }
      else if(Allien.level==3){
        shooter.health -= 2;
      }
      else if(Allien.level==4){
        shooter.health -= 2;
      }
      else if(Allien.level==5){
        shooter.health -= 3;
      }
      else if(Allien.level==6){
        shooter.health -= 3;
      }
      else if(Allien.level==7){
        shooter.health -= 4;
      }
      if(shooter.health>=0){
        healthText.text = `Health: ${shooter.health}`;
      }
      else{
        healthText.text = `Health: 0`;
      }
      
      Allien.visible = false;
      Allien.x = 1010;
      Allien.y = randomInt(0, app.stage.height - Allien.height );
    }

    Bullets.children.forEach(Bullet => {
      if (Bullet.x + Bullet.width >= Allien.x && Bullet.y + Bullet.height >= Allien.y && 
          Bullet.x <= Allien.x + Allien.width && Bullet.y <= Allien.y + Allien.height) {
            Bullet.kill-=(Allien.score-Allien.attack);
            Allien.attack += bullet.value;
            if(Bullet.kill<=0){
                Bullet.visible=false;
                Bullets.removeChild(Bullet);
              } 
            //for sound
            const test = PIXI.loader.resources.sound;
            test.data.play();
      }
        bombText.text = `Bomb: ${bomb}`;
        LaserText.text = `Laser: ${Laserbomb}`; 
    });

    if (Allien.attack>=Allien.score) {
        Allien.alpha = 0;
        shooter.score += Allien.level;
        scorebombIncrease+=Allien.level;
        scoreText.text = `Score: ${shooter.score}`;
        Allien.visible = false;
        Allien.x = 1010;
        Allien.y = randomInt(0, app.stage.height - Allien.height );

        if(scorebombIncrease>=20){
            bomb+=1;
            scorebombIncrease-=20;
        }  

        if(shooter.score>=20&&shooter.score<60){   
            stageText.text = `Stage: 1 `;
            const level1_sprite = new PIXI.Sprite(loader.resources.level1.texture);
            level1_sprite.width = 120;
            level1_sprite.height = 120;
            level1_sprite.attack=0;
            level1_sprite.score=5;
            level1_sprite.level=2;
            level1_sprite.x =  randomInt(xDefenderOffset, 2000);
            level1_sprite.y = randomInt(0, app.stage.height - defender.height);
            Defenders.addChild(level1_sprite);
            Defenders.removeChild(Allien);
        }
        else if(shooter.score>=60&&shooter.score<140){
            stageText.text = `Stage: 2 `;
            const level2_sprite = new PIXI.Sprite(loader.resources.level2.texture);
            level2_sprite.width = 130;
            level2_sprite.height = 60;
            level2_sprite.attack=0;
            level2_sprite.score=10;
            level2_sprite.level=3;
            level2_sprite.x =  randomInt(xDefenderOffset, 2000);
            level2_sprite.y = randomInt(0, app.stage.height - defender.height);
            Defenders.addChild(level2_sprite);
            Defenders.removeChild(Allien);  
        }
        else if(shooter.score>=140&&shooter.score<240){
            stageText.text = `Stage: 3 `;
            const level3_sprite = new PIXI.Sprite(loader.resources.level3.texture);
            level3_sprite.width = 150;
            level3_sprite.height = 100;
            level3_sprite.attack=0;
            level3_sprite.score=20;
            level3_sprite.level=4;
            level3_sprite.x =  randomInt(xDefenderOffset, 2000);
            level3_sprite.y = randomInt(0, app.stage.height - defender.height);
            Defenders.addChild(level3_sprite);
            Defenders.removeChild(Allien);
        }
        else if(shooter.score>=240&&shooter.score<400){
            stageText.text = `Stage: 4 `;
            const level4_sprite = new PIXI.Sprite(loader.resources.level4.texture);
            level4_sprite.width = 120;
            level4_sprite.height = 90;
            level4_sprite.attack=0;
            level4_sprite.score=30;
            level4_sprite.level=5;
            level4_sprite.x =  randomInt(xDefenderOffset, 2000);
            level4_sprite.y = randomInt(0, app.stage.height - defender.height);
            Defenders.addChild(level4_sprite);
            Defenders.removeChild(Allien);
        }
        else if(shooter.score>=400&&shooter.score<600){
            stageText.text = `Stage: 5 `;
            const level5_sprite = new PIXI.Sprite(loader.resources.level5.texture);
            level5_sprite.width = 150;
            level5_sprite.height = 90;
            level5_sprite.attack=0;
            level5_sprite.score=50;
            level5_sprite.level=6;
            level5_sprite.x =  randomInt(xDefenderOffset, 2000);
            level5_sprite.y = randomInt(0, app.stage.height - defender.height);
            Defenders.addChild(level5_sprite);
            Defenders.removeChild(Allien);
        }
        else if(shooter.score>=600&&shooter.score<800){
            stageText.text = `Stage: 6 `;
            const level6_sprite = new PIXI.Sprite(loader.resources.level6.texture);
            level6_sprite.width = 150;
            level6_sprite.height = 150;
            level6_sprite.attack=0;
            level6_sprite.score=70;
            level6_sprite.level=7;
            level6_sprite.x =  randomInt(xDefenderOffset, 2000);
            level6_sprite.y = randomInt(0, app.stage.height - defender.height);
            Defenders.addChild(level6_sprite);
            Defenders.removeChild(Allien);
        }
        else if(shooter.score>=800&&shooter.score<1000){
            if(flagSpeed1==0){
                defendersVelocity=2*defendersVelocity;
                flagSpeed1=1;
            }
        }
        if(shooter.score>1300){
            app.ticker.remove();
            app.stage.addChild(gameWinText);
            gameWinText.position.set(400 - gameWinText.width/2, 250);
        }
        if(Allien.level==1){
            killText.text = `Last Killed: A Noob :)`;
        }
        else if(Allien.level==2){
            killText.text = `Last Killed: A Pupil (ᵔᴥᵔ)`;
        }
        else if(Allien.level==3){
            killText.text = `Last Killed: A Specialist (¬‿¬)`;
        }
        else if(Allien.level==4){
            killText.text = `Last Killed: A Expert ◉_◉`;
        }
        else if(Allien.level==5){
            killText.text = `Last Killed: A Master  ♥‿♥`;
        }
        else if(Allien.level==6){
            killText.text = `Last Killed: A International Master ( ͡° ͜ʖ ͡°)`;
        }
        else if(Allien.level==7){
            killText.text = `Last Killed: A Grandmaster (▀̿Ĺ̯▀̿ ̿)`;
        }
    }

    if (Allien.x <= -90) {
      Allien.x = 1000;
      Allien.y = randomInt(0, app.stage.height - Allien.height );
    }
    
    if (Allien.x >= 1000) {
      Allien.visible = true;
      Allien.alpha = 1;
      Allien.attack=0;
    }
  });

  if (shooter.health <= 0) {
    shooter.health = 0; 
    state = GameOver;
  }

}
let flag_gameover=1;
function GameOver() {
    let name= localStorage.getItem('plane_shooter_name') ? localStorage.getItem('plane_shooter_name') : 'Anonymous';
    let highest_score = JSON.parse(localStorage.getItem('plane_shooter_highest_score') ? localStorage.getItem('plane_shooter_highest_score') : '0');
    if(highest_score<shooter.score){
        highest_score=shooter.score;
        localStorage.setItem('plane_shooter_highest_score', JSON.stringify(highest_score));
        console.log(highest_score);  
        highestScoreText.text = `Highest Score : ${JSON.parse(localStorage.getItem('plane_shooter_highest_score'))}`;
        
    }
    if(flag_gameover==1){
      flag_gameover=0;
      const sendHttpRequest = (method, url, data) => {
        return fetch(url, {
          method: method,
          body: JSON.stringify(data),
          headers: data ? { 'Content-Type': 'application/json' } : {}
        }).then(response => {
          if (response.status >= 400) {
            // !response.ok
            return response.json().then(errResData => {
              const error = new Error('Something went wrong!');
              error.data = errResData;
              throw error;
            });
          }
          return response.json();
        });
      };
      
      const sendData = () => {
        sendHttpRequest('POST', 'https://garvitchittora.pythonanywhere.com/list', {
          name: name ,
          score: highest_score
        })
          .then(responseData => {
            console.log(responseData);
          })
          .catch(err => {
            console.log(err, err.data);
          });
      };  
      sendData();
    } 
    

  app.ticker.remove();
  app.stage.addChild(gameOverText);
  gameOverText.position.set(400 - gameOverText.width/2, 250);
}

function GamePaused() {
  app.ticker.stop();
  PauseContainer.visible = true;
}

function handleGamePause(e) {
  if (e) e.target.blur();
  if(app.ticker.started) {
    if (e) e.target.textContent = 'START';
    app.ticker.stop();
  } else {
    if (e) e.target.textContent = 'PAUSE';
    app.ticker.start();
  }
};
 
function handleCircButtonPressed(e) {
  e.target.scale.set(1.2, 1.2);
  state = play;
  app.ticker.start();
  PauseContainer.visible = false;
}

let currentlyPressedKeys = {};
function handleKeyDown(e) {
    currentlyPressedKeys[e.keyCode] = true;
    if (e.keyCode == 32) {
      if(state != GamePaused){
        e.preventDefault();
        Bullets.addChild(renderBullet());
        bullet.x = shooter.x + shooter.width;
        bullet.y = shooter.y + 4*shooter.height/5+40;
      }
    } else if (e.keyCode == 80) {
      if(state != GamePaused){
        e.preventDefault();
        ( document.getElementsByClassName('pause')[0]).click();
      }
      
    }else if (e.keyCode == 66) {
      if(bomb>0){
        if(state != GamePaused){
          e.preventDefault();
          Bullets.addChild(renderBomb());
          bullet.x = shooter.x + shooter.width;
          bullet.y = shooter.y + shooter.height/2+30;
          bomb=bomb-1;
        }
        
      }
    }else if (e.keyCode == 78) {
      if(Laserbomb>0){
        if(state != GamePaused){
          e.preventDefault();
          Bullets.addChild(renderLaser());
          bullet.x = shooter.x + shooter.width;
          bullet.y = shooter.y + shooter.height/2+35;
          Laserbomb=Laserbomb-1;
        }
      }
    }
}

function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

function handleKeyButtons() {
  if(state != GamePaused){
    if (currentlyPressedKeys[74]) {
        // J
        if(shooter.vx >= 0.2) shooter.vx -= 0.1;
    }
    if (currentlyPressedKeys[76]) {
        // L
        if(shooter.vx <= shooterMaxVelocity) shooter.vx += 0.1;
    }
    if (currentlyPressedKeys[73]) {
        // I
        if(shooter.vy <= shooterMaxVelocity) shooter.vy += 0.1;
    }
    if (currentlyPressedKeys[75]) {
        // K
        if(shooter.vy >= 0.2) shooter.vy -= 0.1;
    }

    if (currentlyPressedKeys[87]) {
        // "W"
        shooter.y -= shooter.vy;
        if(shooter.y <= -50) shooter.y = -50;
    } 

    if (currentlyPressedKeys[83]) {
        // "S"
        shooter.y += shooter.vy;
        if(shooter.y >= 550-shooter.height) shooter.y = 550-shooter.height;
    } 

    if (currentlyPressedKeys[65]) {
        // "A"            
        shooter.x -= shooter.vx;
        if(shooter.x <= 0) shooter.x = 0;
    } 

    if (currentlyPressedKeys[68]) {
        // "D"            
        shooter.x += shooter.vx;
        if(shooter.x >= 1000-shooter.width) shooter.x = 1000-shooter.width;
    }
  }  
}

randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
