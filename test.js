//Question1: open the link below:
//https://pulse-360-staging.herokuapp.com/plugin/app#email?from=rbehera@pulsehr.net
// When you submit empty feedback, there will be an error poping up. And the submit button can no longer be clicked again, is that right?

var staging_login_url= 'https://pulse-360-staging.herokuapp.com/plugin/app';
var staging_feedback_url = 'https://pulse-360-staging.herokuapp.com/plugin/app#email?from=rbehera@pulsehr.net';

var feedback_test = function(test){

	//click on thanks button
	casper.waitForSelector('#start-thanks', function(){
		casper.click('#start-thanks');
	});	

	casper.then(function(){
		this.sendKeys('textarea#feedback-comment', 'Good job!');
		
		var givable_points = this.evaluate(function(){
			return $("#givable-points").text(); 
		});

		var status_50 = this.evaluate(function(){
			return $("[data-pointvalue=50]").attr('disabled');
		});

		var status_100 = this.evaluate(function(){
			return $("[data-pointvalue=100]").attr('disabled');
		});
		givable_points = parseInt(givable_points);
		//if the total points are less then 50 or 100..
		if(givable_points < 50){
			test.assertEquals(status_50, 'disabled', 'Have less than 50 points: cant give out 50 points');
		}

		if(givable_points < 100){
			test.assertEquals(status_100, 'disabled', 'Have less than 100 points:cant give out 100 points');
		}

		else{
			test.assertEquals(status_50, 'abled', 'Have over 100 points: able to give 50 points');
			test.assertEquals(status_50, 'abled', 'Have over 100 points: able to give 50 points');
		}
		
	});	
}

var submit_feedback = function(test){
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

var logout_button = function(test){
	casper.waitForSelector('#logout', function(){
		test.assertExists('#logout', 'logout exists in the footer 1');	
	});
}

var thanks_page = function(test){
	casper.waitForSelector('#start-thanks', function(){
		test.assertExists('#start-thanks', 'start-over link works fine');
	});
}



casper.test.begin('PulseHR feedback test', 13, function(test){

	casper.start(staging_login_url, function(){
		casper.click('#logout'); //you might or might not need this line due to if the browser has stored the login cookie
		login();
		// test1:logout button exists
		logout_button(test);
	});

	//open the feedback page
	casper.thenOpen(staging_feedback_url, function(){
		//scenario 1, if click on cancel button, we jump back to the Thanks page
		feedback_test(test);
		
		casper.evaluate(function(){
			casper.click('#cancel-feedback');
		});

		thanks_page(test);

		//start over again, click on thanks button
		feedback_test(test);
		submit_feedback(test);
	}); 

	//click start over to submit another feedback
	casper.evaluate(function(){
		var link = $("[data-startover=startover]").attr('href');
		casper.click(link);
	});

	//test3: make sure we went back to the 'Thanks' page
	thanks_page(test);

	//submit another feedbak that only share with Rajeeve
	feedback_test(test);
	casper.evaluate(function(){
		$("[data-share-type=Recipient]").click();
	});

	submit_feedback(test);
	
	casper.run(function(){
		test.done();
	});

});


