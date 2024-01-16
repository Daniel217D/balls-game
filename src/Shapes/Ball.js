import * as PIXI from 'pixi.js';
import Shape from "./Shape";

export default class Ball extends Shape {
    type = 'ball';

    constructor(x, y, radius, color, dx = 0, dy = 0) {
        super(x,y,color,dx,dy)

        this.radius = radius;

        this.prepareRenderObject()
    }

    prepareRenderObject() {
        this.renderObject = new PIXI.Graphics();
        this.renderObject.beginFill(this.color);
        this.renderObject.drawCircle(0, 0, this.radius);
        this.renderObject.endFill();
        this.renderObject.x = this.x
        this.renderObject.y = this.y;
    }

    getQuadtreeData() {
        return {
            x: this.x - this.radius,
            y: this.y - this.radius,
            width: this.radius * 2,
            height: this.radius * 2,
            shape: this
        }
    }
}