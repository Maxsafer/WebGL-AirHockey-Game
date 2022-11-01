// scene object variables
var renderer, scene, camera, pointLight, spotLight, listener, sound, sair, shit, shit2, slost, sminus, splus, swin, sbounce;

// field variables
var fieldWidth = 300, fieldHeight = 200;

// paddle variables
var paddleWidth, paddleHeight, paddleDepth, paddleQuality;
var paddle1DirY = 0, paddle2DirY = 0, paddle1DirX = 0, paddle2DirX = 0, paddleSpeed = 1.3;

// ball variables
var ball, paddle1, paddle2;
var ballDirX = 1, ballDirY = 1, ballSpeed = 1.5;
var animationCounter = 0;
var animationTeleport = 0;
var animationTeleportFlag = 0;

// score variables
var score1 = 0, score2 = 0;
var maxScore = 5;

// set opponent (0 = default, 1 = master of time and space, 2, 3)
var opponent = 1;

// set opponent reflexes (.05, .1)
var difficulty = .1;

function setup()
{
	// update the board to reflect the max score for match win
	document.getElementById("winnerBoard").innerHTML = "First to " + maxScore;
	
	// now reset player and opponent scores
	score1 = 0;
	score2 = 0;
	
	// set up all the 3D objects in the scene	
	createScene();
	
	// draw and set camera
	draw();
  cameraPhysics1();
}

