
//canvas stuff
let canvas = document.getElementById("Canvas");
let ctx = canvas.getContext('2d');
let CanvasWidth = 1000
let CanvasHeight = 1000

//tile stuff
let originalTileSize = 50; 
let scrollP = 1; 
let Tile_Size = originalTileSize*scrollP 

//amount of tiles is cols*rows or just x^2 x being either cols or rows bc it is a square
let cols = 50
let rows = 50


let Tiles = []

let ItemSelected = null

let angle = 0

let cash = 1000;
let CashTextBox = document.getElementById('cashText');


//Shop items
const ShopItems = [
    {
        Name: "test_machine",
        displayName: "Test generator",
        Price: 10,
        Id:1,
    },
    {
        Name: "pipe",
        displayName: "Pipe",
        Price: 10,
        Id:2,
    },
    {
        Name: "pipe_turn",
        displayName: "Pipe Turn",
        Price: 10,
        Id:3,
    },
     {
        Name: "fluid_tank",
        displayName: "Fluid Tank",
        Price: 10,
        Id:4,
    },
     {
        Name: "smelter",
        displayName: "Smelter",
        Price: 10,
        Id:5,
    },
     {
        Name: "glass_molder",
        displayName: "Glass Molder",
        Price: 10,
        Id:6,
    },
    {
        Name: "digger",
        displayName: "Digger",
        Price: 10,
        Id:7,
    },
    {
        Name: "bucket",
        displayName: "Bucket",
        Price: 0,
        Id:8,
    },
     {
        Name: "shovel",
        displayName: "Shovel",
        Price: 0,
        Id:9,
    },
    {
        Name: "test",
        displayName: "Tile Info Tool",
        Price: 0,
        Id:10,
    },
    {
        Name: "sell_machine",
        displayName: "Sell Device",
        Price: 10,
        Id:11,
    },
 
];

const MachineInstructions = {
    test_machine : {
        'Name': 'test_machine',
        'RecipeMachine':false, 
        'Farm': 'water',
        'Amount':1,
        'When': 1, //after how many sec
        'HasInput':false,
        'MaxInventory': 10

    },
    digger : {
        'Name': 'digger',
        'RecipeMachine':false, 
        'Farm': 'sand',
        'Amount':1,
        'When': 1, //after how many sec
        'HasInput':false,
        'MaxInventory': 10

    },  
    smelter : {
        'Name': 'smelter',
        'RecipeMachine':true, 
        'Farm': null,
        'Amount': 0,
        'When': 0, //after how many sec
        'HasInput':true,
        'MaxInventory': 10
    },
     glass_molder : {
        'Name': 'glass_molder',
        'RecipeMachine':true, 
        'Farm': null,
        'Amount': 0,
        'When': 0, //after how many sec
        'HasInput':true,
        'MaxInventory': 10
    },
}

const containers = {
    pipe :{
        'Name':'pipe',
        'MaxInventory':10,
        'TypeInputed': null,
        'Turn':false
    },
    pipe_turn :{
        'Name':'pipe',
        'MaxInventory':10,
        'TypeInputed': null,
        'Turn':true
    },
    fluid_tank: {
        'Name':'pipe',
        'MaxInventory':100,
        'TypeInputed': 'fluid',
        'Turn':false
    },
    smelter :{
        'Name':'smelter',
        'MaxInventory':10,
        'TypeInputed': 'smelter',
        'Turn':false
    },
    glass_molder :{
        'Name':'smelter',
        'MaxInventory':10,
        'TypeInputed': 'glass_molder',
        'Turn':false
    },
    sell_machine : {
       'Name':'sell_machine',
        'MaxInventory':5,
        'TypeInputed': null,
        'Turn':false 
    }
}

const opposites = {
    'right':'left',
    'left':'right',
    'bottom':'top',
    'top':'bottom'
}


const Straightdirections = {
  0 : {
        input:'top',
        output:'bottom',
    },
    90 : {
        input:'left',
        output:'right',
    },
    180 : {
        input:'top',
        output:'top',
    },
     270 : {
        input:'right',
        output:'left',
    },
    360  : {
        input:'top',
        output:'bottom',
    },
};

const Turndirections = {
  0:   { input: 'top',    output: 'left' },
  90:  { input: 'left',   output: 'bottom' },
  180: { input: 'bottom', output: 'right' },
  270: { input: 'right',  output: 'top' },
  360:   { input: 'top',    output: 'left' },
};


