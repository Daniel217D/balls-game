import * as PIXI from 'pixi.js';
import Shape from "./Shape";

export default class Rectangle extends Shape {
    type = 'rectangle';

    constructor(x, y, width, height, color, dx = 0, dy = 0) {
        super(x,y,color,dx,dy)

        this.width = width;
        this.height = height;

        this.prepareRenderObject()
    }

    prepareRenderObject() {
        super.prepareRenderObject();

        this.renderObject.beginFill(this.color);
        this.renderObject.drawRect(0, 0, this.width, this.height);
        this.renderObject.endFill();
        this.renderObject.x = this.x
        this.renderObject.y = this.y;
    }

    getQuadtreeData() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            shape: this
        }
    }
}