function createScene()
{
	// set the scene size
	var WIDTH = 640,
	  HEIGHT = 360;

	// set some camera attributes
	var VIEW_ANGLE = 70,
	  ASPECT = WIDTH / HEIGHT,
	  NEAR = 0.1,
	  FAR = 10000;

	var c = document.getElementById("gameCanvas");

	// create a WebGL renderer, camera
	// and a scene
	renderer = new THREE.WebGLRenderer();
	camera =
	  new THREE.PerspectiveCamera(
		VIEW_ANGLE,
		ASPECT,
		NEAR,
		FAR);

	scene = new THREE.Scene();

	// add the camera to the scene
	scene.add(camera);
	
	// set a default position for the camera
	// not doing this somehow messes up shadow rendering
	camera.position.z = 320;

  listener = new THREE.AudioListener();
  camera.add(listener);

  listener2 = new THREE.AudioListener();
  camera.add(listener2);

  listener3 = new THREE.AudioListener();
  camera.add(listener3);

  // create a global audio source
  sound = new THREE.Audio(listener);
  // load a sound and set it as the Audio object's buffer
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load('sounds/song1.wav', function( buffer ) {
  	sound.setBuffer( buffer );
  	sound.setLoop(true);
  	sound.setVolume(0.5);
  	sound.play();
  });
  
  // create a global audio source
  sair = new THREE.Audio(listener2);
  // load a sound and set it as the Audio object's buffer
  const audioLoader2 = new THREE.AudioLoader();
  audioLoader.load('sounds/air.wav', function( buffer ) {
  	sair.setBuffer( buffer );
  	sair.setLoop(true);
  	sair.setVolume(0.2);
  	sair.play();
  });
  
  // create a global audio source
  shit = new THREE.Audio(listener3);
  // load a sound and set it as the Audio object's buffer
  const audioLoader3 = new THREE.AudioLoader();
  audioLoader.load('sounds/hit.wav', function( buffer ) {
  	shit.setBuffer( buffer );
  	shit.setLoop(false);
  	shit.setVolume(0.5);
  });

  // create a global audio source
  shit2 = new THREE.Audio(listener3);
  // load a sound and set it as the Audio object's buffer
  const audioLoader31 = new THREE.AudioLoader();
  audioLoader.load('sounds/hit2.wav', function( buffer ) {
  	shit2.setBuffer( buffer );
  	shit2.setLoop(false);
  	shit2.setVolume(0.5);
  });
  
  // create a global audio source
  slost = new THREE.Audio(listener);
  // load a sound and set it as the Audio object's buffer
  const audioLoader4 = new THREE.AudioLoader();
  audioLoader.load('sounds/lost.wav', function( buffer ) {
  	slost.setBuffer( buffer );
  	slost.setLoop(false);
  	slost.setVolume(1);
  });
  
  // create a global audio source
  sminus = new THREE.Audio(listener3);
  // load a sound and set it as the Audio object's buffer
  const audioLoader5 = new THREE.AudioLoader();
  audioLoader.load('sounds/minus.wav', function( buffer ) {
  	sminus.setBuffer( buffer );
  	sminus.setLoop(false);
  	sminus.setVolume(0.5);
  });
  
  // create a global audio source
  splus = new THREE.Audio(listener3);
  // load a sound and set it as the Audio object's buffer
  const audioLoader6 = new THREE.AudioLoader();
  audioLoader.load('sounds/plus.wav', function( buffer ) {
  	splus.setBuffer( buffer );
  	splus.setLoop(false);
  	splus.setVolume(0.5);
  });
  
  // create a global audio source
  swin = new THREE.Audio(listener);
  // load a sound and set it as the Audio object's buffer
  const audioLoader7 = new THREE.AudioLoader();
  audioLoader.load('sounds/win.wav', function( buffer ) {
  	swin.setBuffer( buffer );
  	swin.setLoop(false);
  	swin.setVolume(1);
  });

  // create a global audio source
  sbounce = new THREE.Audio(listener3);
  // load a sound and set it as the Audio object's buffer
  const audioLoader8 = new THREE.AudioLoader();
  audioLoader.load('sounds/bounce.wav', function( buffer ) {
  	sbounce.setBuffer( buffer );
  	sbounce.setLoop(false);
  	sbounce.setVolume(0.5);
  });
  
	// start the renderer
	renderer.setSize(WIDTH, HEIGHT);

	// attach the render-supplied DOM element
	c.appendChild(renderer.domElement);

	// set up the playing surface plane 
	var planeWidth = fieldWidth,
		planeHeight = fieldHeight,
		planeQuality = 15;
		
	// create the paddle1's material
	var paddle1Material =
	  new THREE.MeshPhongMaterial(
		{
		  color: 0x1F51FF,
      emissive: 'blue',
      emissiveIntensity: 0.3,
      reflectivity: 0.3,
      shininess: 300,
      envMap: 'reflection'
		});
	// create the paddle2's material
  switch (opponent) {
    case 0:
      var paddle2color = 0xFF3030;
      break;
    case 1:
      var paddle2color = 'white';
      break;
    case 2:
      var paddle2color = 'green';
      break;
    case 3:
      var paddle2color = 'black';
      break;
  }
	var paddle2Material =
	  new THREE.MeshLambertMaterial(
		{
		  color: paddle2color
		});
	// create the plane's material	
	var planeMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x2f7b9d,
      shininess: 300
		});
	// create the table's material
	var tableMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x002020,
      shininess: 300
		});
	// create the ground's material
	var groundMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0xFFFFFF,
      opacity: .0,
      transparent: true,
      shininess: 300
		});
	// create the playing surface plane
	var plane = new THREE.Mesh(
	  new THREE.PlaneGeometry(
		planeWidth,
		planeHeight,
		planeQuality,
		planeQuality),
	  planeMaterial);
	  
	scene.add(plane);
	plane.receiveShadow = true;	
	// create table
	var table = new THREE.Mesh(
	  new THREE.CubeGeometry(
		planeWidth * 1.03,
		planeHeight * 1.1,
		100,			
		planeQuality,
		planeQuality,
		1),
	  tableMaterial);
  
	table.position.z = -51;
	scene.add(table);
	table.receiveShadow = true;	
	// set up the Ring vars
	var innerRadius = .1,
		outerRadius = 8.5,
		thetaSegments = 10;
		
	// create the Pock material
	var sphereMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x002020,
      shininess: 300,
		});	

  // create the fx Pock material
	var sphereMaterial1 =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x002020,
      opacity: 0,
      transparent: true
		});	
  
  // ===================
	// Create a pock
	ball = new THREE.Mesh(
	  new THREE.CylinderGeometry(
		outerRadius, outerRadius, 10, 20, 10, false, 1, 10),
	  sphereMaterial);

	// add the pock to the scene
	scene.add(ball);
	ball.position.x = 0;
	ball.position.y = 0;
  ball.rotation.x = 80.11;
  
	// set pock above the table surface
	ball.position.z = -2;
	ball.receiveShadow = true;
  ball.castShadow = true;
  
  // ===================
	// Create an fx pock1
	ball1 = new THREE.Mesh(
	  new THREE.CylinderGeometry(
		outerRadius-2, outerRadius-2, 5, 20, 10, false, 1, 10),
	  sphereMaterial1);

	// add the pock to the scene
	scene.add(ball1);
	ball1.position.x = 0;
	ball1.position.y = 0;
  ball1.rotation.x = 80.11;
  
	// set pock above the table surface
	ball1.position.z = -2.4;
	ball1.receiveShadow = false;
  ball1.castShadow = false;
  
  // ===================
	// Create an fx pock2
	ball2 = new THREE.Mesh(
	  new THREE.CylinderGeometry(
		outerRadius-4, outerRadius-4, 5, 20, 10, false, 1, 10),
	  sphereMaterial1);

	// add the pock to the scene
	scene.add(ball2);
	ball2.position.x = 0;
	ball2.position.y = 0;
  ball2.rotation.x = 80.11;
  
	// set pock above the table surface
	ball2.position.z = -2.4;
	ball2.receiveShadow = false;
  ball2.castShadow = false;

  // ===================
	// Create an fx pock3
	ball3 = new THREE.Mesh(
	  new THREE.CylinderGeometry(
		outerRadius-6, outerRadius-6, 5, 20, 10, false, 1, 10),
	  sphereMaterial1);

	// add the pock to the scene
	scene.add(ball3);
	ball3.position.x = 0;
	ball3.position.y = 0;
  ball3.rotation.x = 80.11;
  
	// set pock above the table surface
	ball3.position.z = -2.4;
	ball3.receiveShadow = false;
  ball3.castShadow = false;

  // ===================
  // fx obj for opponent 1 Create an fx pock4
  ball4 = new THREE.Mesh(
    new THREE.CylinderGeometry(
    outerRadius, outerRadius, 5, 20, 10, false, 1, 10),
    paddle2Material);

  // add the pock to the scene
  scene.add(ball4);
  ball4.material = new THREE.MeshLambertMaterial({color: 'white',opacity: 0,transparent: true});
  ball4.position.x = 0;
  ball4.position.y = 0;
  ball4.rotation.x = 80.11;
  
  // set pock above the table surface
  ball4.position.z = -2.4;
  ball4.receiveShadow = false;
  ball4.castShadow = false;
  
  // ===================
  // mid circle
  midCirc = new THREE.Mesh(
	  new THREE.RingGeometry(
		29,
		30,
		15),
	  sphereMaterial);

	// add the midCirc to the scene
	scene.add(midCirc);
	midCirc.position.x = 0;
	midCirc.position.y = 0;
  
	// set midCirc above the table surface
	midCirc.position.z = innerRadius+1;
	midCirc.receiveShadow = true;
  midCirc.castShadow = false;
  
	// set up the paddle vars
	paddleWidth = 10;
	paddleHeight = 30;
	paddleDepth = 10;
	paddleQuality = 1;
  
  // Create a goal1
  goal1 = new THREE.Mesh(
	  new THREE.CubeGeometry(
		5,
		60,
		3,
		paddleQuality,
		paddleQuality,
		paddleQuality),
	  planeMaterial);

	// add the goal1 to the scene
	scene.add(goal1);
	goal1.receiveShadow = true;
  goal1.castShadow = true;
  
  // Create a goal2
  goal2 = new THREE.Mesh(
	  new THREE.CubeGeometry(
		5,
		50,
		5,
		paddleQuality,
		paddleQuality,
		paddleQuality),
	  planeMaterial);

	// add the goal2 to the scene
	scene.add(goal2);
	goal2.receiveShadow = true;
  goal2.castShadow = true;

   // Create goal2 frame
  goal2f = new THREE.Mesh(
	  new THREE.CubeGeometry(
		4,
		220,
		5,
		paddleQuality,
		paddleQuality,
		paddleQuality),
	  tableMaterial);

	// add the goal2 to the scene
	scene.add(goal2f);
	goal2f.receiveShadow = true;
  goal2f.castShadow = true;
  
  // Create a midLine
  midLine = new THREE.Mesh(
	  new THREE.CubeGeometry(
		1,
		200,
		1,
		paddleQuality,
		paddleQuality,
		paddleQuality),
	  tableMaterial);

	// add the midLine to the scene
	scene.add(midLine);
	midLine.receiveShadow = true;
  midLine.castShadow = false;
  
  // Create a paddle1
	paddle1 = new THREE.Mesh(
	  new THREE.SphereGeometry(
		paddleWidth,
		5,
		paddleDepth),
	  paddle1Material);

	// add the paddle1 to the scene
	scene.add(paddle1);
	paddle1.receiveShadow = true;
    paddle1.castShadow = true;

  // Create a paddle2
	paddle2 = new THREE.Mesh(
	  new THREE.SphereGeometry(
		paddleWidth,
		5,
		paddleDepth),
	  paddle2Material);
	  
	// add the paddle2 to the scene
	scene.add(paddle2);
	paddle2.receiveShadow = true;
  paddle2.castShadow = true;	
	
	// set paddles and goals on each side of the table
	paddle1.position.x = -fieldWidth/2 + paddleWidth + 0.5;
  goal1.position.x = -fieldWidth/2 - paddleWidth/2 + 2.5;
  
	paddle2.position.x = fieldWidth/2 - paddleWidth;
  goal2.position.x = fieldWidth/2 + paddleWidth/2;
  goal2f.position.x = fieldWidth/2 + paddleWidth/2;
	
	// lift paddles
	paddle1.position.z = 0;
	paddle2.position.z = 0;

  const geo = new THREE.BufferGeometry();
  
  // add a ground plane
	var ground = new THREE.Mesh(
	  new THREE.CubeGeometry( 
	  700, 
	  700, 
	  3, 
	  1, 
	  1,
	  1 ),
	  groundMaterial);
  
  // set ground to arbitrary z position to best show off shadowing
	ground.position.z = -132;
	ground.receiveShadow = true;	
	scene.add(ground);	
  
	// // create a point light
	pointLight =
	  new THREE.PointLight(0xFFFFFF);

	// set its position
	pointLight.position.x = 0;
	pointLight.position.y = 0;
	pointLight.position.z = 1;
	pointLight.intensity = 2.7;
	pointLight.distance = 10000;
	// add to the scene
	scene.add(pointLight);
		
	// add a spot light
	// this is important for casting shadows
  spotLight = new THREE.SpotLight(0xFAF7E3);
  spotLight.position.set(230, 0, 200);
  spotLight.intensity = 2;
  spotLight.castShadow = true;
  scene.add(spotLight);

  
	
	// MAGIC SHADOW CREATOR DELUXE EDITION with Lights PackTM DLC
	renderer.shadowMapEnabled = true;		
}

