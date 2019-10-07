import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:3000'
})

export const getGameLibrary = async () => {
  const library = await API.get('/gameLibrary')
  return library.data.games
}

export const getTopVotes = async () => {
  const topGames = await API.get('/topGames')
  return topGames.data.games
}

export const submitVote = async (appid, name) => {
  const response = await API.post('/submitVote', {
    appid,
    name
  })
  return response
}

export const login = async (username, password) => {
  const response = await API.post('/login', {
    username,
    password
  })
  return response
}
