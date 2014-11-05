casper.test.begin('PulseHR feedback test', 2, function(test){
	casper.start('http://pulse-360-dev.herokuapp.com/plugin/app', function(){
		casper.capture('1.png');
		this.fill('form#login',{
			'email' : 'admin@pulsehr.net',
			'password' : 'blue' 
		}, true);
		casper.cl
	});

	//make sure the page is loaded before clicking on 'login' button
	casper.then(function(){
		casper.click('#btn-login-text');
	});

	// logout button
	casper.waitForSelector('#footer', function(){
		test.assertExists('#logout', 'logout exists in the footer');	
	});

	casper.thenOpen('http://pulse-360-dev.herokuapp.com/plugin/app#email?from=rbehera@pulsehr.net', function(){
		casper.waitForSelector('#start-thanks', function(){
			casper.click('#start-thanks');
		});	

		casper.then(function(){
			this.sendKeys('textarea#feedback-comment', 'Good job!');
		});

		casper.waitForSelector('#give-feedback', function(){
			casper.click('#give-feedback');
		});

		casper.waitForSelector('#avatar-border', function(){
			test.assertEvalEquals(function(){
				return __utils__.findOne('.position').textContent;
			}, 'CEO', 'the position is right!');
		});
	
		//get the href of the link we gonna jump to 
		// casper.then(function(){
		// 	var firstUrl = casper.getElementAttribute('#post-submit-feedback > a.btn.btn-success', 'href');	

		// });

		// //click on the specific slector
		// casper.then(function() {
		// 	// this.click("a[href='/app#cf/wall'][data-goto = 'wall']"[0]);
		// 	this.click("[data-goto = 'wall'][0]");
		// });

		// //make sure the selector mathch

		// casper.wait(10000, function(){
		// 	test.assertUrlMatch("/app#cf/wall", 'Recognition page is fine');
		// });
		// //go to the Recognition page and then test.assertUrlMatch
		
	}); //thenopen


	casper.run(function(){
		test.done();
	});
});