function draw()
{	
	// draw THREE.JS scene
	renderer.render(scene, camera);
	// loop draw function call
	requestAnimationFrame(draw);
  switch (opponent) {
    case 0:
      ballPhysics();
      opponentPaddleMovement();
      break;
    case 1:
      ballPhysics1();
      opponentPaddleMovement1();
      break;
    case 2:
      ballPhysics2();
      opponentPaddleMovement2();
      break;
    case 3:
      ballPhysics3();
      opponentPaddleMovement3();
      break;
  }
	paddlePhysics();
	playerPaddleMovement();
  if (opponent != 1){
   cameraPhysics(); 
  }
  if (animationCounter == 8)
  {
    animationCounter = 0;
  }
  if (animationTeleport == 61)
  {
    animationTeleportFlag = 0;
    animationTeleport = 0;
  }
  ballAnimation();
  teleportAnimation();
  animationCounter = animationCounter + 1;
  animationTeleport = animationTeleport + 1;
}

// fx animation for pock
function ballAnimation()
{
  if (animationCounter == 1)
  {
    ball1.material = new THREE.MeshLambertMaterial({color: 0x002020,opacity: .3,transparent: true});
    ball2.material = new THREE.MeshLambertMaterial({color: 0x002020,opacity: .1,transparent: true});	
    ball3.material = new THREE.MeshLambertMaterial({color: 0x002020,opacity: .5,transparent: true});	
    ball3.position.x = ball2.position.x;
    ball3.position.y = ball2.position.y;

    ball1.material = new THREE.MeshLambertMaterial({color: 0x002020,opacity: .1,transparent: true});
    ball2.material = new THREE.MeshLambertMaterial({color: 0x002020,opacity: .5,transparent: true});
    ball3.material = new THREE.MeshLambertMaterial({color: 0x002020,opacity: .3,transparent: true});	
    ball2.position.x = ball1.position.x;
    ball2.position.y = ball1.position.y;
    
    ball1.material = new THREE.MeshLambertMaterial({color: 0x002020,opacity: .5,transparent: true});
    ball2.material = new THREE.MeshLambertMaterial({color: 0x002020,opacity: .3,transparent: true});	
    ball3.material = new THREE.MeshLambertMaterial({color: 0x002020,opacity: .1,transparent: true});
    ball1.position.x = ball.position.x;
    ball1.position.y = ball.position.y;
  }
}

