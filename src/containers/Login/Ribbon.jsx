import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

/* eslint-disable react/no-unused-prop-types, prefer-destructuring, react/destructuring-assignment */

const pi = Math.PI;
const pi2 = 2 * Math.PI;

function degree2radian(deg) {
  return deg * pi / 180;
}

function rand(...args) {
  const [a, b] = args;

  if (args.length === 1) {
    return Math.random() * a;
  }

  return a + Math.random() * (b - a);
}

function randSign() {
  return (Math.random() > 0.5) ? 1 : -1;
}

class Stats {
  constructor() {
    this.data = [];
  }

  log() {
    if (!this.last) {
      this.last = Date.now();
      return 0;
    }

    this.new = Date.now();
    this.delta = this.new - this.last;
    this.last = this.new;

    this.data.push(this.delta);

    if (this.data.length > 10) {
      this.data.shift();
    }
  }

  fps() {
    const fps = this.data.reduce((acc, cur) => acc + cur, 0);

    return Math.round(1000 / (fps / this.data.length));
  }
}

class Line {
  constructor(wave, color) {
    const { angle, speed } = wave;

    this.angle = [
      Math.sin(angle[0] += speed[0]),
      Math.sin(angle[1] += speed[1]),
      Math.sin(angle[2] += speed[2]),
      Math.sin(angle[3] += speed[3])
    ];

    this.color = color;
  }
}

class Wave {
  constructor(ribbon) {
    const { speed } = ribbon.props;

    this.ribbon = ribbon;
    this.lines = [];
    this.angle = [
      rand(pi2),
      rand(pi2),
      rand(pi2),
      rand(pi2)
    ];
    this.speed = [
      rand(speed[0], speed[1]) * randSign(),
      rand(speed[0], speed[1]) * randSign(),
      rand(speed[0], speed[1]) * randSign(),
      rand(speed[0], speed[1]) * randSign()
    ];
  }

  update() {
    const { lines } = this;
    const { color } = this.ribbon;

    lines.push(new Line(this, color));

    if (lines.length > this.ribbon.props.width) {
      lines.shift();
    }
  }

  draw() {
    const { ribbon } = this;
    const { lines } = this;
    const {
      ctx, radius, centerX: x, centerY: y
    } = ribbon;
    const { amplitude, debug } = ribbon.props;
    const radius3 = radius / 3;
    const rotation = degree2radian(ribbon.props.rotation);

    for (let i = 0; i < lines.length; i++) {
      if (debug && i > 0) return;

      const line = lines[i];
      const { angle } = line;
      const x1 = x - radius * Math.cos(angle[0] * amplitude + rotation);
      const y1 = y - radius * Math.sin(angle[0] * amplitude + rotation);
      const x2 = x + radius * Math.cos(angle[3] * amplitude + rotation);
      const y2 = y + radius * Math.sin(angle[3] * amplitude + rotation);
      const cpx1 = x - radius3 * Math.cos(angle[1] * amplitude * 2);
      const cpy1 = y - radius3 * Math.sin(angle[1] * amplitude * 2);
      const cpx2 = x + radius3 * Math.cos(angle[2] * amplitude * 2);
      const cpy2 = y + radius3 * Math.sin(angle[2] * amplitude * 2);

      ctx.strokeStyle = line.color;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x2, y2);
      ctx.stroke();

      if (debug) {
        ctx.strokeStyle = '#000';
        ctx.globalAlpha = 0.3;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(cpx1, cpy1);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(cpx2, cpy2);
        ctx.stroke();

        ctx.globalAlpha = 1;
      }
    }
  }
}

export default class Ribbon extends React.PureComponent {
  static propTypes = {
    resize: PropTypes.bool,
    rotation: PropTypes.number,
    waves: PropTypes.number,
    width: PropTypes.number,
    hue: PropTypes.arrayOf(PropTypes.number),
    amplitude: PropTypes.number,
    background: PropTypes.bool,
    preload: PropTypes.bool,
    speed: PropTypes.arrayOf(PropTypes.number),
    debug: PropTypes.bool,
    fps: PropTypes.bool,
    container: PropTypes.any
  }

