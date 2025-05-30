//canvas stuff
let canvas = document.getElementById("Canvas");
let ctx = canvas.getContext('2d');
let CanvasWidth = 1000
let CanvasHeight = 1000

//tile stuff
let Tile_Size = 50
let Tiles = []

let ItemSelected = null

//Shop items
const ShopItems = [
    {
        Name: "Pump",
        Width: Tile_Size,
        Height: Tile_Size,
        X: 10,
        Y: CanvasHeight + 25 
    },
    {
        Name: "Pipe_1",
        Width: Tile_Size,
        Height: Tile_Size,
        X: 10,
        Y: CanvasHeight + 25 
    },
    {
        Name: "Fish Net",
        Width: Tile_Size,
        Height: Tile_Size,
        X: 10,
        Y: CanvasHeight + 25 
    },
    {
        Name: "Pipe_2",
        Width: Tile_Size,
        Height: Tile_Size,
        X: 10,
        Y: CanvasHeight + 25 
    },
    {
        Name: "Pipe_3",
        Width: Tile_Size,
        Height: Tile_Size,
        X: 10,
        Y: CanvasHeight + 25 
    }

];

const MachineInstructions = {
    test_machine : {
        'Name': 'test_machine',
        'IsAMachine':true, //duh
        'Farm': 'cash',
        'Amount':1,
        'When': 2, //after how many sec
        'MaxInventory': 10
    },
}
const containers = {
    pipe :{
        'Name':'pipe',
        'MaxInventory':10
    },
    fluid_tank: {
        'Name':'pipe',
        'MaxInventory':10,
        'TypeInputed': 'fluid'
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
};

Images.grass.src = 'images/grass.png';
Images.water.src = 'images/water.png';
Images.test_machine.src = 'images/test_machine.png';
Images.pipe.src = 'images/pipe.png';


//functions
function drawTile(x,y,type){
    if(typeof x !== 'number' || typeof y !== 'number' || typeof Tile_Size !== 'number') {
        console.log('failed to draw a tile, number values not provided')
        return;
    } 

    const img = Images[type]
    if(img && img.complete){
        ctx.drawImage(img, x, y, Tile_Size, Tile_Size);
    } else{
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.rect(x, y, Tile_Size, Tile_Size);
        ctx.fill();    
        ctx.stroke();
    }
}

function shop(){
    for (let i = 0; i < ShopItems.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = 'black'
        ctx.rect(ShopItems[i].X+i*100,ShopItems[i].Y , Tile_Size, Tile_Size);
        ctx.fill();    
        ctx.stroke();
        ShopItems[i].X = ShopItems[i].X+i*100;
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
            
            const TileType = Math.random() < 0.80 ? 'grass' : 'water';
            row.push({x: tx,y: ty,type: TileType, inventory:null,timer:0,output:null,input:null});
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
            drawTile(tile.x, tile.y, tile.type);
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


//this is hard coded fix later
function transferInventorys(Ax,Ay,Bx,By, Amount){
    if(tileExists(Ax,Ay)&& tileExists(Bx,By)){
        let Destination = Tiles[By][Bx]
        let Inputer = Tiles[Ay][Ax]
       
        if(containers[Destination.type] != undefined) {
            if (Destination.inventory < containers[Destination.type].MaxInventory && Inputer.inventory >= Amount){
                Destination.inventory+=Amount
                Inputer.inventory -= Amount
                //console.log('moved items, Destination inventory:', Destination.inventory,Destination.type,Destination.x,Destination.y) ~
            }else{
                //warn
            }
        }
    } else{
        //warn
    }
}


// for placement of tiles (in the future)
canvas.addEventListener('mousemove',function(event) {
    let rect = canvas.getBoundingClientRect() //This has to be done bc sometimes the canvas is in the middle other times not so we adjust it
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;

    let tileX = Math.floor(mouseX/Tile_Size) 
    let tileY = Math.floor(mouseY/Tile_Size) 
    
    if (tileX >= 0 && tileX < CanvasWidth / Tile_Size &&tileY >= 0 && tileY < CanvasHeight / Tile_Size) {
        RedrawGrid() 
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.fillStyle = 'gray'
        ctx.rect(tileX*Tile_Size,tileY*Tile_Size, Tile_Size, Tile_Size);
        ctx.fill();    
        ctx.stroke(); 
        ctx.globalAlpha = 1;
    } 
})

let testvar= null //delete later
let testvar2 =0

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

        if(testvar == null) {
            Tiles[tileY][tileX].type = 'test_machine'
            Tiles[tileY][tileX].output = 'bottom'
            testvar = true
        } else if(testvar<5){
            Tiles[tileY][tileX].type = 'pipe'
            Tiles[tileY][tileX].output = 'bottom'
            Tiles[tileY][tileX].input = 'top'
            Tiles[tileY][tileX].inventory = 0
            testvar+=1
        } else{
            console.log(Tiles[tileY][tileX])
        }
        
    } else {
        if(mouseY >= 1000 && mouseY <= 1100 && mouseX >= 6 && mouseX <= 1000){
           for (let i = 0; i < ShopItems.length; i++) {
            var item = ShopItems[i]
                if(mouseX >= item.X && mouseX <= item.X + item.Width && mouseY >= item.Y && mouseY <= item.Y + item.Height  ) {
                    console.log(item.Name)
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
            if(MachineInstructions[Tile.type] != undefined){
               Tile.timer = (Tile.timer || 0) + deltatime;
               if(Tile.timer>= MachineInstructions[Tile.type].When){
                 Tile.timer = 0
                 if(Tile.inventory == null){
                    Tile.inventory = MachineInstructions[Tile.type].Amount
                 } else if(Tile.inventory < MachineInstructions[Tile.type].MaxInventory+1 ){
                      Tile.inventory+= MachineInstructions[Tile.type].Amount
                 }
               }
            }
            if(Tile.output != null) {
                var opposite = opposites[Tile.output]
                const NearbyTiles = AdjacentTiles(Tile.x,Tile.y)
                var dy= Math.floor(NearbyTiles[0][opposite].Y/Tile_Size) //Convert to tile coords
                var dx = Math.floor(NearbyTiles[0][opposite].X/Tile_Size)
                if(NearbyTiles[0][opposite] && tileExists(dx,dy)){
                    transferInventorys(Math.floor(Tile.x/Tile_Size),Math.floor(Tile.y/Tile_Size),dx,dy,1)

                } else{
                    console.warn('i dont know what fucking error to put here but something went wrong')
                }

            }
        }
    }  
    requestAnimationFrame(tick)
}

Init()
requestAnimationFrame(tick)

//made a basic pipe system. all it does it transfer items and is very hard coded
//Need to add item types like fluids and items