// fx animation for opponent 1 paddle
function teleportAnimation()
{
  if (animationTeleport == 0 && animationTeleportFlag == 1)
  {
    ball4.material = new THREE.MeshLambertMaterial({color: 'white',opacity: .5,transparent: true});
    ball4.scale.x = 1;
    ball4.scale.z = 1;
  }
  else if (animationTeleport == 20 && animationTeleportFlag == 1)
  {
    ball4.material = new THREE.MeshLambertMaterial({color: 'white',opacity: .3,transparent: true});
    ball4.scale.x = 2;
    ball4.scale.z = 2;
  }
  else if (animationTeleport == 40 && animationTeleportFlag == 1)
  {
    ball4.material = new THREE.MeshLambertMaterial({color: 'white',opacity: .1,transparent: true});
    ball4.scale.x = 3;
    ball4.scale.z = 3;
  }
  else if (animationTeleport == 50)
  {
    ball4.material = new THREE.MeshLambertMaterial({color: 'white',opacity: 0,transparent: true});
    animationTeleportFlag = 0;
  }
}

// default movement for the pock
function ballPhysics()
{
	// if ball goes off the 'left' side (Player's side)
	if (ball.position.x <= -fieldWidth/2 + 6 && ball.position.y >= -30 && ball.position.y <= 30)
	{	
		// CPU scores
		score2++;
    sminus.play();
		// update scoreboard HTML
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		// reset ball to center
		resetBall(2);
		matchScoreCheck();	
	}
  else if (ball.position.x <= -fieldWidth/2 + 6)
  {
    ballDirX = 1;
    sbounce.play()
  }
	
	// if ball goes off the 'right' side (CPU's side)
	if (ball.position.x >= fieldWidth/2 && ball.position.y >= -30 && ball.position.y <= 30)
	{	
		// Player scores
		score1++;
    splus.play();
		// update scoreboard HTML
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		// reset ball to center
		resetBall(1);
		matchScoreCheck();	
	}
  else if (ball.position.x >= fieldWidth/2)
  {
    ballDirX = -1;
    sbounce.play()
  }
	
	// if ball goes off the top side (side of table)
	if (ball.position.y <= -fieldHeight/2 + 5)
	{
		ballDirY = -ballDirY;
    sbounce.play()
	}	
	// if ball goes off the bottom side (side of table)
	if (ball.position.y >= fieldHeight/2 - 5)
	{
		ballDirY = -ballDirY;
    sbounce.play()
	}
	
	// update ball position over time
	ball.position.x += ballDirX * ballSpeed;
	ball.position.y += ballDirY * ballSpeed;
	
	// limit ball's y-speed
	// this is so the ball doesn't speed from left to right super fast
	// keeps game playable for humans
	if (ballDirY > ballSpeed * 1.05)
	{
		ballDirY = ballSpeed * 1.05;
	}
	else if (ballDirY < -ballSpeed * 1.05)
	{
		ballDirY = -ballSpeed * 1.05;
	}
}

