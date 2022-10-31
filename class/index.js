let tX = 375;//translateX
let tY= 465;//translateY
let pX=0;//playerX
let sY= 150;//shieldY
let speed=3;//speed of the player
let analog=0;

function player(){
  fill(0,255,0);
  translate(pX,250);
  plane(50,50);
  translate(-pX,-250);
}

function controls(){
  if(keyIsDown(LEFT_ARROW)){
    pX -= speed;
  }
  if(keyIsDown(RIGHT_ARROW)){
    pX += speed;
  }
}

function shield(num){
  fill(0,255,0);
  
  plane(50,50);
}

function setup(){
  createCanvas(750,500,WEBGL);
};

function draw(){
  background(155);
  noStroke();
  //translate(tX-width/2,tY-height/2);
  //fill(175);
  //box(800,500,50);
  controls();
  player();
  shield(5);
};