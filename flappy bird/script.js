document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const bird = {
        x: 50,
        y: canvas.height / 2,
        width: 20,
        height: 20,
        gravity: 0.5,
        lift: -10,
        velocity: 0,
        draw() {
            ctx.fillStyle = 'yellow';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        },
        update() {
            this.velocity += this.gravity;
            this.y += this.velocity;
            if (this.y + this.height > canvas.height || this.y < 0) {
                this.y = canvas.height / 2;
                this.velocity = 0;
            }
        },
        jump() {
            this.velocity = this.lift;
        }
    };

    class Pipe {
        constructor() {
            this.top = Math.random() * (canvas.height / 2);
            this.bottom = canvas.height - (this.top + 150);
            this.x = canvas.width;
            this.width = 40;
            this.speed = 2;
        }

        draw() {
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x, 0, this.width, this.top);
            ctx.fillRect(this.x, canvas.height - this.bottom, this.width, this.bottom);
        }

        update() {
            this.x -= this.speed;
        }

        offscreen() {
            return this.x < -this.width;
        }

        hits(bird) {
            if (bird.y < this.top || bird.y + bird.height > canvas.height - this.bottom) {
                if (bird.x + bird.width > this.x && bird.x < this.x + this.width) {
                    return true;
                }
            }
            return false;
        }
    }

    let pipes = [];
    const interval = 75;
    let frameCount = 0;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        bird.draw();
        pipes.forEach(pipe => pipe.draw());
    }

    function update() {
        bird.update();
        if (frameCount % interval === 0) {
            pipes.push(new Pipe());
        }
        pipes.forEach(pipe => {
            pipe.update();
            if (pipe.hits(bird)) {
                resetGame();
            }
        });
        pipes = pipes.filter(pipe => !pipe.offscreen());
    }

    function loop() {
        draw();
        update();
        frameCount++;
        requestAnimationFrame(loop);
    }

    function resetGame() {
        bird.y = canvas.height / 2;
        bird.velocity = 0;
        pipes = [];
        frameCount = 0;
    }

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            bird.jump();
        }
    });

    loop();
});
