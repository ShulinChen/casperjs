//Question1: open the link below:
//https://pulse-360-staging.herokuapp.com/plugin/app#email?from=rbehera@pulsehr.net
// When you submit empty feedback, there will be an error poping up. And the submit button can no longer be clicked again, is that right?

var domain = 'https://pulse-360-staging.herokuapp.com';
var loginURL = domain + '/plugin/app';
var feedbackURL = domain + '/plugin/app#email?from=rbehera@pulsehr.net';


var feedbackTest = function(test){

	//click on thanks button
	casper.waitForSelector('#start-thanks', function(){
		casper.click('#start-thanks');
	});	

	casper.then(function(){
		this.sendKeys('textarea#feedback-comment', 'Good job!');
		
		var givablePoints = this.evaluate(function(){
			return $("#givable-points").text(); 
		});
		givablePoints = parseInt(givablePoints);
		

		var status50 = this.evaluate(function(){
			return $("[data-pointvalue=50]").attr('disabled');
		});

		var status100 = this.evaluate(function(){
			return $("[data-pointvalue=100]").attr('disabled');
		});
		
		//if the total points are less then 50 or 100..
		if(givablePoints < 50){
			test.assertEquals(status50, 'disabled', 'Have less than 50 points: cant give out 50 points');
		}

		if(givablePoints < 100){
			test.assertEquals(status100, 'disabled', 'Have less than 100 points:cant give out 100 points');
		}

		else{
			test.assertEquals(status50, 'enabled', 'Have over 100 points: able to give 50 points');
			test.assertEquals(status50, 'enabled', 'Have over 100 points: able to give 50 points');
		}
		
	});	
}

var submitFeedback = function(test){
	casper.waitForSelector('#give-feedback', function(){
		casper.click('#give-feedback');
	});

	casper.waitForSelector('#avatar-border', function(){
		test.assertEvalEquals(function(){
			return __utils__.findOne('.position').textContent;
		}, 'CEO', 'the position profile is right!');
	});

	casper.then(function(){
		test.assertExists('#post-submit-feedback', 'feedback is successfully created');
	});
}

var login = function(){
	casper.waitForSelector('#email', function(){
		this.fill('form#login',{
			'email' : 'admin@pulsehr.net',
			'password' : 'blue' 
		}, true);
	});	

	//click login button
	casper.then(function(){
		casper.click('#btn-login-text');
	});
}

var logoutButton = function(test){
	casper.waitForSelector('#logout', function(){
		test.assertExists('#logout', 'logout exists in the footer 1');	
	});
}

var thanksPage = function(test){
	casper.waitForSelector('#start-thanks', function(){
		test.assertExists('#start-thanks', 'start-over link works fine');
	});
}



casper.test.begin('PulseHR feedback test', 13, function(test){

	casper.start(loginURL, function(){
		casper.click('#logout'); //you might or might not need this line due to if the browser has stored the login cookie
		login();
		// test1:logout button exists
		logoutButton(test);
	});

	//open the feedback page
	casper.thenOpen(feedbackURL, function(){
		//scenario 1, if click on cancel button, we jump back to the Thanks page
		feedbackTest(test);
		
		casper.evaluate(function(){
			casper.click('#cancel-feedback');
		});

		thanksPage(test);

		//start over again, click on thanks button
		feedbackTest(test);
		submitFeedback(test);
	}); 

	//click start over to submit another feedback
	casper.evaluate(function(){
		var link = $("[data-startover=startover]").attr('href');
		casper.click(link);
	});

	//test3: make sure we went back to the 'Thanks' page
	thanksPage(test);

	//submit another feedbak that only share with Rajeeve
	feedbackTest(test);
	casper.evaluate(function(){
		$("[data-share-type=Recipient]").click();
	});

	submitFeedback(test);
	
	casper.run(function(){
		test.done();
	});

});


