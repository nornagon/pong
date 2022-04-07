// References:
// https://github.com/bwkimmel/jmist/blob/master/jmist-core/src/main/java/ca/eandb/jmist/math/Quadric.java
// https://people.cs.clemson.edu/~dhouse/courses/405/notes/quadrics.pdf
// https://www.cs.uaf.edu/2012/spring/cs481/section/0/lecture/01_26_ray_intersections.html

// u^T . Mv "general dot product"
function mdot(M, u, v) {
  const [_00, _01, _02, _03,
         _10, _11, _12, _13,
         _20, _21, _22, _23,
         _30, _31, _32, _33] = M
  const [ux, uy, uz, uw] = u
  const [vx, vy, vz, vw] = v
  return (
    ux * (_00 * vx + _01 * vy + _02 * vz + _03 * vw) +
    uy * (_10 * vx + _11 * vy + _12 * vz + _13 * vw) +
    uz * (_20 * vx + _21 * vy + _22 * vz + _23 * vw) +
    uw * (_30 * vx + _31 * vy + _32 * vz + _33 * vw)
  )
}

const epsilon = 0.0001
function* quadraticRoots(a, b, c) {
  if (Math.abs(a) > epsilon) {
    const det = b*b - 4*a*c
    if (det > 0) {
      const sdet = Math.sqrt(det)
      const tn = (-b - sdet) / (2 * a)
      if (tn >= 0) yield tn
      const tp = (-b + sdet) / (2 * a)
      if (tp >= 0) yield tp
    } else if (det === 0) {
      const t = -b / (2 * a)
      if (t >= 0) yield t
    } else {
      // no solution
    }
  } else {
    // assume a = 0, solve 0 = c + t b
    // i.e. t = -c / b
    const t = -c / b
    if (t >= 0) yield t
  }
}

export function* quadricSolve(A, c, d) {
  const qa = mdot(A, d, d)
  const qb = mdot(A, d, c) * 2
  const qc = mdot(A, c, c)
  yield* quadraticRoots(qa, qb, qc)
}
