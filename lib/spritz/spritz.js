const $space = {
  el: document.querySelector('.spritz-word'),
  html (h) { this.el.innerHTML = h }
}

const SpeedRead = {
  wpm: 300,
  words: [''],
  i: 0,
  set (sentence) {
    this.words = sentence
      .replace(/(>{0,2} ?[A-Z][^:]*:)/, (match, p1) => p1.replace(/\s/g, '＿'))
      .split(/\s+/g).filter(Boolean)
  },
  show: function () {
    const word = this.words[this.i]
    const stop = Math.round((word.length + 1) * 0.4) - 1
    $space.html('<div>' + word.slice(0, stop) + '</div><div>' + word[stop] + '</div><div>' + word.slice(stop + 1) + '</div>')
  },
  onUpdate () {
    if (this.i === this.words.length) {
      $space.html('')
      // this.pause()
      this.clear()
    } else {
      this.show()
      this.i++
    }
  },
  update () {
    this.spritz = setInterval(this.onUpdate.bind(this), 60000 / this.wpm)
  },
  clear: function () {
    this.i = 0
    clearInterval(this.spritz)
  },
  //
  pause: function () {
    this.clear()
  },
  play: function () {
    this.update()
  },
  setAndRefresh: function (text) {
    this.clear()
    this.set(text)
    this.update()
  }
}
