//canvas stuff
let canvas = document.getElementById("Canvas");
let ctx = canvas.getContext('2d');
let CanvasWidth = 1000
let CanvasHeight = 1000

//tile stuff
let Tile_Size = 50
let Tiles = []

let ItemSelected = null

let angle = 0

let cash = 0;
let CashTextBox = document.getElementById('cashText');
CashTextBox.textContent = cash;

//Shop items
const ShopItems = [
    {
        Name: "test_machine",
        Width: Tile_Size,
        Height: Tile_Size,
        X: 10,
        Y: CanvasHeight + 25 
    },
    {
        Name: "pipe",
        Width: Tile_Size,
        Height: Tile_Size,
        X: 10,
        Y: CanvasHeight + 25 
    },
    {
        Name: "pipe_turn",
        Width: Tile_Size,
        Height: Tile_Size,
        X: 10,
        Y: CanvasHeight + 25 
    },
     {
        Name: "fluid_tank",
        Width: Tile_Size,
        Height: Tile_Size,
        X: 10,
        Y: CanvasHeight + 25 
    },
     {
        Name: "smelter",
        Width: Tile_Size,
        Height: Tile_Size,
        X: 10,
        Y: CanvasHeight + 25 
    },
    {
        Name: "digger",
        Width: Tile_Size,
        Height: Tile_Size,
        X: 10,
        Y: CanvasHeight + 25 
    },
    {
        Name: "bucket",
        Width: Tile_Size,
        Height: Tile_Size,
        X: 10,
        Y: CanvasHeight + 25 
    },
     {
        Name: "shovel",
        Width: Tile_Size,
        Height: Tile_Size,
        X: 10,
        Y: CanvasHeight + 25 
    },
    {
        Name: "test",
        Width: Tile_Size,
        Height: Tile_Size,
        X: 10,
        Y: CanvasHeight + 25 
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
        'TypeInputed': 'item',
        'Turn':false
    }
}

const opposites = {
    'right':'left',
    'left':'right',
    'bottom':'top',
    'top':'bottom'
}

const Images = {
    grass: new Image(),
    water: new Image(),
    test_machine: new Image(),
    pipe: new Image(),
    fluid_tank: new Image(),
    pipe_turn: new Image(),
    bucket: new Image(),
    sand: new Image(),
    shovel: new Image(),
    dirt: new Image(),
    digger: new Image(),
    test: new Image(),
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
        'sand'
    ],
    gas:[]
}

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
}

const tools = ['shovel', 'test', 'bucket'];


Images.grass.src = 'images/grass.png';
Images.water.src = 'images/water.png';
Images.test_machine.src = 'images/test_machine.png';
Images.pipe.src = 'images/pipe.png';
Images.fluid_tank.src = 'images/fluid_tank.png';
Images.pipe_turn.src = 'images/pipe_turn.png';
Images.bucket.src = 'images/bucket.png';
Images.shovel.src = 'images/shovel.png';
Images.sand.src = 'images/sand.png';
Images.dirt.src = 'images/dirt.png';
Images.digger.src = 'images/digger.png';
Images.test.src = 'images/test.png';