const types = {
    fluid:[
        'molten_glass',
        'water',
    ],
    item:[
        'sand',
        'glass',
    ],
    gas:[],

    smelter: [
        'sand'
    ],
    glass_molder: [
        'molten_glass'
    ]
}

const sellValues = {
    water: 1,
    molten_glass: -10,
    sand: 3,
    glass: 100,
};

const recipes = {
    sand_to_glass :{
        machineFor: 'smelter',
        inputRecipe: {
           item: 'sand',
           amount: 1
        },
        outputRecipe: {
           item: 'molten_glass',
           amount: 1
        }
    },
    molten_glass :{
        machineFor: 'glass_molder',
        inputRecipe: {
           item: 'molten_glass',
           amount: 1
        },
        outputRecipe: {
           item: 'glass',
           amount: 1
        }
    }
}


const placementConditions  = {
    test_machine:{
        'blacklist': ['water']
    },
    pipe:{
        'blacklist': ['water']
    },
    pipe_turn:{
        'blacklist': ['water']
    },
    fluid_tank:{
        'blacklist': ['water']
    },
     digger:{
        'blacklist': ['water','grass','dirt','pipe','fluid_tank','pipe_turn']
    },
    smelter:{
        'blacklist': ['water']
    },
    glass_molder:{
        'blacklist': ['water']
    },
    sell_machine:{
        'blacklist': ['water']
    },
}

const tools = ['shovel', 'test', 'bucket'];


const TilesWithImages = [
    'grass',
    'water',
    'test_machine',
    'pipe',
    'fluid_tank',
    'pipe_turn',
    'bucket',
    'shovel',
    'sand',
    'dirt',
    'digger',
    'test',
    'smelter',
    'sell_machine',
    'glass_molder'
];

const Images = {};

for (const name of TilesWithImages) {
        const img = new Image();
        img.src = `images/${name}.png`;
        Images[name] = img;
}


function preloadImages(names, onComplete) {
    let loaded = 0;
    const total = names.length;

    for (const name of names) {
        const img = new Image();
        img.src = `images/${name}.png`;

        img.onload = () => {
            loaded++;
            if (loaded === total) {
                onComplete(); // All images are ready
            }
        };

        img.onerror = () => {
            console.warn(`Failed to load image: ${name}`);
            loaded++;
            if (loaded === total) {
                onComplete(); // Proceed even if some fail
            }
        };

        Images[name] = img;
    }
}


//functions
function drawTile(x,y,type,degrees){
    if(typeof x !== 'number' || typeof y !== 'number' || typeof Tile_Size !== 'number') {
        console.log('failed to draw a tile, number values not provided')
        return;
    } 
   
    const img = Images[type]
    if(img && img.complete === true){
        ctx.save(); // save the current canvas state
        ctx.translate(x + Tile_Size / 2, y + Tile_Size / 2); // move to the center of the image
        ctx.rotate(degrees*(Math.PI / 180)); // rotate the canvas
        ctx.drawImage(img, -Tile_Size / 2, -Tile_Size / 2, Tile_Size, Tile_Size); // draw the image centered
        ctx.restore()
        // ctx.drawImage(img, x, y, Tile_Size, Tile_Size);
    } else{
        ctx.beginPath();
        ctx.fillStyle = 'grey';
        ctx.rect(x, y, Tile_Size, Tile_Size);
        ctx.fill();    
        ctx.stroke();
    }
}

