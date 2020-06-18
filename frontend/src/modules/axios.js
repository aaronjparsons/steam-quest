import axios from 'axios'

export default function (token) {
  return axios.create({
    baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:5001/steam-quest-ed9fd/us-central1/api' : 'https://us-central1-steam-quest-ed9fd.cloudfunctions.net/api',
    timeout: 15000,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}