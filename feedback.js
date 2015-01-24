//https://pulse-360-staging.herokuapp.com/plugin/app#email?from=rbehera@pulsehr.net
//https://pulse-360-dev.herokuapp.com/plugin/app#email?from=rbehera@pulsehr.net
var domain = 'https://pulse-360-dev.herokuapp.com';
var feedbackURL = function(email){
  return domain + '/plugin/app#email?from=' + email;
}

var feedbackTest = function(test){
  //click on thanks button
  casper.waitForSelector('#start-thanks', function(){
    casper.click('#start-thanks');
  }); 

  casper.then(function(){
    //write the feedback
    this.sendKeys('textarea#feedback-comment', 'Good job!'); 
  
    //this part will be replaced by mojax later

    //make sure the user can give out the points based on how much they had at this moment
    // if(givablePoints < 10){
    //   test.assertEquals(status10, 'disabled', 'Have less than 50 points: cant give out 50 points');
    // }

    // if(givablePoints < 20){
    //   test.assertEquals(status20, 'disabled', 'Have less than 100 points:cant give out 100 points');
    // }

    // else{
    //   test.assertEquals(status20, 'enabled', 'Have over 100 points: able to give 50 points');
    // }
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
    
  }); 
}

var normalLogin = function(userEmail, pwd){
  //fill the form 
  casper.capture("2.png");
  casper.waitForSelector('#email', function(){
    this.fill('form#login',{
      'email' : userEmail,
      'password' : pwd 
    }, true);
  }); 

  casper.then(function(){
    casper.click('#login');
  });
}

var checkExistanceOfAttributes = function(test, attribute){
  if(attribute === "logout"){
    casper.waitForSelector("#logout", function(){
      test.assertExists("#logout", "logout button exists");
    });
  }
  else if(attribute === "start-thanks"){
    casper.waitForSelector('#start-thanks', function(){
      test.assertExists('#start-thanks', 'start-over link works fine');
    });
  }
  else
    console.log("check your checkExistanceOfAttributes function again!", "error");
}



//casper.options.verbose=true;
//casper.options.logLevel="debug";
//casper.options.clientScripts = ["jquery.mockjax.js"];
//casper.options.viewportSize = {width: 1600, height: 950};

casper.test.begin('PulseHR feedback test', 13, function(test){

 
  casper.start(feedbackURL('rbehera@pulsehr.net'), function(){  
    phantom.clearCookies(); //to clear the cookies of the login, so that we will always be in the login page when we login in
    casper.click('#logout'); //if the clearCookies failed, we have to do it manually lol.
    normalLogin('admin@pulsehr.net', 'blue');

    // casper.evaluate(function(){
    //   console.debug('start');
    //   $.mockjax({
    //     url: "/plugin/app#email?from=rbehera@pulsehr.net",
    //     responseText:{"code":0,"token":null,"company":{"name":"Pulse","uuid":"82c4ea26-588c-4251-81bd-0133762d6cdb","isReviewShown":true,"isConstantFeedbackShown":true,"emailService":"OUTLOOK|GMAIL","isBranded":true,"brandBaseURL":"http://pulse-360-dev.herokuapp.com/assets/branding/base-a8de3b234e50c4576f5296f308985927.css","brandStyleURL":"//s3.amazonaws.com/pulse-hr-prod/branding/pulse/web.css","brandStyleEmailURL":null,"brandStylePluginURL":null,"reminderFreq":40,"allowChangeAvatar":null},"setting":{"uuid":"79215f44-a89c-4630-af1f-e579f9c6abb2","version":"cccd8a","wallTitle":"Recognition","buttonTextPos":"Thanks","buttonTextNeg":"Save for 1x1","awardPointValues":"10,20","rolloverTextPos":"Let [firstname] know that you appreciate their work by saying Thanks!","rolloverTextNeg":"Write a note for your next 1x1 with [firstname].","instructionsPos":"What did [firstname] do well? Nothing? I thought so.","instructionsNeg":"Describe what you want to discuss in your next 1x1 or Review with [firstname]. Change everything about yourself","emailNewsLetter":"everyone","rewardsOn":true,"emailThanks":true,"emailThanksManagerNotif":true,"emailThanksCongrats":false,"emailRedeem":true,"emailCommentThread":true,"emailCommentThanks":true,"hideGiveablePoints":false,"exchangeRate":1,"downloadL1":"Welcome to the Spotify Peer Bonus \u0026 Feedback Program","downloadL2":"At Spotify we believe employees need frequent feedback to improve. Now you can give feedback to your coworkers directly from your inbox.","silverValue":null,"goldValue":null,"pluginStars":"0,1,2","showCFGoals":true,"showCFGoalsWeight":true,"showCFGoalsComplete":true,"showCFGoalsHashtags":true,"tags":{"positive":[{"uuid":"a689da","name":"teamwork"},{"uuid":"45f2d4","name":"leadership"},{"uuid":"ff422e","name":"execution"},{"uuid":"9cf37e","name":"aboveandbeyond"}],"negative":[{"uuid":"7569f3","name":"badcommunication"},{"uuid":"3d824d","name":"badleadership"}]}},"isManager":true,"profile":{"uuid":"89ea9276-f122-429c-acbd-1e778dc20fda","version":"cccd8a","name":"AdminTester","department":"Lead Division Architect","jobTitle":"UIX","location":"a","gender":"F","email":"admin@pulsehr.net","company":"Pulse","pictures":{"small":"https://d2kahs6as972iy.cloudfront.net/pulsehr.net/admin.jpg","medium":"https://d2kahs6as972iy.cloudfront.net/pulsehr.net/admin.jpg","large":"https://d2kahs6as972iy.cloudfront.net/pulsehr.net/admin.jpg"},"isManager":true,"constantFeedbackSetting":{"isConstantFeedbackShown":true,"isPointsGiver":true,"isNewUser":false,"timestamp":1418351999,"pointsGive":15,"pointsReceived":750,"pointsReceivedTotal":765,"buttonPeer":"positive","buttonManager":"both"}}}
    //   });
    //   console.debug('end'); 
    //   var u = new Pulse.User({ email: 'rbehera@pulsehr.net' });
    //   u.getProfile();
    // });
    
    //Scenerio1: write the feedback and submit
    casper.then(function(){
      feedbackTest(test);
    })

    // casper.then(function(){
    //   test.assertEquals(num, 15);
    // });    
  
    //In the post-feedback page, check to see there is logout option
    checkExistanceOfAttributes(test, "logout");
    
    //get back to the original feedback page, write another feedback
    casper.waitForSelector('#btn-login-text', function(){
      casper.click('#btn-login-text');
    });
    
    feedbackTest(test);
    
    // check to see if click on cancel button, we go back to thanks page again
    casper.evaluate(function(){
      casper.click('#cancel-feedback');
    });

    checkExistanceOfAttributes(test, "start-thanks");

    //scenario 2: write feedback
    feedbackTest(test);

    //click start over to submit another feedback
    casper.evaluate(function(){
      var link = $("[data-startover=startover]").attr('href');
      casper.click(link);
    });

    //check2: make sure we went back to the 'Thanks' page
    
    checkExistanceOfAttributes(test, "start-thanks");

    //Scenerio 3: submit another feedbak that only share with Rajeeve
    feedbackTest(test);
    casper.evaluate(function(){
      $("[data-share-type=Recipient]").click();
    });

  });//end of casper.start
   

  casper.run(function(){
    this.log("Test finishing");
    test.done();
  });

});


