class PlinkoEngine {
  static WIDTH = 800;
  static HEIGHT = 600;

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D | null;
  private animationFrameId: number | null = null;
  private balls: { x: number; y: number; radius: number; color: string }[] = [];
  private bins: { x: number; y: number; width: number; height: number; color: string }[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
  }

  start() {
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  dropBall() {
    const ball = {
      x: PlinkoEngine.WIDTH / 2,
      y: 0,
      radius: 10,
      color: 'red',
    };
    this.balls.push(ball);
  }

  private animate() {
    if (!this.context) return;

    this.context.clearRect(0, 0, PlinkoEngine.WIDTH, PlinkoEngine.HEIGHT);

    this.balls.forEach((ball) => {
      ball.y += 2; // Gravity effect
      this.context.beginPath();
      this.context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      this.context.fillStyle = ball.color;
      this.context.fill();
      this.context.closePath();
    });

    this.bins.forEach((bin) => {
      this.context.fillStyle = bin.color;
      this.context.fillRect(bin.x, bin.y, bin.width, bin.height);
    });

    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
  }
}

export default PlinkoEngine;
