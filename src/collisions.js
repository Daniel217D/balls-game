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
                if (!shape.movable && !otherShape.movable) {
                    return;
                }

                if (shape.type === 'ball' && otherShape.type === 'ball') {
                    handleBallBallCollision(shape, otherShape);
                } else if (shape.type === 'rectangle' && otherShape.type === 'rectangle') {
                    handleRectangleRectangleCollision(shape, otherShape)
                } else if ((shape.type === 'rectangle' && otherShape.type === 'ball') || (shape.type === 'ball' && otherShape.type === 'rectangle')) {
                    if (shape.type === 'ball') {
                        handleBallRectangleCollision(shape, otherShape)
                    } else {
                        handleBallRectangleCollision(otherShape, shape)
                    }
                }
            }
        });
    });
}

/**
 *
 * @param {Ball} ball
 * @param {Ball} otherBall
 */
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

        if (ball.movable) {
            ball.dx += dotProduct * normalX;
            ball.dy += dotProduct * normalY;
            ball.setX(ball.x - Math.cos(angle) * (overlap / (otherBall.movable ? 2 : 1)));
            ball.setY(ball.y - Math.sin(angle) * (overlap / (otherBall.movable ? 2 : 1)));
        }

        if(otherBall.movable) {
            otherBall.dx -= dotProduct * normalX;
            otherBall.dy -= dotProduct * normalY;
            otherBall.setX(otherBall.x + Math.cos(angle) * (overlap / (ball.movable ? 2 : 1)));
            otherBall.setY(otherBall.y + Math.sin(angle) * (overlap / (ball.movable ? 2 : 1)));
        }
    }
}

/**
 *
 * @param {Rectangle} rectangle
 * @param {Rectangle} otherRectangle
 */
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
                rectangle.setX(rectangle.x - overlapX);
                otherRectangle.setX(otherRectangle.x + overlapX);
            } else {
                rectangle.setX(rectangle.x + overlapX);
                otherRectangle.setX(otherRectangle.x - overlapX);
            }

            const dotProduct = otherRectangle.dx - rectangle.dx;

            rectangle.dx += dotProduct;
            otherRectangle.dx -= dotProduct;
        }

        if (overlapX >= overlapY) {
            if (otherRectangle.y - rectangle.y > 0) {
                rectangle.setY(rectangle.y - overlapY)
                otherRectangle.setY(otherRectangle.y + overlapY);
            } else {
                rectangle.setY(rectangle.y + overlapY)
                otherRectangle.setY(otherRectangle.y - overlapY);
            }

            const dotProduct = otherRectangle.dy - rectangle.dy;

            rectangle.dy + dotProduct;
            otherRectangle.dy - dotProduct;
        }
    }
}

/**
 *
 * @param {Ball} ball
 * @param {Rectangle} rectangle
 */
function handleBallRectangleCollision(ball, rectangle) {
    const closestX = clamp(ball.x, rectangle.x, rectangle.x + rectangle.width);
    const closestY = clamp(ball.y, rectangle.y, rectangle.y + rectangle.height);

    const distanceX = ball.x - closestX;
    const distanceY = ball.y - closestY;
    const distanceSquared = distanceX ** 2 + distanceY ** 2;

    if (distanceSquared < ball.radius ** 2) {
        const distance = Math.sqrt(distanceSquared) || 1; //ToDo find better solution and remove `|| 1`
        const overlap = ball.radius - distance;

        if (distance !== 0) {
            const normalX = distanceX / distance;
            const normalY = distanceY / distance;

            if (rectangle.movable && ball.movable) {
                ball.setX(ball.x + overlap * normalX);
                ball.setY(ball.y + overlap * normalY);

                const relativeVelocityX = rectangle.dx - ball.dx;
                const relativeVelocityY = rectangle.dy - ball.dy;
                const dotProduct = (relativeVelocityX * normalX) + (relativeVelocityY * normalY);

                ball.dx += dotProduct * normalX;
                ball.dy += dotProduct * normalY;

                rectangle.dx -= dotProduct * normalX;
                rectangle.dy -= dotProduct * normalY;
            } else if (ball.movable) {
                ball.setX(ball.x + overlap * normalX);
                ball.setY(ball.y + overlap * normalY);

                const dotProduct = (ball.dx * normalX) + (ball.dy * normalY);
                ball.dx -= 2 * dotProduct * normalX;
                ball.dy -= 2 * dotProduct * normalY;
            }
        } else {
            console.error('zero distance at handleBallRectangleCollision')
        }
    }
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}