export default class Simple1DNoise {
    MAX_VERTICES = 256;
    MAX_VERTICES_MASK = this.MAX_VERTICES -1;
    amplitude = 1;
    scale = 1;

    r = [];

    index = 1;

    constructor() {
      for (let i = 0; i < this.MAX_VERTICES; ++i ) {
          this.r.push(Math.random());
      }
    }

    getVal() {
      let x = this.index;
      let scaledX = x * this.scale;
      let xFloor = Math.floor(scaledX);
      let t = scaledX - xFloor;
      let tRemapSmoothstep = t * t * ( 3 - 2 * t );

      /// Modulo using &
      let xMin = xFloor & this.MAX_VERTICES_MASK;
      let xMax = ( xMin + 1 ) & this.MAX_VERTICES_MASK;

      let y = this.lerp( this.r[ xMin ], this.r[ xMax ], tRemapSmoothstep );

      this.index += 0.0001;
      return y * this.amplitude;
    };

    /**
    * Linear interpolation function.
    * @param a The lower integer value
    * @param b The upper integer value
    * @param t The value between the two
    * @returns {number}
    */
    lerp(a, b, t ) {
        return a * ( 1 - t ) + b * t;
    };
};
