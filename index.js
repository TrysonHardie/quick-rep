const audioPlayer = document.getElementById('audiofile')
document.onkeyup = (e) => {
  if (e.keyCode === 32) {
    e.preventDefault()
    audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause()
  }
}

function AudioPlayer () {
  audioPlayer.src = audioSrc

  let currentIndex = 0

  let refresher = () => {}
  const _r = () => {
    const ct = audioPlayer.currentTime * 1000
    const index = syncData.findIndex(
      (element) => (ct >= element.startTime &&
                    ct <= element.endTime))
    if ((currentIndex !== index) && (index !== -1)) {
      currentIndex = index
      $setAndRefresh(syncData[index].text)
      updateSlide(ct)
    }
  }
  audioPlayer.ontimeupdate = () => refresher()
  audioPlayer.oncanplay = () => { refresher = _r }
  audioPlayer.onplay = () => timer.play()
  audioPlayer.onpause = () => timer.pause()
}

//
function $setAndRefresh (text) {
  console.log('set and refresh', text)
  SpeedRead.setAndRefresh(text)
}

//
function updateSlide (ct) {
  pager.setCurrent(ct)
}

function displaySlide () {
  queueRenderPage(pager.getCurrent())
}

const pager = {
  current: 1,
  timing: undefined,
  n: 0,
  totalNumber: 1,
  updateNumPages (totalTime, num) {
    this.totalNumber = num
    this.timing = totalTime / num
  },
  // shows n slides in a loop
  getCurrent () {
    switch (this.n) {
      case 0:
        this.n = 1
        break
      case 1:
        this.n = 2
        break
      case 2:
        this.n = 0
        break
      default:
    }
    return Math.min(this.current + this.n, this.totalNumber)
  },
  setCurrent (currentTime) {
    this.current = Math.floor(currentTime / this.timing)
  }
}

const timer = {
  workTimer: undefined,
  myPlayFunction: undefined,
  showSlideTimer: undefined,
  work: function () {
    const ratechanger = {
      playbackRateANDwpm: function (rate) {
        audioPlayer.playbackRate = rate
        SpeedRead.wpm = 300 * rate
      },
      setFast: function () {
        this.playbackRateANDwpm(2.5)
      },
      setNormal: function () {
        this.playbackRateANDwpm(1.0)
      }
    }

    const w = () => {
      console.log(3, this.myPlayFunction, ratechanger.playbackSpeed)
      console.log(this)
      ratechanger.setFast()
      clearTimeout(this.myPlayFunction)
      this.myPlayFunction = setTimeout(r, 64000)
    }
    const r = function () {
      console.log(1000)
      ratechanger.setNormal()
    }
    this.workTimer = setInterval(w, 80000)
    w()
  },

  play: function () {
    this.work()
    SpeedRead.play()
    this.showSlideTimer = setInterval(() => {
      displaySlide()
    }, 10000)
  },

  pause: function () {
    clearTimeout(this.myPlayFunction)
    clearInterval(this.workTimer)
    clearInterval(this.showSlideTimer)
    SpeedRead.pause()
  }
}

AudioPlayer()
