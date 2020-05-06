const config = {
  easy: {
    name: "easy",
    boardWidth: 8,
    boardHeight: 8,
    bombNum: 10,
    cellSize: 40
  },
  normal: {
    name: "normal",
    boardWidth: 16,
    boardHeight: 16,
    bombNum: 40,
    cellSize: 36
  },
  hard: {
    name: "hard",
    boardWidth: 30,
    boardHeight: 16,
    bombNum: 99,
    cellSize: 32
  },
  veryhard: {
    name: "veryhard",
    boardWidth: 48,
    boardHeight: 24,
    bombNum: 256,
    cellSize: 28
  },
  maniac: {
    name: "maniac",
    boardWidth: 68,
    boardHeight: 48,
    bombNum: 777,
    cellSize: 24
  },
  custom:{
    name: "custom",
    boardWidth: 5,
    boardHeight: 5,
    bombNum: 10,
    cellSize: 45
  }
}

export default config