function drawMachine(x,y,machine,degrees){
    if(typeof x !== 'number' || typeof y !== 'number' || typeof Tile_Size !== 'number') {
        console.log('failed to draw a tile, number values not provided')
        return;
    } 
   
    const img = Images[machine]
    if(img && img.complete === true){
        ctx.save(); // save the current canvas state
        ctx.translate(x + Tile_Size / 2, y + Tile_Size / 2); // move to the center of the image
        ctx.rotate(degrees*(Math.PI / 180)); // rotate the canvas
        ctx.drawImage(img, -Tile_Size / 2, -Tile_Size / 2, Tile_Size, Tile_Size); // draw the image centered
        ctx.restore()
        // ctx.drawImage(img, x, y, Tile_Size, Tile_Size);
    } else{
        ctx.beginPath();
        ctx.fillStyle = 'grey';
        ctx.rect(x, y, Tile_Size, Tile_Size);
        ctx.fill();    
        ctx.stroke();
    }
}
var Max = 100
var Min = 1
let setseed = Math.floor(Math.random() * (Max - Min + 1)) + Min; //random seed
function generateMap(inputedSeed) {
        Tiles = [] 
          if (inputedSeed != null ||inputedSeed != undefined ) setseed = inputedSeed; 
          noise.seed(setseed); 
          const scale = 0.15
          console.log('seed is',setseed)

         for (let y = 0; y <cols; y++) {
            const row = []
            for (let x = 0; x <rows; x++) {
                 var tx = x*Tile_Size
                 var ty = y*Tile_Size
                 const value = noise.perlin2(x * scale, y * scale);
                 const normalized = (value + 1) / 2; // convert from [-1,1] to [0,1]

                 let TileType 

                 if (normalized < 0.35) {
                    TileType = 'water';   // pond
                } else if (normalized < 0.42) {
                    TileType = 'sand';    // beach
                } else{
                    TileType = 'grass';   // land
                }
                
               
                row.push({x: tx,y: ty,type: TileType, inventory:{amount:0,item:null},timer:0,output:null,input:null,degrees:0,machine:null, inventory2 :{active:false,item:null,amount:null}});
                drawTile(tx,ty,TileType)
            }
            Tiles.push(row);
        }
       
}

function Init(){
    generateMap();
}

let camera = {
  x: 0,
  y: 0  ,
  width: canvas.width,
  height: canvas.height
};

let startCol = Math.floor(camera.x / Tile_Size);
let endCol = Math.ceil((camera.x + camera.width) / Tile_Size);

let startRow = Math.floor(camera.y / Tile_Size);
let endRow = Math.ceil((camera.y + camera.height) / Tile_Size);

let offsetX = -camera.x + startCol * Tile_Size;
let offsetY = -camera.y + startRow * Tile_Size;


function RenderTiles() {
    ctx.clearRect(0,0,CanvasWidth,CanvasHeight)
    startCol = Math.floor(camera.x / Tile_Size);
    endCol = Math.ceil((camera.x + camera.width) / Tile_Size);

    startRow = Math.floor(camera.y / Tile_Size);
    endRow = Math.ceil((camera.y + camera.height) / Tile_Size);

    offsetX = -camera.x + startCol * Tile_Size;
    offsetY = -camera.y + startRow * Tile_Size;

    for (let c = startCol; c < endCol; c++) {
        for (let r = startRow; r < endRow; r++) {
            const tile = Tiles[c]?.[r];
            if (tile !== undefined) {
                const x = (c - startCol) * Tile_Size + offsetX;
                const y = (r - startRow) * Tile_Size + offsetY;
                drawTile(x, y, tile.type, tile.degrees);
                if(tile.machine) {
                    drawMachine(x, y, tile.machine, tile.degrees);
                }
            }
        }
    }
}

function RedrawGrid() { //this draws the grid according to the already generated stuff
   RenderTiles();
}

function tileExists(x, y) {
    if (y >= 0 && y < Tiles.length &&Tiles[y] &&x >= 0 && x < Tiles[y].length &&Tiles[y][x]) {
        return true;
    } else {
        return false;
    }
}

function AdjacentTiles(x,y) {
    let TilesNearby = [];

    TilesNearby.push({
        'left':{X:x-Tile_Size,Y:y},
        'right':{X:x+Tile_Size,Y:y},
        'bottom':{X:x,Y:y-Tile_Size},
        'top':{X:x,Y:y+Tile_Size}
    });

    return TilesNearby;
}

function getTile(x, y) {
    return Tiles[x][y]
}

function sellMachine(Tile) {
   let itemToBeSold = Tile.inventory.item
   if(itemToBeSold in sellValues) {
    if ( Tile.inventory.item && Tile.inventory.amount > 0) {
        Tile.inventory.amount -= 1
        cash += sellValues[itemToBeSold]
        console.log('Just sold:',Tile.inventory.item, 'For ',sellValues[itemToBeSold],' dollars')
        if (Tile.inventory.amount == 0) Tile.inventory.item = null;
    }
   } 
}

function craft(){
     return; //this is not used yet but will be used in the future
}

//turns one item into another
function process(Currentmachine,inv) {
    if (Currentmachine.inventory2.active == false) return;
    for (let key in recipes) {
        const recipe = recipes[key];
        if (recipe.machineFor == Currentmachine.machine) {
            if(Currentmachine.inventory.item == recipe.inputRecipe.item){
                if(Currentmachine.inventory.amount >= 1 && Currentmachine.inventory2.amount < containers[Currentmachine.machine].MaxInventory) {
                  Currentmachine.inventory.amount -= 1
                  Currentmachine.inventory2.item =  recipe.outputRecipe.item
                  Currentmachine.inventory2.amount +=1
                  if (Currentmachine.inventory.amount <= 1) Currentmachine.inventory.item = null;
                }
            } 
        }
    }
}