// pock movement for the boss #1
function ballPhysics1()
{
	// if ball goes off the 'left' side (Player's side)
	if (ball.position.x <= -fieldWidth/2 + 6 && ball.position.y >= -30 && ball.position.y <= 30)
	{	
		// CPU scores
		score2++;
    sminus.play();
		// update scoreboard HTML
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		// reset ball to center
		resetBall(2);
		matchScoreCheck();	
	}
  else if (ball.position.x <= -fieldWidth/2 + 6)
  {
    ballDirX = 1;
    sbounce.play()
  }
	
	// if ball goes off the 'right' side (CPU's side)
	if (ball.position.x >= fieldWidth/2 && ball.position.y >= -30 && ball.position.y <= 30)
	{	
		// Player scores
		score1++;
    splus.play();
		// update scoreboard HTML
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		// reset ball to center
		resetBall(1);
		matchScoreCheck();	
	}
  else if (ball.position.x >= fieldWidth/2)
  {
    ballDirX = -1;
    sbounce.play()
  }
	
	// if ball goes off the top side (side of table)
	if (ball.position.y <= -fieldHeight/2 + 5)
	{
    if (ballDirX < 0){
      ball.position.y = fieldHeight/2 - 10;
      sbounce.play()
    }
    else{
      ballDirY = -ballDirY;
    }
	}	
	// if ball goes off the bottom side (side of table)
	if (ball.position.y >= fieldHeight/2 - 5)
	{
    if (ballDirX < 0){
      ball.position.y = ((fieldHeight/2)*-1)+10;
      sbounce.play()
    }
    else{
      ballDirY = -ballDirY;
    }
	}
	
	// update ball position over time
	ball.position.x += ballDirX * ballSpeed;
	ball.position.y += ballDirY * ballSpeed;
	
	// limit ball's y-speed
	// this is so the ball doesn't speed from left to right super fast
	// keeps game playable for humans
	if (ballDirY > ballSpeed * 1.05)
	{
		ballDirY = ballSpeed * 1.05;
	}
	else if (ballDirY < -ballSpeed * 1.05)
	{
		ballDirY = -ballSpeed * 1.05;
	}
}

