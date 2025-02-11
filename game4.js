// 获取画布元素和上下文
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

// 游戏变量
let player, enemy, particleSystem;

// 玩家类
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.color = "blue";
        this.speed = 5;
    }

    move() {
        if (keys["ArrowUp"]) this.y -= this.speed;
        if (keys["ArrowDown"]) this.y += this.speed;
        if (keys["ArrowLeft"]) this.x -= this.speed;
        if (keys["ArrowRight"]) this.x += this.speed;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// 敌人类
class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.color = "red";
        this.speed = 2;
    }

    move() {
        if (this.x < player.x) this.x += this.speed;
        if (this.x > player.x) this.x -= this.speed;
        if (this.y < player.y) this.y += this.speed;
        if (this.y > player.y) this.y -= this.speed;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    // 检查是否与玩家碰撞
    checkCollision() {
        if (
            this.x < player.x + player.width &&
            this.x + this.width > player.x &&
            this.y < player.y + player.height &&
            this.y + this.height > player.y
        ) {
            // 播放粒子效果和闪烁动画
            triggerExplosion(this.x, this.y);
            const enemyElem = document.createElement('div');
            enemyElem.classList.add('enemy', 'hit');
            document.body.appendChild(enemyElem);
            setTimeout(() => enemyElem.remove(), 500);
        }
    }
}

// 粒子类
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 2; // 粒子大小
        this.speedX = (Math.random() - 0.5) * 4; // 水平速度
        this.speedY = (Math.random() - 0.5) * 4; // 垂直速度
        this.color = color;
        this.alpha = 1; // 初始透明度
        this.lifetime = 0; // 粒子的生命周期
    }

    // 更新粒子
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.02; // 每次更新减小透明度
        this.lifetime++;

        if (this.lifetime > 50) { // 粒子活跃50帧后消失
            this.alpha = 0;
        }
    }

    // 绘制粒子
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;
        ctx.fill();
    }
}

// 粒子系统类
class ParticleSystem {
    constructor(x, y, color) {
        this.particles = [];
        this.x = x;
        this.y = y;
        this.color = color;
    }

    // 创建粒子并更新
    createParticles() {
        for (let i = 0; i < 30; i++) {
            this.particles.push(new Particle(this.x, this.y, this.color));
        }
    }

    // 更新所有粒子
    update(ctx) {
        this.particles.forEach((particle, index) => {
            particle.update();
            particle.draw(ctx);
            if (particle.alpha <= 0) {
                this.particles.splice(index, 1); // 粒子生命周期结束后移除
            }
        });
    }
}

// 按键控制
const keys = {};
window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});
window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

// 触发爆炸效果
function triggerExplosion(x, y) {
    particleSystem = new ParticleSystem(x, y, { r: 255, g: 0, b: 0 }); // 红色爆炸
    particleSystem.createParticles();
}

// 游戏初始化
function init() {
    player = new Player(canvas.width / 2, canvas.height / 2);
    enemy = new Enemy(100, 100);
    particleSystem = new ParticleSystem(0, 0, { r: 255, g: 255, b: 0 });
    gameLoop();
}

// 游戏主循环
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除画布

    player.move();
    player.draw();

    enemy.move();
    enemy.draw();
    enemy.checkCollision();

    if (particleSystem) {
        particleSystem.update(ctx);
    }

    requestAnimationFrame(gameLoop);
}

// 启动游戏
init();
