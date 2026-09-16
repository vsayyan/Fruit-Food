import axios from 'axios'

// Ամբողջ site-ը այս մեկ instance-ից ա անում request. json-server-ը (հիմա)
// ու Django-ն (վերջում) երկուսն էլ REST API են, ուստի baseURL-ը փոխելը
// բավական ա backend-ը փոխարինելու համար։
export default axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})
