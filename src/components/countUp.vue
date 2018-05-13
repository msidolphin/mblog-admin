<style></style>
<template>
    <span :id="id" :class="setClass" v-text="formatNumber(count)"></span>
</template>
<script>
(function () {
  var lastTime = 0
  var vendors = ['webkit', 'moz', 'ms', 'o']
  for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame']
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame']
  }
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback, element) {
      var currTime = new Date().getTime()
      var timeToCall = Math.max(0, 16.7 - (currTime - lastTime))
      var id = window.setTimeout(function () {
        let time = currTime + timeToCall
        callback(time)
      }, timeToCall)
      lastTime = currTime + timeToCall
      return id
    }
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id)
    }
  }
}())
export default {
  props: {
    startVal: {
      type: Number,
      default: 0
    },
    endVal: {
      type: Number,
      default: new Date().getFullYear()
    },
    dur: {
      type: Number,
      default: 2
    },
    precision: {
      type: Number,
      default: 2
    },
    useEasing: {
      type: Boolean,
      default: true
    },
    useGrouping: {
      type: Boolean,
      default: true
    },
    separator: {
      type: String,
      default: ','
    },
    decimal: {
      type: String,
      default: '.'
    },
    prefix: { // optional text before the result
      type: String,
      default: ''
    },
    suffix: { // optional text after the result
      type: String,
      default: ''
    },
    cls: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      numerals: [], // optionally pass an array of custom numerals for 0-9
      initialized: false,
      error: '',
      dec: null,
      countDown: null,
      count: null,
      rAF: null,
      timestamp: null,
      remaining: null,
      formatVal: null,
      paused: true,
      elId: null
    }
  },
  mounted () {
    // this.startTime = window.mozRequestAnimationStartTime || Date.now()
    this.initialize() // initialize properties
  },
  computed: {
    setClass () {
      return this.cls
    }
  },
  methods: {
    initialize () {
      if (this.initialized) return true
      this.error = ''
      this.startVal = Number(this.startVal)
      this.endVal = Number(this.endVal)
      // error checks
      if (this.ensureNumber(this.startVal) && this.ensureNumber(this.endVal)) {
        this.precision = Math.max(0, this.precision || 0)
        this.dec = Math.pow(10, this.precision)
        this.duration = Number(this.dur) * 1000 || 2000
        this.countDown = (this.startVal > this.endVal)
        this.count = this.startVal
        this.formatVal = this.formatNumber(this.startTime)
        this.initialized = true
        // started animate
        window.requestAnimationFrame(this.start)
        return true
      } else {
        this.error = '[CountUp] startVal (' + this.startVal + ') or endVal (' + this.endVal + ') is not a number'
        return false
      }
    },
    start (timestamp) {
      if (!this.startTime) { this.startTime = timestamp }
      this.timestamp = timestamp
      var progress = timestamp - this.startTime
      this.remaining = this.duration - progress
      // to ease or not to ease
      if (this.useEasing) {
        if (this.countDown) {
          this.count = this.startVal - this.easeOutExpo(progress, 0, this.startVal - this.endVal, this.duration)
        } else {
          this.count = this.easeOutExpo(progress, this.startVal, this.endVal - this.startVal, this.duration)
        }
      } else {
        if (this.countDown) {
          this.count = this.startVal - ((this.startVal - this.endVal) * (progress / this.duration))
        } else {
          this.count = this.startVal + (this.endVal - this.startVal) * (progress / this.duration)
        }
      }

      // don't go past endVal since progress can exceed duration in the last frame
      if (this.countDown) {
        this.count = (this.count < this.endVal) ? this.endVal : this.count
      } else {
        this.count = (this.count > this.endVal) ? this.endVal : this.count
      }

      // decimal
      this.count = Math.round(this.count * this.dec) / this.dec
      // whether to continue
      if (progress < this.duration) {
        this.rAF = requestAnimationFrame(this.start)
      } else {
        cancelAnimationFrame(this.rAF)
      }
    },
    formatNumber (num) {
      let neg = (num < 0)
      num = Math.abs(num).toFixed(this.precision)
      num += ''
      let x = num.split('.')
      let x1 = x[0]
      let x2 = x.length > 1 ? this.decimal + x[1] : ''
      let len = x1.length
      if (this.useGrouping) {
        let x3 = ''
        for (let i = 0; i < len; ++i) {
          if (i !== 0 && ((i % 3) === 0)) {
            x3 = this.separator + x3
          }
          x3 = x1[len - i - 1] + x3
        }
        x1 = x3
      }
      // optional numeral substitution
      if (this.numerals.length) {
        x1 = x1.replace(/[0-9]/g, w => {
          return this.numerals[+w]
        })
        x2 = x2.replace(/[0-9]/g, w => {
          return this.numerals[+w]
        })
      }
      return (neg ? '-' : '') + this.prefix + x1 + x2 + this.suffix
    },
    easeOutExpo (t, b, c, d) {
      return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b
    },
    ensureNumber (n) {
      return (typeof n === 'number' && !isNaN(n))
    },
    resume () {
      if (!this.paused) return
      this.startTime = null
      this.duration = this.remaining
      this.paused = false
      this.startVal = this.count
      requestAnimationFrame(this.start)
    },
    pause () {
      cancelAnimationFrame(this.rAF)
    },
    reset () {
      this.paused = false
      this.startTime = null
      this.initialized = false
      this.initialize()
    }
  }
}
</script>
