var database;
var dog;
var normalDog;
var happyDog;
var foodS,foodStock;
var feedPet,addFood;
var fedTime,lastFed;
var foodObj;
var input,button;


function preload()
{
  //load images here
  normalDog = loadImage("images/Dog.png");
  happyDog = loadImage("images/dog2.png");
}

function setup() {
  database = firebase.database();

  createCanvas(950,500);
  
  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  dog = createSprite(800,300,10,10);
  dog.addImage(normalDog);
  dog.scale = 0.2;
  
  feedPet = createButton("Feed The Dog");
  feedPet.position(700,95);
  feedPet.mousePressed(feedDog);

  addFood = createButton("Add Some Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  input = createInput('Name');
  input.position(430,450);

  button = createButton("ENTER");
  button.position(482.5,480);

  var dogName = createElement('h4');

  button.mousePressed(function()
  {
    var name = input.value();
    fill("white");
    dogName.html("Dog's Name: " +name);
    dogName.position(1050,220);
    input.hide();
    button.hide();
  })
}

function draw() {  
  background(46,139,87);

  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data)
  {
    lastFed = data.val();
  });

  fill(255,255,254);
  textSize(15);

  if(lastFed >= 12)
  {
    text("Last Fed: " +lastFed%12+ "PM",460,30);
  }
  else if(lastFed == 0)
  {
    text("Last Fed: 12 AM",460,30);
  }
  else
  {
    text("Last Fed: " +lastFed+ "AM",460,30);
  }

  drawSprites();
  //add styles here
  //textSize(15);
  //fill("white");
  //text("Milk Remaining: "+foodS,185,400);
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

/*function writeStock(x){
  if(x <= 0)
  {
    x = 0;
  }
  else
  {
    x = x - 1;
  }
  database.ref('/').update({
    Food:x
  })
}*/

function feedDog()
{
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update
  ({
     Food: foodObj.getFoodStock(),
     FeedTime: hour()
  })
}

function addFoods()
{
  foodS++;
  database.ref('/').update
  ({
     Food: foodS
  })
}