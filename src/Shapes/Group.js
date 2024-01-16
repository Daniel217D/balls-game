export default class Group {
    constructor(app, shapes = []) {
        //Pixi.js app
        this.app = app;

        this.shapes = [];
        shapes.forEach((shape) => this.addShape(shape))
    }

    addShape(shape) {
        this.shapes.push(shape)
        this.app.stage.addChild(shape.renderObject)
    }

    update() {
        this.each(shape => shape.update())
    }

    each(func) {
        this.shapes.forEach(shape => func.call(this, shape))
    }
}