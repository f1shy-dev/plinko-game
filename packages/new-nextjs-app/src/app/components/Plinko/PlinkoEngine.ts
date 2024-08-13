import Matter from 'matter-js';
import { v4 as uuidv4 } from 'uuid';
import { binPayouts, rowCountOptions } from '@/app/constants/game';
import type { RiskLevel,  WinRecord } from '@/app/types/game';
import type { RowCount } from '@/app/constants/game';

type BallFrictionsByRowCount = {
  friction: number;
  frictionAirByRowCount: Record<RowCount, number>;
};

class PlinkoEngine {
  static WIDTH = 760;
  static HEIGHT = 570;

  private static PADDING_X = 52;
  private static PADDING_TOP = 36;
  private static PADDING_BOTTOM = 28;

  private static PIN_CATEGORY = 0x0001;
  private static BALL_CATEGORY = 0x0002;

  private canvas: HTMLCanvasElement;
  public engine: Matter.Engine;
  private render: Matter.Render;
  private runner: Matter.Runner;
  private pins: Matter.Body[] = [];
  private walls: Matter.Body[] = [];
  public sensor: Matter.Body | undefined;
  private pinsLastRowXCoords: number[] = [];

  private rowCount: RowCount;
  private riskLevel: RiskLevel;
  private betAmount: number;

  private static ballFrictions: BallFrictionsByRowCount = {
    friction: 0.5,
    frictionAirByRowCount: {
      8: 0.0395, 9: 0.041, 10: 0.038, 11: 0.0355, 12: 0.0414,
      13: 0.0437, 14: 0.0401, 15: 0.0418, 16: 0.0364,
    },
  };

  constructor(canvas: HTMLCanvasElement, rowCount: RowCount, riskLevel: RiskLevel, betAmount: number) {
    this.canvas = canvas;
    this.rowCount = rowCount;
    this.riskLevel = riskLevel;
    this.betAmount = betAmount;

    this.engine = Matter.Engine.create({ timing: { timeScale: 1 } });
    this.render = Matter.Render.create({
      engine: this.engine,
      canvas: this.canvas,
      options: {
        width: PlinkoEngine.WIDTH,
        height: PlinkoEngine.HEIGHT,
        background: '#0f1728',
        wireframes: false,
      },
    });
    this.runner = Matter.Runner.create();
    

    this.placePinsAndWalls();
    this.setupSensor();
  }

  start(): void {
    Matter.Render.run(this.render);
    Matter.Runner.run(this.runner, this.engine);
  }

  stop(): void {
    Matter.Render.stop(this.render);
    Matter.Runner.stop(this.runner);
  }

  dropBall(): void {
    const ballOffsetRangeX = this.pinDistanceX * 0.8;
    const ballRadius = this.pinRadius * 2;
    const { friction, frictionAirByRowCount } = PlinkoEngine.ballFrictions;

    const ball = Matter.Bodies.circle(
      Matter.Common.random(
        this.canvas.width / 2 - ballOffsetRangeX,
        this.canvas.width / 2 + ballOffsetRangeX
      ),
      0,
      ballRadius,
      {
        restitution: 0.8,
        friction,
        frictionAir: frictionAirByRowCount[this.rowCount],
        collisionFilter: {
          category: PlinkoEngine.BALL_CATEGORY,
          mask: PlinkoEngine.PIN_CATEGORY,
        },
        render: { fillStyle: '#ff0000' },
      }
    );
    Matter.Composite.add(this.engine.world, ball);
  }

  get binsWidthPercentage(): number {
    const lastPinX = this.pinsLastRowXCoords[this.pinsLastRowXCoords.length - 1];
    return (lastPinX - this.pinsLastRowXCoords[0]) / PlinkoEngine.WIDTH;
  }

  private get pinDistanceX(): number {
    const lastRowPinCount = 3 + this.rowCount - 1;
    return (this.canvas.width - PlinkoEngine.PADDING_X * 2) / (lastRowPinCount - 1);
  }

  private get pinRadius(): number {
    return (24 - this.rowCount) / 2;
  }

  updateRowCount(rowCount: RowCount): void {
    if (rowCount === this.rowCount) return;
    this.rowCount = rowCount;
    this.removeAllBalls();
    this.placePinsAndWalls();
  }

  private setupSensor(): void {
    this.sensor = Matter.Bodies.rectangle(
      this.canvas.width / 2,
      this.canvas.height,
      this.canvas.width,
      10,
      {
        isSensor: true,
        isStatic: true,
        render: { visible: false },
      }
    );
    Matter.Composite.add(this.engine.world, [this.sensor]);
    Matter.Events.on(this.engine, 'collisionStart', ({ pairs }: Matter.IEventCollision<Matter.Engine>) => {
      for (const pair of pairs) {
        const { bodyA, bodyB } = pair;
        if (bodyA === this.sensor || bodyB === this.sensor) {
          const ball = bodyA === this.sensor ? bodyB : bodyA;
          this.handleBallEnterBin(ball);
        }
      }
    });
  }

  public handleBallEnterBin(ball: Matter.Body): WinRecord {
    const binIndex = this.pinsLastRowXCoords.findLastIndex((pinX) => pinX < ball.position.x);
    const multiplier = binPayouts[this.rowCount as RowCount][this.riskLevel][binIndex];
    const payoutValue = this.betAmount * multiplier;
    const profit = payoutValue - this.betAmount;

    const winRecord: WinRecord = {
      id: uuidv4(),
      betAmount: this.betAmount,
      rowCount: this.rowCount,
      binIndex,
      payout: { multiplier, value: payoutValue },
      profit,
    };

    Matter.Composite.remove(this.engine.world, ball);
    return winRecord;
  }

  private placePinsAndWalls(): void {
    // Implementation remains the same
  }

  private removeAllBalls(): void {
    const bodies = Matter.Composite.allBodies(this.engine.world);
    for (const body of bodies) {
      if (body.collisionFilter.category === PlinkoEngine.BALL_CATEGORY) {
        Matter.Composite.remove(this.engine.world, body);
      }
    }
  }
}

export default PlinkoEngine;