// Handles default CPU paddle movement and logic
function opponentPaddleMovement()
{
	// Lerp towards the ball on the y plane
	paddle2DirY = (ball.position.y - paddle2.position.y) * difficulty;

	// in case the Lerp function produces a value above max paddle speed, we clamp it
	if (Math.abs(paddle2DirY) <= paddleSpeed)
	{	
		paddle2.position.y += paddle2DirY;
	}
	// if the lerp value is too high, we have to limit speed to paddleSpeed
	else
	{
		// if paddle is lerping in +ve direction
		if (paddle2DirY > paddleSpeed)
		{
			paddle2.position.y += paddleSpeed;
		}
		// if paddle is lerping in -ve direction
		else if (paddle2DirY < -paddleSpeed)
		{
			paddle2.position.y -= paddleSpeed;
		}
	}
	// We lerp the scale back to 1
	// this is done because we stretch the paddle at some points
	// stretching is done when paddle touches side of table and when paddle hits ball
	// by doing this here, we ensure paddle always comes back to default size
	paddle2.scale.y += (1 - paddle2.scale.y) * 0.2;	
}

// Handles CPU opponent 1 paddle movement and logic
function opponentPaddleMovement1()
{
	// Lerp towards the ball on the y plane
	paddle2DirY = (ball.position.y - paddle2.position.y) * difficulty;
	paddle2DirX = (ball.position.x - paddle2.position.x) * .1;
  
	// in case the Lerp function produces a value above max paddle speed, we clamp it
	if (Math.abs(paddle2DirY) <= paddleSpeed)
	{	
		paddle2.position.y += paddle2DirY;
	}
	// if the lerp value is too high, we have to limit speed to paddleSpeed
	else
	{
		// if paddle is lerping in +ve direction
		if (paddle2DirY > paddleSpeed)
		{
			paddle2.position.y += paddleSpeed;
		}
		// if paddle is lerping in -ve direction
		else if (paddle2DirY < -paddleSpeed)
		{
			paddle2.position.y -= paddleSpeed;
		}
	}
  
  // FOR VERTICAL MOVEMENT
  if (Math.abs(paddle2DirX) <= paddleSpeed && ball.position.x >= 0+fieldWidth/12){
    paddle2.position.x += paddle2DirX;
  }
  else
	{
		// if paddle is lerping in +ve direction
		if (paddle2DirX > paddleSpeed && ball.position.x >= 0+fieldWidth/12)
		{
			paddle2.position.x += paddleSpeed;
		}
		// if paddle is lerping in -ve direction
		else if (paddle2DirX < -paddleSpeed && ball.position.x >= 0+fieldWidth/12)
		{
			paddle2.position.x -= paddleSpeed;
		}
    else{
      paddle2.position.x = fieldWidth/3;
      paddle2.position.y = 0;
      animationTeleportFlag = 1;
      ball4.position.x = paddle2.position.x;
      ball4.position.y = paddle2.position.y;
    }
	}
	// We lerp the scale back to 1
	// this is done because we stretch the paddle at some points
	// stretching is done when paddle touches side of table and when paddle hits ball
	// by doing this here, we ensure paddle always comes back to default size
	paddle2.scale.y += (1 - paddle2.scale.y) * 0.2;	
}

