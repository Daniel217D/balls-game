import Rectangle from "../Shapes/Rectangle";

group.addShape(new Rectangle(280, 280, 40, 40, 0x00FF00, 0, 0));
group.addShape(new Rectangle(280, 0, 40, 40, 0x0000FF, 0, 10));

setTimeout(() => {
    group.addShape(new Rectangle(0, 280, 40, 40, 0x00FF00, 10, 0));
}, 2000)

setTimeout(() => {
    group.addShape(new Rectangle(560, 280, 40, 40, 0x0000FF, -10, 0));
}, 4000)

setTimeout(() => {
    group.addShape(new Rectangle(280, 560, 40, 40, 0x00FF00, 0, -10));
}, 6000)

setTimeout(() => {
    group.addShape(new Rectangle(0, 0, 40, 40, 0x0000FF, 10, 10));
}, 8000)

setTimeout(() => {
    group.addShape(new Rectangle(0, 560, 40, 40, 0x00FF00, 10, -10));
}, 10000)

setTimeout(() => {
    group.addShape(new Rectangle(560, 560, 40, 40, 0x0000FF, -10, -10));
}, 12000)

setTimeout(() => {
    group.addShape(new Rectangle(560, 0, 40, 40, 0x00FF00, -10, 10));
}, 14000)