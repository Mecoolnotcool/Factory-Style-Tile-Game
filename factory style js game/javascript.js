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
    pump : {
        'Name': 'test_machine',
        'IsAMachine':true, //duh
        'Farm': 'water',
        'Amount':1,
        'When': 2, //after how many sec
        'MaxInventory': 10
    },
}

const opposites = {
    'right':'left',
    'left':'right',
    'bottom':'top',
    'top':'bottom'
}

//functions
function drawTile(x,y,color){
    const colors = {
        'grass' : 'green',
        'water' : 'blue',
        'rock' : 'gray',
        'test_machine':'yellow'
    }
    if(typeof x !== 'number' || typeof y !== 'number' || typeof Tile_Size !== 'number') {
        console.log('failed to draw a tile, number values not provided')
        return;
    } else {
        ctx.beginPath();
        ctx.fillStyle = colors[color]
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
        // console.log( Tiles[tileY][tileX])
        Tiles[tileY][tileX].type = 'test_machine'
        Tiles[tileY][tileX].output = 'bottom'
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
               if(Tile.timer>= 1){
                 Tile.timer = 0
                 if(Tile.inventory == null){
                    Tile.inventory = 1
                 } else{
                      Tile.inventory+=1
                 }
               }
            }
            if(Tile.output != null) {
                var opposite = opposites[Tile.output]
                const NearbyTiles = AdjacentTiles(Tile.x,Tile.y)
                var dy= Math.floor(NearbyTiles[0][opposite].Y/Tile_Size) //Convert to tile coords
                var dx = Math.floor(NearbyTiles[0][opposite].X/Tile_Size)
                if(NearbyTiles[0][opposite] && tileExists(dx,dy)){
                    let OutputTile = Tiles[dy][dx]  
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


//Have output but now need where to output
