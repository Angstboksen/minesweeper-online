import __MASTER_TOKEN__ from './Mastertoken.js'


const BASE_URL = 'http://localhost:8000/'

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

const REQUEST_FUNCTIONS = {
  GET_USER : GET_USER_CONFIG,
  GET_TOKEN : GET_USER_TOKEN,
  GET_GAMES : GET_USER_GAMES,
  GET_HIGHSCORELIST : GET_USER_HIGHSCORELIST,
  POST_USER : POST_NEW_USER,
  POST_GAME : POST_USER_GAME
}



export default REQUEST_FUNCTIONS