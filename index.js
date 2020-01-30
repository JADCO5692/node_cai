const express = require('express')
const bodyParser = require('body-parser')
const translate = require('@k3rn31p4nic/google-translate-api')
var sapcai = require('sapcai');
const app = express() 
const port =  process.env.PORT || 3000
// const port =  3000

app.use(bodyParser.json())

app.post('/sapcai',(req,res) => {
    const response = res;
    const msg = req.body.queryResult.queryText;
    const sessionID = req.body.session.substr(36,115);
    var build = new sapcai.build('5c9a27df8e428b5f449c0df8a038bb88', 'en')
    var detectlang , transtext, cairesponse;
     //google translate code start.
  translate(msg, { to: 'en' }).then(res => {
 
    detectlang = res.from.language.iso;
    transtext = res.text;
    build.dialog({ type: 'text', content: transtext}, { conversationId: sessionID })
     .then(res => {
      cairesponse = res.messages[0].content;

      translate(cairesponse, { to: detectlang }).then(res => {
        //response.send({fulfillmentText: res.text})
		response.send({
		  "payload": {
			"google": {
			  "expectUserResponse": true,
			  "richResponse": {
				"items": [
				  {
					"simpleResponse": {
					  "textToSpeech": res.text
					}
				  }
				]
			  }
			}
		  }
		})
        
        console.log(res.text); 
      }).catch(err => {
        console.error(err);
      });

     
  }).catch(err => {
    console.error(err);
  });
})
.catch(err => console.error('Something went wrong', err))


})
app.listen(port, () => { 
    console.log('Server is running on port '+port) 
  })