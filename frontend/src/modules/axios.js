import axios from 'axios'

export default function (token) {
  return axios.create({
    baseURL: 'https://us-central1-steam-quest-ed9fd.cloudfunctions.net/api',
    timeout: 10000,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}