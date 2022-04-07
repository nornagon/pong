import { quadricSolve } from './matrix.js'

const canvas = document.createElement('canvas')
document.body.appendChild(canvas)
canvas.width = 600
canvas.height = 600
const ctx = canvas.getContext('2d')

function draw([mx, my]) {
  const ball = { p: [300, 300], v: [-1, 0], r: 10 }
  const paddle = { p: [0, 300], v: [0, (my - 300) / 300], r: 50 }

  // first let's just imagine the paddle is also a circle.

  const r = (paddle.r + ball.r) // minkowski sum
  const [vx, vy] = paddle.v
  const [px, py] = paddle.p
  const quadric = [
    1, 0, -vx, -px,
    0, 1, -vy, -py,
    0, 0, (vx*vx+vy*vy), 0,
    0, 0, 0, -(r*r)
  ]

  const [t] = quadricSolve(quadric, [...ball.p, 0, 1], [...ball.v, 1, 0])

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'black'

  ctx.beginPath()
  ctx.arc(ball.p[0], ball.p[1], ball.r, 0, Math.PI*2)
  ctx.fill()

  ctx.beginPath()
  ctx.arc(paddle.p[0], paddle.p[1], paddle.r, 0, Math.PI*2)
  ctx.fill()

  ctx.strokeStyle = 'red'
  ctx.beginPath()
  ctx.moveTo(ball.p[0], ball.p[1])
  ctx.lineTo(ball.p[0] + ball.v[0], ball.p[1] + ball.v[1])
  ctx.stroke()

  if (t) {
    ctx.beginPath()
    ctx.arc(ball.p[0] + ball.v[0] * t, ball.p[1] + ball.v[1] * t, ball.r, 0, Math.PI*2)
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(paddle.p[0] + paddle.v[0] * t, paddle.p[1] + paddle.v[1] * t, paddle.r, 0, Math.PI*2)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(ball.p[0], ball.p[1])
    ctx.lineTo(ball.p[0] + ball.v[0] * t, ball.p[1] + ball.v[1] * t)
    ctx.stroke()
  }
}

canvas.onmousemove = (e) => {
  const {offsetX, offsetY} = e
  draw([offsetX, offsetY])
}

draw([0, 300])
