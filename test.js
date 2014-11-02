var firstUrl;
casper.test.begin('PulseHR feedback test', 2, function(test){
	casper.start('http://pulse-360-dev.herokuapp.com/plugin/app', function(){
		this.fill('form#login',{
			'email' : 'admin@pulsehr.net',
			'password' : 'blue' 
		}, true);
	});

	//make sure the page is loaded before clicking on 'login' button
	casper.then(function(){
		casper.wait(3000, function(){
			// casper.capture('2.png');
			casper.click('#btn-login-text');
		});
	});

	// here there might be a better way to implement rather than wait for random time
	casper.wait(3000, function(){
		test.assertExists('#logout', 'logout exists in the footer');	
	});

	casper.thenOpen('http://pulse-360-dev.herokuapp.com/plugin/app#email?from=rbehera@pulsehr.net', function(){
		casper.waitForSelector('#start-thanks', function(){
			casper.click('#start-thanks');
		});	

		casper.then(function(){
			this.sendKeys('textarea#feedback-comment', 'Good job!');
		});

		casper.wait(2000, function(){
			casper.click('#give-feedback');
		});
		
		//get the href of the link we gonna jump to 
		casper.wait(2000, function(){
			var firstUrl = casper.getElementAttribute('#post-submit-feedback > a.btn.btn-success', 'href');	
		});

		//click on the specific slector
		casper.then(function() {
			// this.click("a[href='/app#cf/wall'][data-goto = 'wall']"[0]);
			this.click("[data-goto = 'wall'][0]");
		});

		//make sure the selector mathch

		casper.wait(10000, function(){
			test.assertUrlMatch("/app#cf/wall", 'Recognition page is fine');
		});
		//go to the Recognition page and then test.assertUrlMatch

		

		
	}); //thenopen


	casper.run(function(){
		test.done();
	});
});


