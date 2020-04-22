import __MASTER_TOKEN__ from './Mastertoken.js'


const BASE_URL = 'http://85.164.49.124:8000/'
//const BASE_URL = 'http://localhost:8000/'

const FORMAT_URL = (path) => {
  return BASE_URL + path
}

//Getting user token
function GET_USER_TOKEN(username, password){
  const data = {
    'username' : username,
    'password' : password
  }
  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    data : data,
    url: FORMAT_URL('api-token-auth/')
  }
  return options
}

//Getting user object
function GET_USER_CONFIG(token) {
  const options = {
    method: 'GET',
    headers: { 'Authorization': 'Token ' + token, 'content-type': 'json' },
    url: FORMAT_URL('users/')
  }
  return options
}

//Getting user games
function GET_USER_GAMES(token) {
  const options = {
    method: 'GET',
    headers: { 'Authorization': 'Token ' + token, 'content-type': 'json' },
    url: FORMAT_URL('games/')
  }
  return options
}

//Getting user highscore games
function GET_USER_HIGHSCORELIST(token) {
  const options = {
    method: 'GET',
    headers: { 'Authorization': 'Token ' + token, 'content-type': 'json' },
    url: FORMAT_URL('highscorelist/')
  }
  return options
}

//Getting all the highscores for global list
function GET_GLOBAL_HIGHSCORES() {
  const options = {
    method: 'GET',
    headers: { 'Authorization': 'Token ' + __MASTER_TOKEN__, 'content-type': 'json' },
    url: FORMAT_URL('highscorelist/')
  }
  return options
}

//Posting a new user
function POST_NEW_USER(username, firstname, lastname, email){
  const data = {
    'username' : username,
    'first_name' : firstname,
    'last_name' : lastname,
    'email' : email
  }

  const options = {
    method: 'POST',
    headers: { 'Authorization': 'Token ' + __MASTER_TOKEN__, 'content-type': 'json' },
    data : data,
    url: FORMAT_URL('users/')
  }
  return options

}

//Posting new game
function POST_USER_GAME(token, game_time, game_won, difficulty) {
  const data = {
    'game_time' : game_time,
    'game_won' : game_won,
    'difficulty': difficulty
  }
  const options = {
    method: 'POST',
    headers: { 'Authorization': 'Token ' + token, 'content-type': 'json' },
    data : data,
    url: FORMAT_URL('games/')
  }
  return options
}

//Put user online
function PUT_USER_ONLINE(id, googleId, email, isOnline) {
  const data = {
    'username' : googleId,
    'email' : email,
    'online': isOnline
  }
  const options = {
    method: 'PUT',
    headers: { 'Authorization': 'Token ' + __MASTER_TOKEN__, 'content-type': 'json' },
    data : data,
    url: FORMAT_URL(`users/${id}/`),
  }
  return options
}

//Getting all online users
function GET_ONLINE_USERS() {
  const options = {
    method: 'GET',
    headers: { 'Authorization': 'Token ' + __MASTER_TOKEN__, 'content-type': 'json' },
    url: FORMAT_URL(`onlineusers/`),
  }
  return options
}

//Posting a new base game
function POST_MULTIPLAYER_GAME(player_one, player_two, difficulty, game_code) {
  const data = {
    'player_one': player_one,
    'player_two': player_two,
    'difficulty': difficulty,
    'game_code': game_code,
  }
  const options = {
    method: 'POST',
    headers: { 'Authorization': 'Token ' + __MASTER_TOKEN__, 'content-type': 'json' },
    data: data,
    url: FORMAT_URL(`multiplayergames/`),
  }
  return options
}

//Finalize game with winner player and time 

function PUT_MULTIPLAYER_GAME(game_winner, time, game_code) {
  const data = {
    'game_winner': game_winner,
    'game_winner_time': time
  }
  const options = {
    method: 'PUT',
    headers: { 'Authorization': 'Token ' + __MASTER_TOKEN__, 'content-type': 'json' },
    data: data,
    url: FORMAT_URL(`multiplayergames/${game_code}/`),
  }
  return options
}

//Checking if a user exist
function CHECK_USER_EXIST(email) {
  const data = {
    'email': email
  }
  const options = {
    method: 'POST',
    headers: { 'Authorization': 'Token ' + __MASTER_TOKEN__, 'content-type': 'json' },
    data: data,
    url: FORMAT_URL(`validateuser/`),
  }
  return options
}


const REQUEST_FUNCTIONS = {
  GET_USER : GET_USER_CONFIG,
  GET_TOKEN : GET_USER_TOKEN,
  GET_GAMES : GET_USER_GAMES,
  GET_HIGHSCORELIST : GET_USER_HIGHSCORELIST,
  POST_USER : POST_NEW_USER,
  POST_GAME : POST_USER_GAME,
  GET_GLOBAL_HIGHSCORES : GET_GLOBAL_HIGHSCORES,
  PUT_USER_ONLINE : PUT_USER_ONLINE,
  GET_ONLINE_USERS : GET_ONLINE_USERS,
  POST_MULTIPLAYER_GAME: POST_MULTIPLAYER_GAME,
  CHECK_USER_EXIST: CHECK_USER_EXIST,
  FINALIZE_MP_GAME: PUT_MULTIPLAYER_GAME
}



export default REQUEST_FUNCTIONS