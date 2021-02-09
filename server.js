const express = require('express')
const bodyParser=require('body-parser')
const request=require('request')

const app=express()

const server=require('http').createServer(app)

const PORT=process.env.PORT || 3000

app.use(express.static(__dirname+'/public'))


app.use(bodyParser.urlencoded({extended:true}))

app.set('view engine', 'ejs')

app.get('/',function(req,res){
	res.sendFile(__dirname+'/index.html')
})

app.post('/',function(req,res){
	var username=req.body.username;
	var url=`https://codeforces.com/api/user.info?handles=${username}`

	request(url,function(err,resp,body)
	{
		if(res.statusCode==200)
			console.log("OK")
		var codeforces=JSON.parse(body)
		if(err)
			res.render('response',{data:null,error:'There is a error'})
		else
		{
			var codeforces=JSON.parse(body)
			if(codeforces.status=='FAILED')
				res.render('response',{data:null,error:'There is a error'})
			else
			{
				var data={firstName:codeforces.result[0].firstName,lastName:codeforces.result[0].lastName,
					      currentRating:codeforces.result[0].rating,
				          maxRating:codeforces.result[0].maxRating,currentRank:codeforces.result[0].rank,
				          maxRank:codeforces.result[0].maxRank,
				          country:codeforces.result[0].country}

				res.render('response',{data:data,error:null})
				console.log(data)
			}
		}
	})
})

server.listen(PORT, function(){
	console.log(`Server is listening on ${PORT}...`)
})