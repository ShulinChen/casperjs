//Question1: open the link below:
//https://pulse-360-staging.herokuapp.com/plugin/app#email?from=rbehera@pulsehr.net
// When you submit empty feedback, there will be an error poping up. And the submit button can no longer be clicked again, is that right?

var staging_login_url= 'https://pulse-360-staging.herokuapp.com/plugin/app';
var staging_feedback_url = 'https://pulse-360-staging.herokuapp.com/plugin/app#email?from=rbehera@pulsehr.net';
var givable_points, status_50, status_100;

var feedback_test = function(test){

	//click on thanks button
	casper.waitForSelector('#start-thanks', function(){
		casper.click('#start-thanks');
	});	

	casper.then(function(){
		this.sendKeys('textarea#feedback-comment', 'Good job!');
	});


	// casper.evaluate(function(){
	// 	var givable_points = $("#givable-points").text(); 
	// 	var status_50 = $("[data-pointvalue=50]").attr('disabled');
	// 	var status_100 = $("[data-pointvalue=100]").attr('disabled');
	// 	console.log('givable_points', givable_points);
	// 	console.log('status_50', status_50);
	// 	console.log('status_100', status_100);
	// 	givable_points = parseInt(givable_points);	
	// });

	

	// if(givable_points < 100){
	// 	test.assertEquals(status_100, 'disabled', 'cant give out 100 points');
	// 	test.assertEquals(status_50, 'disabled', 'cant give out 50 points');
	// };	
	
	
	
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



casper.test.begin('PulseHR feedback test', 5, function(test){

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


