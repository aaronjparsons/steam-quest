import axios from 'axios'

export default function (token, id) {
  const url = process.env.NODE_ENV === 'development' ? 'http://localhost:5001/steam-quest-ed9fd/us-central1/api' : 'https://us-central1-steam-quest-ed9fd.cloudfunctions.net/api'
  return axios.create({
    baseURL: `${url}/channels/${id}`,
    timeout: 15000,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}