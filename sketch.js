//browser-sync start --server -f -w
class Agent {
  constructor(cords, tag) {
    this.cords = cords;
    this.tag = tag
  }
  sense() {
    let surroundings = []
    let filled = false
    for (let y = this.cords.y - 1; y <= this.cords.y + 1; y++) {
      for (let x = this.cords.x - 1; x <= this.cords.x + 1; x++) {
        if (x != this.cords.x || y != this.cords.y) {
          filled = false
          if (map[y][x] == 1) {
            filled = true
          } else {
            scouts.forEach(scout => {
              if (scout.cords.x == x && scout.cords.y == y) {
                filled = true
              }
            });
            heavies.forEach(heavy => {
              if (heavy.cords.x == x && heavy.cords.y == y) {
                filled = true
              }
            });
            if (this.tag == 'Heavy') {
              finishes.forEach(finish => {
                if (finish.x == x && finish.y == y) {
                  filled = true
                }
              });
            }
          }
          filled ? surroundings.push(1) : surroundings.push(0)
        }
      }
    }
    return surroundings
  }
  decide() {
    let surroundings = this.sense()
    let perception = new Array(4).fill(0);
    if (surroundings[1] == 1 || surroundings[2] == 1) {
      perception[0] = 1
    }
    if (surroundings[4] == 1 || surroundings[7] == 1) {
      perception[1] = 1
    }
    if (surroundings[5] == 1 || surroundings[6] == 1) {
      perception[2] = 1
    }
    if (surroundings[0] == 1 || surroundings[3] == 1) {
      perception[3] = 1
    }
    return perception;
  }
  act() {
    let perception = this.decide()
    if (perception[0] == 1 && perception[1] == 0) {
      this.cords.x++
      return
    }
    if (perception[1] == 1 && perception[2] == 0) {
      this.cords.y++
      return
    }
    if (perception[2] == 1 && perception[3] == 0) {
      this.cords.x--
      return
    }
    if (perception[3] == 1 && perception[0] == 0) {
      this.cords.y--
      return
    }
    if (map[this.cords.y - 1][this.cords.x] != 1) {
      this.cords.y--
    }
  }
}

function setup() {
  size = 20
  play = false
  edit = false
  currentBlock = 0
  speed = 0
  map = []
  scouts = []
  heavies = []
  finishes = [createVector(14, 6), createVector(14, 5), createVector(14, 4)]
  wall = loadImage("img/wall.png");
  floor = loadImage("img/floor.png");
  exit = loadImage("img/exit.png")
  scout = loadImage("img/agent.png")
  heavy = loadImage("img/agent2.png")
  createCanvas(windowWidth, windowHeight);
  map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    [1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ]
  finishes.forEach(element => {
    map[element.y][element.x] = 2
  });
  heavies.push(new Agent(createVector(8, 1), 'Heavy'))
  heavies.push(new Agent(createVector(10, 3), 'Heavy'))
  nextButton = createButton('Next');
  nextButton.position(windowWidth - 300, 10);
  nextButton.mouseClicked(next);
  playButton = createButton('Play/Stop');
  playButton.position(windowWidth - 300, 40);
  playButton.mouseClicked(() => {
    play = !play
  });
  speedSlider = createSlider(100, 1000, 500);
  speedSlider.position(windowWidth - 300, 70);
  randomizeButton = createButton('Randomize')
  randomizeButton.position(windowWidth - 300, 140);
  randomizeButton.mouseClicked(randomize);
  editButton = createButton('Edit Mode')
  editButton.position(windowWidth - 300, 170);
  editButton.mouseClicked(() => {
    edit = !edit
  });
  clearButton = createButton('Clear')
  clearButton.position(windowWidth - 300, 200);
  clearButton.mouseClicked(() => {
    scouts = []
    heavies = []
    finishes = []
    for (r = 0; r < map.length; r++) {
      for (c = 0; c < map[0].length; c++) {
        map[r][c] = 0
      }
    }
  });
}

function draw() {
  background(255)
  text(speedSlider.value().toString(), windowWidth - 300, 110)
  if (play && millis() > speed) {
    next()
    speed += speedSlider.value()
  } else if (!play) {
    speed = millis()
  }
  display()
}

function display() {
  for (r = 0; r < map.length; r++) {
    for (c = 0; c < map[0].length; c++) {
      if (map[r][c] == 0) {
        image(floor, c * 25, r * 25, 25, 25);
      } else if (map[r][c] == 1) {
        image(wall, c * 25, r * 25, 25, 25);
      } else if (map[r][c] == 2) {
        image(exit, c * 25, r * 25, 25, 25);
      }
    }
  }
  scouts.forEach(element => {
    image(scout, element.cords.x * 25, element.cords.y * 25, 25, 25)
  });
  heavies.forEach(element => {
    image(heavy, element.cords.x * 25, element.cords.y * 25, 25, 25)
  });
  if (edit) {
    fill(51);
    rect(windowWidth - 402.5, 7.5 + 30 * (currentBlock), 30, 30)
    image(floor, windowWidth - 400, 10, 25, 25)
    image(wall, windowWidth - 400, 40, 25, 25)
    image(exit, windowWidth - 400, 70, 25, 25)
    image(scout, windowWidth - 400, 100, 25, 25)
    image(heavy, windowWidth - 400, 130, 25, 25)
  }
}