  static defaultProps = {
    resize: false,
    rotation: 35,
    waves: 5,
    width: 100,
    hue: [11, 14],
    amplitude: 0.5,
    background: true,
    preload: true,
    speed: [0.004, 0.008],
    debug: false,
    fps: false,
    container: document.body
  }

  constructor(props) {
    super(props);

    this.canvas = React.createRef();
    this.waves = [];

    this.hue = this.props.hue[0];
    this.hueFw = true;
    this.color = 'rgba(60, 126, 254, 0.1)';
    this.stats = new Stats();
    this.container = typeof this.props.container === 'string'
      ? document.querySelector(this.props.container)
      : this.props.container;
  }

  componentDidMount() {
    this.ctx = this.canvas.current.getContext('2d');

    this.resize();
    this.init();
    this.animate();
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.animater);
  }

  init() {
    let { waves } = this.props;

    for (let i = 0; i < waves; i++) {
      this.waves[i] = new Wave(this);
    }

    if (waves.preload) this.preload();
  }

  preload() {
    let { waves, width } = this.props;

    for (let i = 0; i < waves; i++) {
      // this.updateColor();
      for (let j = 0; j < width; j++) {
        this.waves[i].update();
      }
    }
  }

  draw() {
    const { debug, background } = this.props;
    const { ctx } = this;

    // this.updateColor();
    this.clear();

    if (debug) {
      ctx.beginPath();
      ctx.strokeStyle = '#f00';
      ctx.arc(this.centerX, this.centerY, this.radius, 0, pi2);
      ctx.stroke();
    }

    if (background) {
      this.background();
    }

    for (let i = 0; i < this.waves.length; i++) {
      this.waves[i].update();
      this.waves[i].draw();
    }
  }

  animate() {
    const { fps } = this.props;
    const { ctx } = this;

    this.draw();

    if (fps) {
      this.stats.log();
      ctx.font = '24px Arial';
      ctx.fillStyle = '#000';
      ctx.fillText(`${this.stats.fps()} FPS`, 10, 22);
    }

    this.animater = window.requestAnimationFrame(() => {
      this.animate();
    });
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  background() {
    const { ctx } = this;
    const gradient = this.ctx.createRadialGradient(
      this.centerX, this.centerY, 300,
      this.centerX, this.centerY, Math.max(this.width, this.height)
    );

    gradient.addColorStop(0, '#fff');
    gradient.addColorStop(1, this.color);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);
  }

  resize() {
    const width = this.container.offsetWidth;
    const height = this.container.offsetHeight;
    const canvas = this.canvas.current;

    this.scale = window.devicePixelRatio || 1;
    this.width = width * this.scale;
    this.height = height * this.scale;
    canvas.width = this.width;
    canvas.height = this.height;
    canvas.style.cssText = `
      width: ${width}px;
      height: ${height}px;
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
    `;
    this.radius = Math.sqrt((this.width ** 2) + (this.height ** 2)) / 2;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
  }

  updateColor() {
    this.hue += (this.hueFw) ? 0.01 : -0.01;

    if (this.hue > this.props.hue[1] && this.hueFw) {
      this.hue = this.props.hue[1];
      this.this = false;
    } else if (this.hue < this.props.hue[0] && !this.hueFw) {
      this.hue = this.props.hue[0];
      this.this = true;
    }

    const r = Math.floor(127 * Math.sin(0.3 * this.hue + 0) + 128);
    const g = Math.floor(127 * Math.sin(0.3 * this.hue + 2) + 128);
    const b = Math.floor(127 * Math.sin(0.3 * this.hue + 4) + 128);

    this.color = `rgba(${r}, ${g}, ${b}, 0.1)`;
  }

  render() {
    return ReactDOM.createPortal(
      <canvas ref={this.canvas} />,
      this.container
    );
  }
}
