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

//functions
function drawTile(x,y,color){
    const colors = {
        'grass' : 'green',
        'water' : 'blue',
        'rock' : 'gray'
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
            row.push({x: tx,y: ty,type: TileType});
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
        'left':{X:x-1,Y:y},
        'right':{X:x+1,Y:y},
        'bottom':{X:x,Y:y-1},
        'top':{X:x,Y:y+1}
    });

    return TilesNearby;
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
        console.log('Clicked in the grid');
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


Init()

function tileExists(x, y) {
    if (y >= 0 && y < Tiles.length &&Tiles[y] &&x >= 0 && x < Tiles[y].length &&Tiles[y][x]) {
        return true;
    } else {
        return false;
    }
}


console.log(AdjacentTiles(10,10))


