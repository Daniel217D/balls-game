import * as PIXI from 'pixi.js';
import Quadtree from '@timohausmann/quadtree-js';

import Ball from "./Shapes/Ball";
import Group from './Shapes/Group';
import Rectangle from "./Shapes/Rectangle";

import handleCollisions from "./collisions";
import Wall from "./Shapes/Wall";
import Shape from "./Shapes/Shape";

export default function () {
    const app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        antialias: true
    });

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

        group.addShape(ball)
        app.stage.addChild(ball.renderObject)
    });

    document.body.appendChild(app.view);

    const group = new Group(app);

    group.addShape(new Wall(app.renderer.width / 2, 30, app.renderer.width, 10, 0x00FF00));
    group.addShape(new Wall(30, app.renderer.height / 2, 10, app.renderer.height, 0x00FF00));
    group.addShape(new Wall(app.renderer.width / 2, app.renderer.height - 30, app.renderer.width, 10, 0x00FF00));
    group.addShape(new Wall(app.renderer.width - 30, app.renderer.height / 2, 10, app.renderer.height, 0x00FF00));

    for (let i = 0; i < 1000; i++) {
        const size = Math.random() * 4 + 4;

        group.addShape(new Ball(
            Math.random() * (app.renderer.width - 100) + 50,
            Math.random() * (app.renderer.height - 100) + 50,
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
        group.update();
        handleCollisions(quadtree, group);
    });
}