// Handles player's paddle movement
function playerPaddleMovement()
{
	// move left
	if (Key.isDown(Key.A))		
	{
		// if paddle is not touching the side of table
		// we move
		if (paddle1.position.y < fieldHeight * 0.46)
		{
			paddle1DirY = paddleSpeed;
		}
		// else we don't move and stretch the paddle
		// to indicate we can't move
		else
		{
			paddle1DirY = 0;
			//paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
		}
    paddle1DirX = 0;
	}	
	// move right
	else if (Key.isDown(Key.D))
	{
		// if paddle is not touching the side of table
		// we move
		if (paddle1.position.y > -fieldHeight * 0.46)
		{
			paddle1DirY = -paddleSpeed;
		}
		// else we don't move and stretch the paddle
		// to indicate we can't move
		else
		{
			paddle1DirY = 0;
			//paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
		}
    paddle1DirX = 0;
	}
  // move up
	else if (Key.isDown(Key.W))		
	{
		// if paddle is not touching the side of table
		// we move
		if (paddle1.position.x < fieldWidth * -0.01)
		{
			paddle1DirX = paddleSpeed;
		}
		// else we don't move and stretch the paddle
		// to indicate we can't move
		else
		{
			paddle1DirX = 0;
			//paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
		}
    paddle1DirY = 0;
	}	
  // move down
	else if (Key.isDown(Key.S))
	{
		// if paddle is not touching the side of table
		// we move
		if (paddle1.position.x > -fieldWidth * 0.45)
		{
			paddle1DirX = -paddleSpeed;
		}
		// else we don't move and stretch the paddle
		// to indicate we can't move
		else
		{
			paddle1DirX = 0;
			//paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
		}
    paddle1DirY = 0;
	}
  // else don't move paddle
	else
	{
		// stop the paddle
		paddle1DirY = 0;
    paddle1DirX = 0;
	}
	paddle1.scale.x += (1 - paddle1.scale.x) * 0.2;	
	paddle1.scale.y += (1 - paddle1.scale.y) * 0.2;	
	paddle1.scale.z += (1 - paddle1.scale.z) * 0.2;	
	paddle1.position.y += paddle1DirY;
  paddle1.position.x += paddle1DirX;
}

// Handles camera and lighting logic
function cameraPhysics()
{	
  // we can easily notice shadows if we dynamically move lights during the game
	//spotLight.position.x = ball.position.x * 0.7;
	//spotLight.position.y = ball.position.y * 0.7;
  
	// move to behind the player's paddle
	//camera.position.x = paddle1.position.x-60;
	camera.position.y += (paddle1.position.y - camera.position.y) * 0.02;
	//camera.position.z = paddle1.position.z + 200 + 0.04 * (-ball.position.x + paddle1.position.x);
	
	// rotate to face towards the opponent
	camera.rotation.x = -0.01 * (ball.position.y) * Math.PI/180;
	camera.rotation.y = -45 * Math.PI/180;
	camera.rotation.z = -90 * Math.PI/180;
}

