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
  this.playerScore = 0
}

window.TYPER = TYPER

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
		window.setInterval(this.loop.bind(this),1)
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
	this.playerScore += 50 
	if (night === 1){
		document.body.style.background = "grey"
	}
	else {
		document.body.style.background = "powderblue"
	}	
	  
    if (this.word.left.length === 0) {
    this.guessedWords += 1
	if(this.guessedWords%10 === 0){
		this.playerScore += 25
	}
	if(this.guessedWords == 30){
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		playerScore = this.playerScore
		gameOver();
	}	
    this.generateWord()
    }

    this.word.Draw()
  }
  else {
	document.body.style.background = "red"
	this.playerScore -=25
  }
},

  registerServiceWorker: function () {
	  if("serviceWorker" in navigator){
		  navigator.serviceWorker.register("serviceWorker.js").then(function (registration){
			  //Registration was successful
			  console.log("ServiceWorker registartion successful: ", registration)
		  }, function (err) {
			  //Registration failed :(
			  console.log("ServiceWorker registration failed: ", err)
		  })
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
    this.ctx.font = '140px Century Gothic'
    this.ctx.fillText(this.left, this.canvas.width / 2, this.canvas.height / 2)
	
	this.ctx.textAlign = "left"
	this.ctx.font = "50px Century Gothic"
	this.ctx.fillText("Score:" + typer.playerScore, 250, 250)
	
	this.ctx.textAlign = "left"
	this.ctx.font = "50px Century Gothic"
	this.ctx.fillText("Guessed words:" + typer.guessedWords, 250, 300)
  },
  
  infoScreen: function(){
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
	
	this.ctx.textAlign = "center"
	this.ctx.font = "140px Century Gothic"
	this.ctx.fillText("Game over!", this.canvas.width / 2, this.canvas.height / 2 - this.canvas.height / 10)
	
	this.ctx.font = "100px Century Gothic"
	this.ctx.fillText("Score: " + typer.score, this.canvas.width / 2, this.canvas.height-this.canvas.height / 1.5)
	
	this.ctx.font= "75px Century Gothic"
	
	
	
	
	for (let i = 0, len = JSON.parse(localStorage.getItem('arr')).length; i < len; i++) {
           if (i < 10) {
			this.ctx.textAlign = 'right'
			this.ctx.font = '80px Century Gothic'
			this.ctx.fillText("Nr" + (i+1) + ")      " +
				"Name: " + JSON.parse(localStorage.getItem('arr'))[i][0] +
				"   " +
				"Score: " + JSON.parse(localStorage.getItem('arr'))[i][1],
				this.canvas.width / 2, 200 + 100*i)
            }
        }
   },

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

window.onload = function () {
  document.body.style.backgroundColor = "powderblue";
  const typer = new TYPER()
  window.typer = typer
  //kävitab 
  typer.registerServiceWorker()
}

function gameOver(){
	//typer.word.infoScreen()
	localStorage.setItem(this.name, playerScore);
	window.location.replace("scores.html")

}

function generateScoreTable() {
  /* https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_node_appendchild
     https://stackoverflow.com/questions/8419354/get-html5-localstorage-keys */

  for (var i = 0, len = localStorage.length; i < len; ++i) {
    let tableRow = document.createElement("tr")
    let th = document.createElement("th")
    let textNodeKey = document.createTextNode(localStorage.key(i))
    th.appendChild(textNodeKey)
    let td = document.createElement("td")
    let textNodeValue = document.createTextNode(localStorage.getItem(localStorage.key(i)))
    td.appendChild(textNodeValue)
    tableRow.appendChild(th)
    tableRow.appendChild(td)
    document.getElementById("scoreTableBody").appendChild(tableRow)
  }
} 

function playGame(){
	if(document.querySelector("#name").value !=""){
		name = document.querySelector("#name").value
		document.querySelector("body").innerHTML = "<canvas></canvas>"
		const typer = new TYPER()
		window.typer = typer
		typer.init()
	} else {
		alert("Please enter name!")
	}
}

function nightMode() {
  if (night === 1) {
    document.body.style.backgroundColor = "powderblue";
    night = 0;
  } else {
    document.body.style.backgroundColor = "grey";
    night = 1;
  }
}