//these are inventories
function doTransfer(dest,source,Amount) {
    if (source.amount >= Amount  && dest.inventory.amount < containers[dest.machine].MaxInventory ) { 
      dest.inventory.amount+=Amount
      source.amount -= Amount
      dest.inventory.item = source.item
    if(source.amount == 0) source.item = null;
    }
}

function transferInventorys(Ax,Ay,Bx,By, Amount){
    //if both tiles exist then move on
    if(tileExists(Ax,Ay)&& tileExists(Bx,By)){
        let Destination = Tiles[By][Bx]
        let Inputer = Tiles[Ay][Ax]

        let inventory2State = Inputer.inventory2.active

        let SpecificType = false

        if(containers[Destination.machine]) {
            SpecificType = containers[Destination.machine].TypeInputed ?? false;
        }

        //if there is no input then cancel the function
        if(Destination.input == null) return;
        if(Inputer.output == null) return;
      
        checkIfTransfer(Amount,Destination,Inputer,inventory2State, SpecificType)

    } 
}

function checkIfTransfer(Amount, Destination, Inputer, AltInventory, specific){
    var DestinationHasAItem = Destination.inventory.item ?? false;
    //not a container
    var IsAMachine = MachineInstructions[Destination.machine] ?? false;
    var MachineWithOutput = false
    if (IsAMachine) {if(MachineInstructions[Destination.machine].HasInput == true) {MachineWithOutput = true;} }


    //set the inv being used
    var inv = null;
    if(AltInventory) inv = Inputer.inventory2; else if (AltInventory == false)  inv = Inputer.inventory;
    if (inv == null) return;
   
    if (specific) {
        if (DestinationHasAItem) {
            if (DestinationHasAItem == inv.item) {
                 doTransfer(Destination,inv,Amount)
            }
        } else if (DestinationHasAItem == false) {
            if (types[containers[Destination.machine].TypeInputed].includes(inv.item)) {
                 doTransfer(Destination,inv,Amount)
            }
        }
    } else {
        if (DestinationHasAItem) {
            if (DestinationHasAItem == inv.item) {
                 doTransfer(Destination,inv,Amount)
            }
        } else if (DestinationHasAItem == false) {
            doTransfer(Destination,inv,Amount)
        }
    }
   
}

//Keyboard controls
document.addEventListener('keydown', function(event) {
   if(event.key === 'r' || event.key === 'R') {
        if(ItemSelected){
            if(angle != 360){
                angle+=90
            } else{angle=0}
        }
   }
   
   if(camera.y > -200 && camera.y < 4200) {
    if(event.key === 'w' || event.key === 'W') {
       camera.y -= Tile_Size
       console.log('camera y',camera.y)
   } else if(event.key === 's' || event.key === 'S') {
      camera.y += Tile_Size
      console.log('camera y',camera.y)
   }
   }


   if(camera.x > -200 && camera.x < 4200) {
        if(event.key === 'd' || event.key === 'D') {
            camera.x += Tile_Size
            console.log('camera x',camera.x)
   } else if(event.key === 'a' || event.key === 'A') {
            camera.x -= Tile_Size
            console.log('camera x',camera.x)
   }
   }



});

// for placement of tiles (in the future)
let HoveredTileX = null
let HoveredTileY = null
canvas.addEventListener('mousemove',function(event) {
    let rect = canvas.getBoundingClientRect() //This has to be done bc sometimes the canvas is in the middle other times not so we adjust it
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;

    let tileX = Math.floor(mouseX/Tile_Size) 
    let tileY = Math.floor(mouseY/Tile_Size) 
    
    if (tileX >= 0 && tileX < CanvasWidth / Tile_Size &&tileY >= 0 && tileY < CanvasHeight / Tile_Size) {
       HoveredTileX = tileX
       HoveredTileY = tileY
    } 
})

