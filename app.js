/* TYPER */
var night;
const TYPER = function () {
  if (TYPER.instance_) {
    return TYPER.instance_
  }
  TYPER.instance_ = this

  this.WIDTH = window.innerWidth
  this.HEIGHT = window.innerHeight
  this.canvas = null
  this.ctx = null

  this.words = []
  this.word = null
  this.wordMinLength = 5
  this.guessedWords = 0

  this.init()  
  
}

window.TYPER = TYPER

function nightMode() {
  if (night === 1) {
    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";
    night = 0;
  } else {
    document.body.style.backgroundColor = "rgb(75, 75, 75)";
    night = 1;
  }
}

TYPER.prototype = {
  init: function () {
    this.canvas = document.getElementsByTagName('canvas')[0]
    this.ctx = this.canvas.getContext('2d')

    this.canvas.style.width = this.WIDTH + 'px'
    this.canvas.style.height = this.HEIGHT + 'px'

    this.canvas.width = this.WIDTH * 2
    this.canvas.height = this.HEIGHT * 2

    this.loadWords()
  },

  loadWords: function () {
    const xmlhttp = new XMLHttpRequest()

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4 && (xmlhttp.status === 200 || xmlhttp.status === 0)) {
        const response = xmlhttp.responseText
        const wordsFromFile = response.split('\n')

        typer.words = structureArrayByWordLength(wordsFromFile)

        typer.start()
      }
    }

    xmlhttp.open('GET', './lemmad2013.txt', true)
    xmlhttp.send()
  },

  start: function () {
    this.generateWord()
    this.word.Draw()

    window.addEventListener('keypress', this.keyPressed.bind(this))
	this.startTime = new Date().getTime()
	window.setInterval(this.loop.bind(this), 1)
  },
  
  loop: function() {
	  this.word.Draw()
	  const currentTime = new Date().getTime()
	  this.counter = currentTime - this.startTime
  },  

  generateWord: function () {
    const generatedWordLength = this.wordMinLength + parseInt(this.guessedWords / 5)
    const randomIndex = (Math.random() * (this.words[generatedWordLength].length - 1)).toFixed()
    const wordFromArray = this.words[generatedWordLength][randomIndex]

    this.word = new Word(wordFromArray, this.canvas, this.ctx)
  },

  
  keyPressed: function (event) {
    const letter = String.fromCharCode(event.which)

    if (letter === this.word.left.charAt(0)) {
      this.word.removeFirstLetter()

      if (this.word.left.length === 0) {
        this.guessedWords += 1
		if (this.guessedWords == 5){
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
			gameFinish();
		}
		
		
        this.generateWord()
      }

      this.word.Draw()
    }
  }
}

/* WORD */
const Word = function (word, canvas, ctx) {
  this.word = word
  this.left = this.word
  this.canvas = canvas
  this.ctx = ctx
}

Word.prototype = {
  Draw: function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.textAlign = 'center'
    this.ctx.font = '140px Courier'
    this.ctx.fillText(this.left, this.canvas.width / 2, this.canvas.height / 2)
	
	this.ctx.textAlign = 'center'
    this.ctx.font = '140px Arial'
    this.ctx.fillText(typer.counter, 300, 300)
	
	this.ctx.textAlign = 'center'
    this.ctx.font = '140px Arial'
    this.ctx.fillText(typer.guessedWords, 500, 500)
  },//hetkel kuvab nii kulunud aega kui ka skoori

  removeFirstLetter: function () {
    this.left = this.left.slice(1)
  }
}

/* HELPERS */
function structureArrayByWordLength (words) {
  let tempArray = []

  for (let i = 0; i < words.length; i++) {
    const wordLength = words[i].length
    if (tempArray[wordLength] === undefined)tempArray[wordLength] = []

    tempArray[wordLength].push(words[i])
  }

  return tempArray
}

function startGame(){
	const typer = new TYPER()
	window.typer = typer
}

function restartGame(){
	this.guessedWords = 0
	const typer = new TYPER()
	window.typer = typer
	typer.generateWord()
	typer.word.Draw()

}

function gameFinish(){
	let r = confirm("Game over! \n Your Score: " + "\n Again?")
	if(r == true){
		location.reload()
	}
	else {
		location.href = 'first.html';
	}
}

window.onload = function () {
  const typer = new TYPER()
  window.typer = typer
}
