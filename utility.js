import Point from './point.model.js';

export function getMouseCoordsOnCanvas(e, canvas){
    let rect = canvas.getBoundingClientRect();
    let x = Math.round(e.clientX - rect.left);
    let y = Math.round(e.clientY - rect.top);

    console.log(" " +rect.left+ "" + " " +rect.top+ "" +" " +rect.right+ ""+" " +rect.bottom+ "");
    return new Point(x,y);
}

export function findDistance(coord1, coord2){
    let distance = 0;
    return distance = Math.sqrt(Math.pow(coord2.x - coord1.x, 2) + Math.pow(coord2.y - coord1.y, 2));
} 