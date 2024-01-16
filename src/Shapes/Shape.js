import {Graphics as PixiGraphics} from "pixi.js";

export default class Shape {
    type = '';
    movable = true;

    constructor(x, y, color, dx = 0, dy = 0) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.color = color;
    }

    setX(x) {
        this.x = x;
        this.renderObject.x = x;
    }

    setY(y) {
        this.y = y;
        this.renderObject.y = y;
    }

    update() {
        if(!this.movable) {
            this.dx = 0;
            this.dy = 0;
        }

        this.x += this.dx;
        this.y += this.dy;

        this.renderObject.x = this.x;
        this.renderObject.y = this.y;

        // this.dx *= 0.999;
        // this.dy *= 0.999;
    }

    //override
    prepareRenderObject() {
        this.renderObject = new PixiGraphics;
    }

    getQuadtreeData() {
        return {
            // x: 0,
            // y: 0,
            // width: 0,
            // height: 0,
            // shape: this
        }
    }
}