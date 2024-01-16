import Ball from "./Shapes/Ball";
import Rectangle from "./Shapes/Rectangle";

export default function handleCollisions(quadtree, group) {
    quadtree.clear();

    group.shapes.forEach(shape => {
        quadtree.insert(shape.getQuadtreeData());
    });

    group.shapes.forEach(shape => {
        const potentialColliders = quadtree.retrieve(shape.getQuadtreeData());

        potentialColliders.forEach(collider => {
            const otherShape = collider.shape;

            if (otherShape !== shape) {
                if(!shape.movable && !otherShape.movable){
                    return;
                }

                if (shape.type === 'ball' && otherShape.type === 'ball') {
                    handleBallBallCollision(shape, otherShape);
                } else if (shape.type === 'rectangle' && otherShape.type === 'rectangle') {
                    handleRectangleRectangleCollision(shape, otherShape)
                } else if ((shape.type === 'rectangle' && otherShape.type === 'ball') || (shape.type === 'ball' && otherShape.type === 'rectangle')) {
                    if(shape.type === 'ball') {
                        handleBallRectangleCollision(shape, otherShape)
                    } else {
                        handleBallRectangleCollision(otherShape,shape)
                    }
                }
            }
        });
    });
}

function handleBallBallCollision(ball, otherBall) {
    const distance = Math.sqrt((otherBall.x - ball.x) ** 2 + (otherBall.y - ball.y) ** 2);
    const sumRadii = ball.radius + otherBall.radius;

    if (distance < sumRadii) {
        const angle = Math.atan2(otherBall.y - ball.y, otherBall.x - ball.x);
        const overlap = sumRadii - distance;

        const normalX = (otherBall.x - ball.x) / distance;
        const normalY = (otherBall.y - ball.y) / distance;
        const relativeVelocityX = otherBall.dx - ball.dx;
        const relativeVelocityY = otherBall.dy - ball.dy;
        const dotProduct = (relativeVelocityX * normalX) + (relativeVelocityY * normalY);

        ball.dx += dotProduct * normalX;
        ball.dy += dotProduct * normalY;
        otherBall.dx -= dotProduct * normalX;
        otherBall.dy -= dotProduct * normalY;

        ball.x -= Math.cos(angle) * (overlap / 2);
        ball.y -= Math.sin(angle) * (overlap / 2);

        otherBall.x += Math.cos(angle) * (overlap / 2);
        otherBall.y += Math.sin(angle) * (overlap / 2);
    }
}

function handleRectangleRectangleCollision(rectangle, otherRectangle) {
    const distanceX = Math.abs(otherRectangle.x - rectangle.x);
    const distanceY = Math.abs(otherRectangle.y - rectangle.y);

    const halfWidth1 = rectangle.width / 2;
    const halfHeight1 = rectangle.height / 2;
    const halfWidth2 = otherRectangle.width / 2;
    const halfHeight2 = otherRectangle.height / 2;

    const overlapX = halfWidth1 + halfWidth2 - distanceX;
    const overlapY = halfHeight1 + halfHeight2 - distanceY;

    if (overlapX > 0 && overlapY > 0) {
        if (overlapX <= overlapY) {
            if (otherRectangle.x - rectangle.x > 0) {
                rectangle.x -= overlapX / 2;
                otherRectangle.x += overlapX / 2;
            } else {
                rectangle.x += overlapX / 2;
                otherRectangle.x -= overlapX / 2;
            }

            const dotProduct = (otherRectangle.dx - rectangle.dx) / overlapX;

            rectangle.dx += dotProduct;
            otherRectangle.dx -= dotProduct;
        }

        if (overlapX >= overlapY) {
            if (otherRectangle.y - rectangle.y > 0) {
                rectangle.y -= overlapY / 2;
                otherRectangle.y += overlapY / 2;
            } else {
                rectangle.y += overlapY / 2;
                otherRectangle.y -= overlapY / 2;
            }

            const dotProduct = (otherRectangle.dy - rectangle.dy) / overlapY;

            rectangle.dy += dotProduct;
            otherRectangle.dy -= dotProduct;
        }
    }
}

/**
 *
 * @param {Ball} ball
 * @param {Rectangle} rectangle
 */
function handleBallRectangleCollision(ball, rectangle) {
    const closestX = clamp(ball.x, rectangle.x - rectangle.width / 2, rectangle.x + rectangle.width / 2);
    const closestY = clamp(ball.y, rectangle.y - rectangle.height / 2, rectangle.y + rectangle.height / 2);

    const distanceX = ball.x - closestX;
    const distanceY = ball.y - closestY;
    const distanceSquared = distanceX ** 2 + distanceY ** 2;

    if (distanceSquared < ball.radius ** 2) {
        const distance = Math.sqrt(distanceSquared);
        const overlap = ball.radius - distance;

        if (distance !== 0) {
            const normalX = distanceX / distance;
            const normalY = distanceY / distance;

            ball.x += overlap * normalX;
            ball.y += overlap * normalY;

            const relativeVelocityX = rectangle.dx - ball.dx;
            const relativeVelocityY = rectangle.dy - ball.dy;
            const dotProduct = (relativeVelocityX * normalX) + (relativeVelocityY * normalY);

            ball.dx += dotProduct * normalX;
            ball.dy += dotProduct * normalY;

            rectangle.dx -= dotProduct * normalX;
            rectangle.dy -= dotProduct * normalY;
        }
    }
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}