//detects clicking on tile
canvas.addEventListener('mousedown', function(event) {
    const rect = canvas.getBoundingClientRect() //This has to be done bc sometimes the canvas is in the middle other times not so we adjust it
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top

    let CameraTileX = Math.floor(camera.x / Tile_Size); 
    let CameraTileY = Math.floor(camera.y / Tile_Size)
    
    console.log('camera x',CameraTileX)
    console.log('camera y',CameraTileY)
    
    const tileX = Math.floor((mouseX / Tile_Size) + CameraTileX); //Calculate the tile position based on the mouse position and camera offset
    const tileY = Math.floor((mouseY /Tile_Size) + CameraTileY); //Calculate the tile position based on the mouse position and camera offset

    if (tileExists(tileX, tileY)) {
        if(ItemSelected != null){
            if(tools.includes(ItemSelected) ) {
                if(ItemSelected == 'test'){
                    console.log(getTile(tileX,tileY))
                }else if(ItemSelected == 'bucket'){
                    if(getTile(tileX,tileY).type == 'water'){
                        getTile(tileX,tileY).type = 'sand'
                    }
                } else if(ItemSelected == 'shovel'){
                    if(getTile(tileX,tileY).type == 'grass'){
                        getTile(tileX,tileY).type = 'dirt'
                }}
            } else if(getTile(tileX,tileY)) {
                if (placementConditions[ItemSelected] != undefined && placementConditions[ItemSelected] .blacklist){
                for(let n = 0; n < placementConditions[ItemSelected].blacklist.length; n++) {
                    if(getTile(tileX,tileY).type ==  placementConditions[ItemSelected].blacklist[n] ){
                        console.warn('cant place')
                        return
                    }
                }}
                if(containers[ItemSelected] && containers[ItemSelected].Turn == false ){
                    getTile(tileX,tileY).output = Straightdirections[angle].output
                    getTile(tileX,tileY).input = Straightdirections[angle].input
                } else {
                    if(containers[ItemSelected] && containers[ItemSelected].Turn == true){
                        getTile(tileX,tileY).output = Turndirections[angle].output
                        getTile(tileX,tileY).input = Turndirections[angle].input
                    } else {
                        if(MachineInstructions[ItemSelected]) {
                        if(MachineInstructions[ItemSelected].HasInput == false){
                           getTile(tileX,tileY).output = Straightdirections[angle].output
                        } else{
                             getTile(tileX,tileY).output = Straightdirections[angle].output
                            getTile(tileX,tileY).input = Straightdirections[angle].input
                        }
                    }
                    }
                }
                getTile(tileX,tileY).machine = ItemSelected
                getTile(tileX,tileY).degrees = angle
                ItemSelected = null
                angle = 0
            } 
        }
        
    } 
});

let LastTime = performance.now();
function tick(currentTime) {
    let deltatime = (currentTime - LastTime) / 1000; //delta time meaning most accurate time
    LastTime = currentTime;
    CashTextBox.textContent = "Money: " + cash;
    
    for (let y = 0; y < Tiles.length; y++) {
        for (let x = 0; x < Tiles[y].length; x++) {
            var Tile = getTile(x,y)
            if(MachineInstructions[Tile.machine] != undefined){
                if(MachineInstructions[Tile.machine].RecipeMachine == false){
                    Tile.timer = (Tile.timer || 0) + deltatime;
                    if(Tile.timer>= MachineInstructions[Tile.machine].When){
                    Tile.timer = 0
                     if(Tile.inventory.item == null){
                    Tile.inventory.item = MachineInstructions[Tile.machine].Farm
                 } else if(Tile.inventory.amount < MachineInstructions[Tile.machine].MaxInventory ){
                      Tile.inventory.amount+= MachineInstructions[Tile.machine].Amount
                 }
               }
                } else{
                    process(Tile)
                     Tile.inventory2.active = true
                }
            }

            if(Tile.machine == containers.sell_machine.Name) {
                sellMachine(Tile)
            }

            //transfer stuff
            if(Tile.output != null) {
                var opposite = opposites[Tile.output]
                const NearbyTiles = AdjacentTiles(Tile.x,Tile.y)
                var dy= Math.floor(NearbyTiles[0][opposite].Y/Tile_Size) //Convert to tile coords
                var dx = Math.floor(NearbyTiles[0][opposite].X/Tile_Size)
                if(NearbyTiles[0][opposite] && tileExists(dx,dy)){
                    transferInventorys(Math.floor(Tile.x/Tile_Size),Math.floor(Tile.y/Tile_Size),dx,dy,1)
                } else{
                    // forbidden error i accutalty do know what can cause it and its if its looking for a pixel out of range meaning not on the screen
                    console.warn('i dont know what fucking error to put here but something went wrong')
                }

            }
        }
    }  

    RedrawGrid()
     if (HoveredTileX !== null && HoveredTileY !== null ) {
        if(ItemSelected == 'bucket'){
            ctx.globalAlpha = 0.5;
            drawTile(HoveredTileX * Tile_Size, HoveredTileY * Tile_Size, ItemSelected, angle);
            ctx.globalAlpha = 1;
        } else{
            ctx.globalAlpha = 0.5;
            drawTile(HoveredTileX * Tile_Size, HoveredTileY * Tile_Size, ItemSelected, angle);
            ctx.globalAlpha = 1;
        }
    }
    requestAnimationFrame(tick)
}

