require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const app = express()
const movies = require('./movies-data.json')

app.use(helmet())
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
app.use(cors())

app.use(function validateBearerToken(req, res, next){
const author = req.get('Authorization')
const apikey = process.env.API_TOKEN

if(!author || author.split(' ')[1] !== apikey){
	return res.status(401).json({error:  'authorization required'})
}
next()
})

app.get('/movies', (req, res)=>{
	const genre = req.query.genre
	const country = req.query.country
	const avg_vote = req.query.avg_vote
	let result = movies

	if(genre){
		result = result.filter(movie => movie.genre.toLowerCase().includes(genre.toLowerCase()))
	}
	if(country){
		result = result.filter(movie => movie.country.toLowerCase().includes(country.toLowerCase()))
	}

	if(avg_vote){
		result = result.filter(movie=> movie.avg_vote >= Number(avg_vote))
	}
	res.json(result)

})

app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})

const PORT = process.env.PORT || 8000

app.listen(PORT, ()=>{
	console.log('listening!')
})