function next() {
  scouts.forEach((agent, index, object) => {
    agent.act()
    finishes.forEach(finish => {
      if (finish.x == agent.cords.x && finish.y == agent.cords.y) {
        object.splice(index, 1)
      }
    });
    if (scouts.length == 0) {
      alert("Scouts Won!")
      randomize()
    }
  });
  heavies.forEach((agent) => {
    agent.act()
    scouts.forEach((scout, scoutIndex, scoutArray) => {
      if (Math.abs(scout.cords.x - agent.cords.x) <= 1 && Math.abs(scout.cords.y - agent.cords.y) <= 1) {
        scoutArray.splice(scoutIndex, 1)
      }
    });
    if (scouts.length == 0) {
      alert("Heavies Won!")
      randomize()
    }
  });
}

function randomize() {
  map = []
  scouts = []
  heavies = []
  finishes = []
  for (r = 0; r < size; r++) {
    row = []
    for (c = 0; c < size; c++) {
      if (r == 0 || r == size - 1 || c == 0 || c == size - 1) {
        row.push(1)
      } else {
        row.push(0)
      }
    }
    map.push(row)
  }
  exitSide = getRndInteger(1, 4)
  if (exitSide == 1) {
    n = getRndInteger(0, size - 4)
    map[0][n + 1] = 2
    map[0][n + 2] = 2
    finishes = [createVector(n + 1, 0), createVector(n + 2, 0)]
  } else if (exitSide == 2) {
    n = getRndInteger(0, size - 4)
    map[n + 1][19] = 2
    map[n + 2][19] = 2
    finishes = [createVector(19, n + 1), createVector(19, n + 2)]
  } else if (exitSide == 3) {
    n = getRndInteger(0, size - 4)
    map[19][n + 1] = 2
    map[19][n + 2] = 2
    finishes = [createVector(n + 1, 19), createVector(n + 2, 19)]
  } else if (exitSide == 4) {
    n = getRndInteger(0, size - 4)
    map[n + 1][0] = 2
    map[n + 2][0] = 2
    finishes = [createVector(0, n + 1), createVector(0, n + 2)]
  }
  for (r = 1; r < map.length - 1; r++) {
    for (c = 1; c < map[0].length - 1; c++) {
      if (mapDoubleSurroundings(r, c).indexOf(2) == -1) {
        adjacents = adjacent(r, c)
        nAdjacents = 0
        adjacents.forEach(element => {
          nAdjacents += element
        });
        if (mapDoubleSurroundings(r, c).every((val) => val === 0) && randBool()) {
          map[r][c] = 1
        } else
        if (nAdjacents == 1) {
          if (adjacents[0] == 1 && getDome(r + 1, c) == 0 && randBool()) {
            map[r][c] = 1
          } else if (adjacents[1] == 1 && getDome(r, c + 1) == 0 && randBool()) {
            map[r][c] = 1
          } else if (adjacents[2] == 1 && getDome(r, c - 1) == 0 && randBool()) {
            map[r][c] = 1
          } else if (adjacents[3] == 1 && getDome(r - 1, c) == 0 && randBool()) {
            map[r][c] = 1
          }
        }
      }
    }
  }
  spawnScouts(2)
  spawnHeavies(2)
  speed = millis()
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randBool() {
  return Math.random() >= 0.5
}

function mapDoubleSurroundings(r, c) {
  surroundings = []
  for (y = Math.max(0, r - 2); y <= Math.min(r + 2, map.length - 1); y++) {
    for (x = Math.max(0, c - 2); x <= Math.min(c + 2, map[0].length - 1); x++) {
      if (x != c || y != r) {
        surroundings.push(map[y][x])
      }
    }
  }
  return surroundings
}

function getHorizontal(r, c) {
  count = 0
  for (x = Math.max(0, c - 2); x <= Math.min(c + 2, map[0].length - 1); x++) {
    if (x != c) {
      count += map[r][x]
    }
  }
  return count
}

function getVertical(r, c) {
  count = 0
  for (y = Math.max(0, r - 2); y <= Math.min(r + 2, map.length - 1); y++) {
    if (y != r) {
      count += map[y][c]
    }
  }
  return count
}

function adjacent(r, c) {
  adjacents = []
  for (y = Math.max(0, r - 1); y <= Math.min(r + 1, map.length - 1); y++) {
    for (x = Math.max(0, c - 1); x <= Math.min(c + 1, map[0].length - 1); x++) {
      if ((x != c || y != r) && (x == c || y == r)) {
        adjacents.push(map[y][x])
      }
    }
  }
  return adjacents
}

function getDome(r, c) {
  count = 0
  for (y = Math.max(0, r - 1); y <= Math.min(r + 1, map.length - 1); y++) {
    for (x = Math.max(0, c - 1); x <= Math.min(c + 1, map[0].length - 1); x++) {
      count += map[y][x]
    }
  }
  return count
}

function spawnScouts(n) {
  nScouts = 0
  while (n > nScouts) {
    randR = getRndInteger(1, 18)
    randC = getRndInteger(1, 18)
    if (map[randR][randC] == 0) {
      scouts.push(new Agent(createVector(randC, randR), 'Scout'))
      nScouts += 1
    }
  }
}

function spawnHeavies(n) {
  nHeavies = 0
  while (n > nHeavies) {
    randR = getRndInteger(1, 18)
    randC = getRndInteger(1, 18)
    if (map[randR][randC] == 0) {
      heavies.push(new Agent(createVector(randC, randR), 'Heavy'))
      nHeavies += 1
    }
  }
}

function mouseDragged() {
  x = Math.floor(mouseX / 25)
  y = Math.floor(mouseY / 25)
  if (edit && y < map.length && x < map[0].length) {
    if (currentBlock <= 1) {
      finishes.forEach((finish, finishIndex, finishList) => {
        if (finish.x == x && finish.y == y) {
          finishList.splice(finishIndex, 1)
        }
      });
      scouts.forEach((scout, scoutIndex, scoutList) => {
        if (scout.cords.x == x && scout.cords.y == y) {
          scoutList.splice(scoutIndex, 1)
        }
      });
      heavies.forEach((heavy, heavyIndex, heavyList) => {
        if (heavy.cords.x == x && heavy.cords.y == y) {
          heavyList.splice(heavyIndex, 1)
        }
      });
      map[y][x] = currentBlock
    } else if (currentBlock == 2) {
      alreadyOccupied = false
      finishes.forEach(finish => {
        if (finish.x == x && finish.y == y) {
          alreadyOccupied = true
        }
      });
      if (!alreadyOccupied) {
        finishes.push(createVector(x, y))
        map[y][x] = 2
      }
    } else if (currentBlock == 3) {
      alreadyOccupied = false
      scouts.forEach(scout => {
        if (scout.x == x && scout.y == y) {
          alreadyOccupied = true
        }
      });
      if (!alreadyOccupied && map[y][x] == 0) {
        scouts.push(new Agent(createVector(x, y), 'Scout'))
      }
    } else if (currentBlock == 4) {
      alreadyOccupied = false
      heavies.forEach(heavy => {
        if (heavy.x == x && heavy.y == y) {
          alreadyOccupied = true
        }
      });
      if (!alreadyOccupied && map[y][x] == 0) {
        heavies.push(new Agent(createVector(x, y), 'Heavy'))
      }
    }
  }
}

function mouseClicked() {
  x = Math.floor(mouseX / 25)
  y = Math.floor(mouseY / 25)
  if (edit) {
    if (y < map.length && x < map[0].length) {
      if (currentBlock <= 1) {
        finishes.forEach((finish, finishIndex, finishList) => {
          if (finish.x == x && finish.y == y) {
            finishList.splice(finishIndex, 1)
          }
        });
        scouts.forEach((scout, scoutIndex, scoutList) => {
          if (scout.cords.x == x && scout.cords.y == y) {
            scoutList.splice(scoutIndex, 1)
          }
        });
        heavies.forEach((heavy, heavyIndex, heavyList) => {
          if (heavy.cords.x == x && heavy.cords.y == y) {
            heavyList.splice(heavyIndex, 1)
          }
        });
        map[y][x] = currentBlock
      } else if (currentBlock == 2) {
        alreadyOccupied = false
        finishes.forEach(finish => {
          if (finish.x == x && finish.y == y) {
            alreadyOccupied = true
          }
        });
        if (!alreadyOccupied) {
          finishes.push(createVector(x, y))
          map[y][x] = 2
        }
      } else if (currentBlock == 3) {
        alreadyOccupied = false
        scouts.forEach(scout => {
          if (scout.x == x && scout.y == y) {
            alreadyOccupied = true
          }
        });
        if (!alreadyOccupied && map[y][x] == 0) {
          scouts.push(new Agent(createVector(x, y), 'Scout'))
        }
      } else if (currentBlock == 4) {
        alreadyOccupied = false
        heavies.forEach(heavy => {
          if (heavy.x == x && heavy.y == y) {
            alreadyOccupied = true
          }
        });
        if (!alreadyOccupied && map[y][x] == 0) {
          heavies.push(new Agent(createVector(x, y), 'Heavy'))
        }
      }
    } else if (mouseX > windowWidth - 400 && mouseX < windowWidth - 375 && mouseY > 10 && mouseY < 35) {
      currentBlock = 0
    } else if (mouseX > windowWidth - 400 && mouseX < windowWidth - 375 && mouseY > 40 && mouseY < 65) {
      currentBlock = 1
    } else if (mouseX > windowWidth - 400 && mouseX < windowWidth - 375 && mouseY > 70 && mouseY < 95) {
      currentBlock = 2
    } else if (mouseX > windowWidth - 400 && mouseX < windowWidth - 375 && mouseY > 100 && mouseY < 125) {
      currentBlock = 3
    } else if (mouseX > windowWidth - 400 && mouseX < windowWidth - 375 && mouseY > 130 && mouseY < 155) {
      currentBlock = 4
    }
  }
}