var JOGAR=1;
var ENCERRAR=0;
var estadoJogo=JOGAR;
var trex, trex_running, edges, trexMorto;
var groundImage,solo,soloinvisivel;
var nuvemng,grupodenuvens;
var caquito1,caquito2,caquito3,caquito4,caquito5,caquito6,grupodecaquitos;
var pontuacao=0;
var pterodactilo,pterodactiloimg;
var gameOver,restart,gameOverimg,restartimg;
var musicaMorte,musicajump,musicapontos;
var abaixar;

var mensagem="Hello World";


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  groundImage = loadImage("ground2.png");
  nuvemng=loadImage("cloud.png");
  caquito1=loadImage("obstacle1.png");
  caquito2=loadImage("obstacle2.png");
  caquito3=loadImage("obstacle3.png");
  caquito4=loadImage("obstacle4.png");
  caquito5=loadImage("obstacle5.png");
  caquito6=loadImage("obstacle6.png");
  pterodactiloimg=loadAnimation("pyt1.png","pyt2.png");
  trexMorto=loadImage("trex_collided.png");
  gameOverimg=loadImage("gameOver.png");
  restartimg=loadImage("restart.png");
 // musicaMorte=loadSound("die.mp3");
 // musicajump=loadSound("jump.mp3");
 // musicapontos=loadSound("checkPoint.mp3");
 abaixar=loadImage("abaixar 1.png");
}



function setup(){
  createCanvas(600,200);
  
  //criando o trex
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  edges = createEdgeSprites();
  trex.addImage("morto",trexMorto);
  trex.addImage("abaixando",abaixar);
  
  gameOver=createSprite(300,40,10,10);
  restart=createSprite(300,110,10,10);
  gameOver.addImage(gameOverimg);
  restart.addImage(restartimg);
  gameOver.visible=false;
  restart.visible=false;
  
  

  
  //adicione dimensão e posição ao trex
  trex.scale = 0.5;
  trex.x = 50;

  //sprite do solo
  solo=createSprite(200,180,400,20);
  solo.addImage("solo",groundImage);
  solo.x=solo.width/2;
  solo.velocityX=-4;

  //sprite do solo invisivel
  soloinvisivel=createSprite(200,200,400,20);
  soloinvisivel.visible=false;

  //criar grupo de obstaculos e nuvens
  grupodenuvens=new Group();
  grupodecaquitos=new Group();

  trex.setCollider("circle",0,0,40);
  trex.debug=true;

  console.log(mensagem);
 
}


function draw(){
  //definir a cor do plano de fundo 
  background("white");
  
   

  if(estadoJogo===JOGAR){

    pontuacao=pontuacao+Math.round(frameCount/60);
    if(pontuacao>0&&pontuacao%100===0){
     // musicapontos.play();
    }

    gerarCaquitos();

    gerarPterodactilo();

    //condicao para reseta o solo
    if(solo.x<0){
      solo.x=solo.width/2;
    }

    //pular quando tecla de espaço for pressionada
  if(keyDown("space")&&trex.y>=150){
   // musicajump.play();
    trex.velocityY = -8;
  }

  if (keyDown("down")){
    trex.changeAnimation("abaixando",abaixar);
  }
  else{
    trex.changeAnimation("running", trex_running);
  }

  //gravidade
  trex.velocityY = trex.velocityY + 0.5;

  gerarNuvem();

  if(grupodecaquitos.isTouching(trex)){
   // musicaMorte.play();
    estadoJogo=ENCERRAR;


  }
  }

  else if(estadoJogo===ENCERRAR){

    gameOver.visible=true;
    restart.visible=true;
    trex.velocityY=0;
    trex.changeAnimation("morto", trexMorto);

    solo.velocityX=0;
    grupodenuvens.setVelocityXEach(0);
    grupodecaquitos.setVelocityXEach(0);
    grupodenuvens.setLifetimeEach(-1);
    grupodecaquitos.setLifetimeEach(-1);

    if (mousePressedOver(restart)){
      resetar();

    }

  


  }

  text("pontuação"+pontuacao,500,20);

  
 //impedir que o trex caia
  trex.collide(soloinvisivel);
  
  
  drawSprites();
}

function resetar(){
  estadoJogo=JOGAR;
  gameOver.visible=false;
  restart.visible=false;
  grupodecaquitos.destroyEach();
  grupodenuvens.destroyEach();
  trex.changeAnimation("running", trex_running);
  pontuacao=0;
}

function gerarNuvem(){
  
  if (frameCount %60===0){
    var nuvem=createSprite(600,50,20,20);
    nuvem.velocityX=-3;
    nuvem.addImage(nuvemng);
    nuvem.y=Math.round(random(30,100));

    //ajustar a profundidadde do trex
    nuvem.depth=trex.depth;
    trex.depth=trex.depth+1

    //tempo de duracao das nuvens
    nuvem.lifetime=200;

    //adicionar cada obstaculo ao grupo
    grupodenuvens.add(nuvem);
  }
}
function gerarCaquitos(){

  if (frameCount %60===0){
    var caquito=createSprite(600,168,20,20);
    caquito.velocityX=-5;
    
    // gerar caquito de forma aleatoria
    var rand=Math.round(random(1,6));
    switch(rand){
      case 1:caquito.addImage(caquito1);
        break;
      case 2:caquito.addImage(caquito2);
        break;
      case 3:caquito.addImage(caquito3);
        break;
      case 4:caquito.addImage(caquito4);
        break;
      case 5:caquito.addImage(caquito5);
        break;
      case 6:caquito.addImage(caquito6);
        break;
        default:break
    }
    caquito.scale=0.4;
    caquito.lifetime=120;

    //adicionar ao grupo de caquitos
    grupodecaquitos.add(caquito);
  }

}
function gerarPterodactilo(){
  if(frameCount %60===0){
    pterodactilo=createSprite(600,50,20,20);
    pterodactilo.velocityX=-3;
    pterodactilo.addAnimation("voando",pterodactiloimg);
    pterodactilo.y=Math.round(random(30,100));
    pterodactilo.lifetime=200;
    pterodactilo.scale=0.5;
  }
  

}


