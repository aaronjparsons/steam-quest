import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:3000'
})

export const getGameLibrary = async () => {
  const library = await API.get('/gameLibrary')
  return library.data.games
}

export const submitVote = async (appid, name) => {
  const response = await API.post('/submitVote', {
    appid,
    name
  })
  return response
}
