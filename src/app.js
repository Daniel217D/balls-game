import {Application as PixiApplication} from 'pixi.js';
import Quadtree from '@timohausmann/quadtree-js';

import Ball from "./Shapes/Ball";
import Group from './Shapes/Group';

import handleCollisions from "./collisions";
import WallRectangle from "./Shapes/WallRectangle";
import CircleWall from "./Shapes/CircleWall";

export default function () {
    const app = new PixiApplication({
        width: window.innerWidth,
        height: window.innerHeight,
        antialias: true
    });

    const wallsGroup = new Group(app);
    const ballsGroup = new Group(app);

    window.addEventListener('resize', function updateCanvasSize() {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        quadtree.width = app.renderer.width;
        quadtree.height = app.renderer.height;
    });

    window.addEventListener('click', function addBallOnClick(event) {
        const ball = new Ball(
            event.clientX - app.view.offsetLeft,
            event.clientY - app.view.offsetTop,
            20,
            0xFF0000,
            0,
            -2
        )

        ballsGroup.addShape(ball)
        app.stage.addChild(ball.renderObject)
    });

    document.body.appendChild(app.view);

    wallsGroup.addShape(new WallRectangle(0, 0, app.renderer.width, 40, 0x00FF00));
    wallsGroup.addShape(new WallRectangle(0, 0, 40, app.renderer.height, 0x00FF00));
    wallsGroup.addShape(new WallRectangle(0, app.renderer.height - 30, app.renderer.width, 40, 0x00FF00));
    wallsGroup.addShape(new WallRectangle(app.renderer.width - 30, 0, 40, app.renderer.height, 0x00FF00));

    wallsGroup.addShape(new CircleWall(app.renderer.width / 2, app.renderer.height / 2, 100, 0x00FF00));

    for (let i = 0; i < 20; i++) {
        const size = 20;

        ballsGroup.addShape(new Ball(
            Math.random() * (app.renderer.width - 200) + 100,
            Math.random() * (app.renderer.height - 200) + 100,
            size,
            0xFF0000,
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5
        ))
    }

    const quadtree = new Quadtree({
        x: 0,
        y: 0,
        width: app.renderer.width,
        height: app.renderer.height
    });

    app.ticker.maxFPS = 60;
    app.ticker.add(() => {
        const group = new Group(app, [...wallsGroup.shapes, ...ballsGroup.shapes])

        ballsGroup.each(shape => { //gravity
            shape.dy += 0.1;
            shape.dy *= 0.995;
            shape.dx *= 0.995;
        });

        group.update(); //dx, dy movement
        handleCollisions(quadtree, group); //collisions...
    });
}