//functions
function drawTile(x,y,type,degrees){
    if(typeof x !== 'number' || typeof y !== 'number' || typeof Tile_Size !== 'number') {
        console.log('failed to draw a tile, number values not provided')
        return;
    } 
   
    const img = Images[type]
    if(img && img.complete){
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
    if(img && img.complete){
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

function shop(){
     for (let i = 0; i < ShopItems.length; i++) {
        const img = Images[ShopItems[i].Name]
        if(img && img.complete){
            ctx.drawImage(img, ShopItems[i].X+i*100, ShopItems[i].Y, Tile_Size, Tile_Size);
            ShopItems[i].X = ShopItems[i].X+i*100;
        } else{
            ctx.beginPath();
            ctx.fillStyle = 'grey';
            ctx.rect(ShopItems[i].X+i*100, ShopItems[i].Y, Tile_Size, Tile_Size);
            ctx.fill();    
            ctx.stroke();
            ShopItems[i].X = ShopItems[i].X+i*100;
        }
    }
}


function Init(){
    console.log('game is starting')

    //Generate Grid

    for (let y = 0; y <CanvasHeight/Tile_Size; y++) {
        const row = []
        for (let x = 0; x <CanvasWidth/Tile_Size; x++) {
            var tx = x*Tile_Size
            var ty = y*Tile_Size
            
            const TileType = Math.random() < 0.80 ? 'grass' : 'sand';
            row.push({x: tx,y: ty,type: TileType, inventory:{amount:0,item:null},timer:0,output:null,input:null,degrees:0,machine:null, inventory2 :{active:false,item:null,amount:null}});
            drawTile(tx,ty,TileType)

        }
          Tiles.push(row);
    }
    console.log('grid generated')
    shop()
}

function RedrawGrid() { //this draws the grid according to the already generated stuff
    ctx.clearRect(0,0,CanvasWidth,CanvasHeight)
     for (let y = 0; y < Tiles.length; y++) {
        for (let x = 0; x < Tiles[y].length; x++) {
            const tile = Tiles[y][x];
            drawTile(tile.x, tile.y, tile.type,tile.degrees);
            if(tile.machine != null){
                drawMachine(tile.x, tile.y,tile.machine,tile.degrees)
            }
        }
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

function tileExists(x, y) {
    if (y >= 0 && y < Tiles.length &&Tiles[y] &&x >= 0 && x < Tiles[y].length &&Tiles[y][x]) {
        return true;
    } else {
        return false;
    }
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

//pain

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

//rotation
document.addEventListener("keydown", (r) => {
    if(ItemSelected){
        if(angle != 360){
            angle+=90
        } else{angle=0}
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
    const TilesHorz = CanvasWidth / Tile_Size; //how many tiles fit horozontially and vertically
    const TilesVert = CanvasHeight / Tile_Size;

    const rect = canvas.getBoundingClientRect() //This has to be done bc sometimes the canvas is in the middle other times not so we adjust it
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top

    const tileX = Math.floor(mouseX / Tile_Size); 
    const tileY = Math.floor(mouseY /Tile_Size); 
    
    if (tileX >= 0 && tileX < TilesHorz &&tileY >= 0 && tileY < TilesVert) {
        if(ItemSelected != null){
            if(tools.includes(ItemSelected) ) {
                if(ItemSelected == 'test'){
                    console.log(Tiles[tileY][tileX])
                }else if(ItemSelected == 'bucket'){
                    if(Tiles[tileY][tileX].type == 'water'){
                        Tiles[tileY][tileX].type = 'sand'
                    }
                } else if(ItemSelected == 'shovel'){
                    if(Tiles[tileY][tileX].type == 'grass'){
                        Tiles[tileY][tileX].type = 'dirt'
                }}
            } else if(Tiles[tileY][tileX]){
                if (placementConditions[ItemSelected] != undefined && placementConditions[ItemSelected] .blacklist){
                for(let n = 0; n < placementConditions[ItemSelected].blacklist.length; n++) {
                    if(Tiles[tileY][tileX].type ==  placementConditions[ItemSelected].blacklist[n] ){
                        console.warn('cant place')
                        return
                    }
                }}
                if(containers[ItemSelected] && containers[ItemSelected].Turn == false ){
                    Tiles[tileY][tileX].output = Straightdirections[angle].output
                    Tiles[tileY][tileX].input = Straightdirections[angle].input
                } else {
                    if(containers[ItemSelected] && containers[ItemSelected].Turn == true){
                        Tiles[tileY][tileX].output = Turndirections[angle].output
                        Tiles[tileY][tileX].input = Turndirections[angle].input
                    } else {
                        if(MachineInstructions[ItemSelected]) {
                        if(MachineInstructions[ItemSelected].HasInput == false){
                            Tiles[tileY][tileX].output = Straightdirections[angle].output
                        } else{
                             Tiles[tileY][tileX].output = Straightdirections[angle].output
                             Tiles[tileY][tileX].input = Straightdirections[angle].input
                        }
                    }
                    }
                }
                Tiles[tileY][tileX].machine = ItemSelected
                Tiles[tileY][tileX].degrees = angle
                ItemSelected = null
                angle = 0
            } 
        }
        
    } 
    else {
        if(mouseY >= 1000 && mouseY <= 1100 && mouseX >= 6 && mouseX <= 1000){
           for (let i = 0; i < ShopItems.length; i++) {
            var item = ShopItems[i]
                if(mouseX >= item.X && mouseX <= item.X + item.Width && mouseY >= item.Y && mouseY <= item.Y + item.Height  ) {
                    ItemSelected = item.Name
                }
            }
        }
    }
});

let LastTime = performance.now();
function tick(currentTime) {
    let deltatime = (currentTime - LastTime) / 1000; //delta time meaning most accurate time
    LastTime = currentTime;
    
    for (let y = 0; y < Tiles.length; y++) {
        for (let x = 0; x < Tiles[y].length; x++) {
            var Tile = Tiles[y][x]
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



let testTable = {x: 0,y: 0,type: 'grass', inventory:{amount:10,item:'sand'},timer:0,output:null,input:null,degrees:0,machine:'smelter', inventory2 :{active:true,item:null,amount:null}}
process(testTable)


Init()
requestAnimationFrame(tick)
//634 beautiful lines of code