preloadImages(TilesWithImages, () => {
    console.log("All images loaded.");
    Init(); 
});

requestAnimationFrame(tick)

function setCutstomSeed() {
    let input = prompt('Input a seed for the map generation')
    if(input != null) {
        generateMap(input)
        confirm('seed set to ' + input)
    } else{
        console.warn('no seed provided')
    }
}

function saveData() {
    localStorage.clear()
    var data = {
        TileData :  JSON.stringify(Tiles),
        CashData : cash
    }
    localStorage.setItem('gameData', JSON.stringify(data));
    confirm('saved current data')
}

function loadData(InputedData) {
    if(InputedData != null) return;
    var data;
     if(localStorage.getItem('gameData') === null ) {
           return
    } else {

        data = JSON.parse(localStorage.getItem('gameData'))
        
        cash = data.CashData
        Tiles = JSON.parse(data.TileData)
        
    }
}

function buyItem(itemName) {
   if (!itemName) {
     console.warn('No item name provided') 
     return; 
   }
    const item = ShopItems.find(i => i.Name === itemName);
    if (!item) {
        console.warn('Item not found in shop');
        return;
    } else if (cash >= item.Price) {
        cash -= item.Price;
        ItemSelected = item.Name; // Set the selected item to the one purchased
        console.log(`Bought ${item.displayName} for $${item.Price}. Remaining cash: $${cash}`);
    } else {
        console.warn('Not enough cash to buy this item');
    }
   
}

function shop(){
    const shopContainer = document.getElementById("Shop");
    shopContainer.innerHTML = ''; // clear existing buttons

    ShopItems.forEach(item => {
        const button = document.createElement("button");
        button.className = "shop-button";
        button.id = 'jobs'

        button.innerHTML = `
           <br> ${item.displayName}<br>$${item.Price}
        `;

        button.onclick = () => {
            buyItem(item.Name);
        };

        shopContainer.appendChild(button);
    });
}


//cool function to find the best seed for grass, sand and water and more in the future
//Does take a while to run so be patient
//This is not used in the game but can be used to find the best seed for a specific type of tile
//Checks through 2^16 seeds which is 65536 seeds and at the moment it is the maximum seed value
//It will log the best seed for grass, sand and water
function searchForBestSeed(maxSeed = 100) {
    let bestSeedGrass = 0;
    let bestSeedSand = 0;
    let bestSeedWater = 0;

    let mostGrass = 0;
    let mostSand = 0;
    let mostWater = 0;

    for (let seed = 0; seed <= maxSeed; seed++) {
        generateMap(seed); 

        let grassCount = 0;
        let sandCount = 0;
        let waterCount = 0;

        for (let y = 0; y < Tiles.length; y++) {
            for (let x = 0; x < Tiles[y].length; x++) {
                const tileType = getTile(x,y).type;

                if (tileType === 'grass') grassCount++;
                else if (tileType === 'sand') sandCount++;
                else if (tileType === 'water') waterCount++;
            }
        }

        if (grassCount > mostGrass) {
            mostGrass = grassCount;
            bestSeedGrass = seed;
        }

        if (sandCount > mostSand) {
            mostSand = sandCount;
            bestSeedSand = seed;
        }

        if (waterCount > mostWater) {
            mostWater = waterCount;
            bestSeedWater = seed;
        }
    }

    console.log(`Best grass seed: ${bestSeedGrass} (${mostGrass} tiles)`);
    console.log(`Best sand seed:  ${bestSeedSand} (${mostSand} tiles)`);
    console.log(`Best water seed: ${bestSeedWater} (${mostWater} tiles)`);
}


const coolSeeds = {
    wetlands: 5493,
    desert: 15899,
    grassland: 41631,
};

shop(); // Initialize the shop when the script loads



