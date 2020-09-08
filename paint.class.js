import Tool from  './tool.class.js';
import Point from './point.model.js';
import Fill from './fill.class.js';
import {getMouseCoordsOnCanvas, findDistance} from './utility.js';

export default class Paint {
    
    constructor(canvasID){
        this.canvas = document.getElementById(canvasID);
        this.context = this.canvas.getContext("2d");
        this.undoStack = [];
        this.undoLimit = 5;
    }

    set activeTool(tool){
        this.tool = tool;
    }

    set lineWidth(linewidth){
        this._lineWidth = linewidth;
        this.context.lineWidth = this._lineWidth;   
    }

    set brushSize(brushsize){
        this._brushSize = brushsize;
    }

    set selectedColor(color){
        this.color = color;
        this.context.strokeStyle = this.color;
    }

    init(){
        this.canvas.onmousedown = e => this.onMouseDown(e);
    }

    onMouseDown(e){
        this.saveData = this.context.getImageData(0, 0, 
            this.canvas.clientWidth, this.canvas.clientHeight);
        
        if(this.undoStack.length >= this.undoLimit) this.undoStack.shift();
        this.undoStack.push(this.saveData);
        
        console.log("clientWidth " +this.canvas.clientWidth+ "clientHeight " +this.canvas.clientHeight+ "");

        this.canvas.onmousemove = e => this.onMouseMove(e);
        document.onmouseup = e => this.onMouseUp(e);

        this.startPos = getMouseCoordsOnCanvas(e, this.canvas);
        
        if(this.tool == Tool.TOOL_PENCIL || this.tool == Tool.TOOL_BRUSH)
        {
            this.context.beginPath();
            this.context.moveTo(this.startPos.x, this.startPos.y);
        } else if (this.tool == Tool.TOOL_PAINT_BUCKET){
            //fill color
            new Fill(this.canvas, this.startPos, this.color);
        } else if(this.tool == Tool.TOOL_ERASER){
            this.context.clearRect(this.startPos.x, this.startPos.y, this._brushSize, this._brushSize);
        }

    }

    onMouseMove(e){
        this.currentPos = getMouseCoordsOnCanvas(e, this.canvas);
        
        //console.log("canvas " +this.canvas+ "");

        switch (this.tool){
            case Tool.TOOL_LINE:
            case Tool.TOOL_RECTANGLE:
            case Tool.TOOL_CIRCLE:
            case Tool.TOOL_TRIANGLE:
                this.drawShape();
                break;
            case Tool.TOOL_PENCIL:
                this.drawFreeLine(this._lineWidth);
                break;
            case Tool.TOOL_BRUSH:
                this.drawFreeLine(this._brushSize);
                break;
            case Tool.TOOL_ERASER:
                this.context.clearRect(this.currentPos.x, this.currentPos.y, this._brushSize, this._brushSize);
            default:
                break;
        }
    }

    onMouseUp(e){
        this.canvas.onmousemove = null;
        document.onmouseup = null;
    }

    drawShape(){
        this.context.putImageData(this.saveData, 0, 0);

        this.context.beginPath();

        if(this.tool == Tool.TOOL_LINE){
            this.context.moveTo(this.startPos.x, this.startPos.y);
            this.context.lineTo(this.currentPos.x, this.currentPos.y);
        } else if(this.tool == Tool.TOOL_RECTANGLE){
            this.context.rect(this.startPos.x, this.startPos.y, 
                this.currentPos.x - this.startPos.x, this.currentPos.y - this.startPos.y);
        } else if(this.tool == Tool.TOOL_CIRCLE){
            let distance = findDistance(this.startPos, this.currentPos);
            this.context.arc(this.startPos.x, this.startPos.y, distance, 0, Math.PI*2,);
        } else if(this.tool == Tool.TOOL_TRIANGLE){
            this.context.moveTo(this.startPos.x + (this.currentPos.x - this.startPos.x) /2, this.startPos.y);
            this.context.lineTo(this.startPos.x, this.currentPos.y);
            this.context.lineTo(this.currentPos.x, this.currentPos.y);
            this.context.closePath();
        }
        
        this.context.stroke();

        console.log("" +this.startPos.x +" " +this.startPos.y +". " +this.currentPos.x + " " +this.currentPos.y);
        console.log("" +this.canvas.clientWidth+ " " +this.canvas.clientHeight+ "");
        console.log("" +this.saveData+ "");
    }

    drawFreeLine(lineWidth){
        this.context.lineWidth = lineWidth;
        this.context.lineTo(this.currentPos.x, this.currentPos.y);
        this.context.stroke();
    }

    undoPaint(){
        this.context.putImageData(this.undoStack[this.undoStack.length - 1], 0, 0);
        this.undoStack.pop();
    }else{
        alert("No undo available!");
    }
}