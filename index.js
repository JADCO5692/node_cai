const express = require('express')
const bodyParser = require('body-parser')
const translate = require('@k3rn31p4nic/google-translate-api')
var sapcai = require('sapcai');
const app = express() 
const port =  process.env.PORT || 3000
// const port =  3000

app.use(bodyParser.json())

app.post('/sapcai',(req,res3) => {
    const response = res3;
    const msg = req.body.queryResult.queryText;
    const sessionID = req.body.session.substr(36,115);
    var build = new sapcai.build('5c9a27df8e428b5f449c0df8a038bb88', 'en')
    var detectlang , transtext, cairesponse, i, reponseMesLen;
	var response_text = {
	  "payload": {
		"google": {
		  "expectUserResponse": true,
		  "richResponse": {
			"items": [						  
			]
		  }
		}
	  }
	};
	
	var count  = 0; 
	var count1  = 0;

    //google translate code starts
	translate(msg, { to: 'en' }).then(res2 =>{ 
		detectlang = res2.from.language.iso;
		transtext = res2.text;
		build.dialog({ type: 'text', content: transtext}, { conversationId: sessionID }).then(res =>{					
			//console.log(res);
			reponseMesLen = res.messages.length;
			for (i = 0; i < res.messages.length; i++) 
			{				
				if(res.messages[i].content != 'The  is ')
				{
					count = count + 1;
					cairesponse = res.messages[i].content;
					translate(cairesponse, { to: detectlang }).then(res1 => {
						count1 = count1 + 1;
						response_text.payload.google.richResponse.items.push(
							{
								"simpleResponse": 
								{
									"textToSpeech": res1.text
								}
							})
						console.log('here 3');
						console.log(JSON.stringify(response_text));
						//console.log(res1.text); 
						if(count1 == count)
						{
							response.send(response_text);
						}
					}).catch(err => {
					console.error(err);
					});							
				}
			}		
		}).catch(err =>{
			console.error(err);
		});
	})
	.catch(err => console.error('Something went wrong', err))

})

app.listen(port, () => { 
    console.log('Server is running on port '+port) 
})