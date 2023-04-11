export function quatToEuler(out, q) {
    const ysqr = q[1] * q[1];
  
    // Roll (x-axis rotation)
    const t0 = 2.0 * (q[3] * q[0] + q[1] * q[2]);
    const t1 = 1.0 - 2.0 * (q[0] * q[0] + ysqr);
    out[0] = Math.atan2(t0, t1);
  
    // Pitch (y-axis rotation)
    let t2 = 2.0 * (q[3] * q[1] - q[2] * q[0]);
    t2 = t2 > 1.0 ? 1.0 : t2;
    t2 = t2 < -1.0 ? -1.0 : t2;
    out[1] = Math.asin(t2);
  
    // Yaw (z-axis rotation)
    const t3 = 2.0 * (q[3] * q[2] + q[0] * q[1]);
    const t4 = 1.0 - 2.0 * (ysqr + q[2] * q[2]);
    out[2] = Math.atan2(t3, t4);
  
    // Convert to degrees
    out[0] *= 180 / Math.PI;
    out[1] *= 180 / Math.PI;
    out[2] *= 180 / Math.PI;
  }