function cameraPhysics1()
{	
	// move to behind the player's paddle
	camera.position.x = paddle1.position.x-40;
	camera.position.y += (paddle1.position.y - camera.position.y) * 0.05;
	camera.position.z = paddle1.position.z + 150 + 0.04 * (-ball.position.x + paddle1.position.x);
	
	// rotate to face towards the opponent
	camera.rotation.x = -0.01 * (ball.position.y) * Math.PI/180;
	camera.rotation.y = -45 * Math.PI/180;
	camera.rotation.z = -90 * Math.PI/180;
}

// Handles paddle collision logic
function paddlePhysics()
{
	// PLAYER PADDLE LOGIC
	
	// if ball is aligned with paddle1 on x plane
	// remember the position is the CENTER of the object
	// we only check between the front and the middle of the paddle (one-way collision)
	if (ball.position.x <= paddle1.position.x + paddleWidth/2 &&  ball.position.x >= paddle1.position.x)
	{
		// and if ball is aligned with paddle1 on y plane
		if (ball.position.y <= paddle1.position.y + paddleHeight/2
		&&  ball.position.y >= paddle1.position.y - paddleHeight/2)
		{
			// and if ball is travelling towards player (-ve direction)
			if (ballDirX < 0)
			{
        shit.play();
				// stretch the paddle to indicate a hit
				paddle1.scale.y = 2;
				// switch direction of ball travel to create bounce
				ballDirX = -ballDirX;
				// we impact ball angle when hitting it
				// this is not realistic physics, just spices up the gameplay
				// allows you to 'slice' the ball to beat the opponent
				ballDirY -= paddle1DirY * ((Math.floor(Math.random() * (6 - (5))) + (5))*.1);
			}
		}
	}
	
	// OPPONENT PADDLE LOGIC	
	
	// if ball is aligned with paddle2 on x plane
	// remember the position is the CENTER of the object
	// we only check between the front and the middle of the paddle (one-way collision)
	if (ball.position.x <= paddle2.position.x + paddleWidth &&  ball.position.x >= paddle2.position.x - paddleWidth)
	{
		// and if ball is aligned with paddle2 on y plane
		if (ball.position.y <= paddle2.position.y + paddleHeight/2
		&&  ball.position.y >= paddle2.position.y - paddleHeight/2)
		{
			// and if ball is travelling towards opponent (+ve direction)
			if (ballDirX > 0)
			{
        shit2.play();
				// stretch the paddle to indicate a hit
				paddle2.scale.y = 2;
				// switch direction of ball travel to create bounce
				ballDirX = -ballDirX;
				// we impact ball angle when hitting it
				// this is not realistic physics, just spices up the gameplay
				// allows you to 'slice' the ball to beat the opponent
        tempRand = ((Math.floor(Math.random() * (6 - (1))) + (1))*.1);
				ballDirY += paddle2DirY * tempRand;
        if (tempRand <= .3)
        {
          startAngle = (Math.floor(Math.random() * (7 - (-7))) + (-7))*.1;
	        ballDirY += startAngle; 
        }
			}
		}
	}
}

function resetBall(loser)
{
	// position the ball in the center of the table
	
	// if player lost the last point, we send the ball to opponent
	if (loser == 1)
	{
    ball.position.x = 100;
	  ball.position.y = 0;
		ballDirX = -1;
	}
	// else if opponent lost, we send ball to player
	else
	{
    ball.position.x = -100;
	  ball.position.y = 0;
		ballDirX = 1;
	}
	
	// set the ball to move plane
  startAngle = (Math.floor(Math.random() * (10 - (-10))) + (-10))*.1;
	ballDirY = startAngle;
}

var bounceTime = 0;
// checks if either player or opponent has reached x points
function matchScoreCheck()
{
	// if player has x points
	if (score1 >= maxScore)
	{
		// stop the ball
		ballSpeed = 0;
		// write to the banner
		document.getElementById("scores").innerHTML = "You win!";		
		document.getElementById("winnerBoard").innerHTML = "Refresh to play again";
    sound.stop();
    sair.stop();
    swin.play()
	}
	// else if opponent has x points
	else if (score2 >= maxScore)
	{
		// stop the ball
		ballSpeed = 0;
		// write to the banner
		document.getElementById("scores").innerHTML = "You lost !";
		document.getElementById("winnerBoard").innerHTML = "Refresh to play again";
    sound.stop();
    sair.stop();
    slost.play()
	}
}