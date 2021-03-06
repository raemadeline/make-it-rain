width = null
height = null
imageHeight = 100
fallingMoney = []
canvasContext = null
interval = null

width = $(document).width()
height = $(document).height()
canvas = $('<canvas class="rain"></canvas>')
canvas.attr('width', width)
canvas.attr('height', height)
canvas.appendTo('html')
initAnimation()

function initAnimation() {
  numMoney = 1000
  speedOffset = 10
  speedRange = 5
  numImages = 6
  frameRate = 1000 / 30 // 30 frames per second
  animationLength = 10000 // 10 seconds

  canvasContext = $('.rain')[0].getContext('2d')

  for(var index = 0; index < numMoney; index++) {

    isOdd = index % 2 == 1
    direction = 0;
    if(isOdd)
      direction = 1;
    else
      direction = -1;

    money = {
      image: new Image(),
      x: _random(width),
      y: _random(-height * 2, -imageHeight),
      angle: _random(2 * Math.PI),
      speed: speedOffset + _random(speedRange),
      currentFrame: 0,
      direction: direction
    }

    imageIndex = _random(numImages)
    imagePath = "images/money_" + imageIndex + ".png"
    imageURL = chrome.extension.getURL(imagePath);
    money.image.src = imageURL
    fallingMoney.push(money)
  }

  interval = setInterval(function() {
    draw()
  }, frameRate)

  setTimeout(function() {
    endAnimation()
  }, animationLength)
}

function draw() {
  clearWindow()

  fallingMoney.forEach(function(money, index) {
    drawRotatedImage(money)

    money.currentFrame += 1
    money.y += money.speed
    money.angle += money.direction * 0.1
    radius = money.direction * (10 + (index % 6))
    money.x += Math.sin((money.currentFrame + index) / (2 * Math.PI)) * radius
  })
}

function clearWindow() {
  canvasContext.clearRect(0, 0, width, height)
}

function drawRotatedImage(money) {
  canvasContext.save()
  canvasContext.translate(money.x, money.y)
  canvasContext.rotate(money.angle)
  canvasContext.drawImage(money.image, 0, 0)
  canvasContext.restore()
}

function endAnimation() {
  debugger
  clearInterval(interval)
  fallingMoney = []
  canvas.detach()
}

function _random(lowVal, highVal) {
  if (highVal === undefined) {
    highVal = lowVal
    lowVal = 0
  }

  randVal = Math.floor(Math.random() * (highVal - lowVal)) + lowVal
  return randVal
}
