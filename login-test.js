//blah blah blah
//test
casper.test.begin('PulseHR login test', 6, function (test){
    casper.start('http://pulse-360-dev.herokuapp.com/plugin/app', function(){
        test.assertExists('#email-form-group > div > span > i', 'the email icon exists');
        test.assertExists('#email', 'the email box exists');
        test.assertExists('#password-form-group > div > span', 'the password icon exists');
        test.assertExists('#password', 'the password box exists');
        test.assertExists('#login > button > i.fa.fa-user', 'the login box exists');
        this.fill('form#login',{
            'email': 'PulseHR@gmail.com',
            'password': '123456' 
        }, true);
    });

    casper.wait(5000, function(){
        casper.then(function(){
            casper.click('#login > button');
        });
    });   
    
    casper.wait(5000, function(){
        casper.then(function(){
            test.assertEvalEquals(function() {
                return __utils__.findOne('#login-errors').textContent;
                }, '');
            });
    });

    // To check there is some text in the #login-errors so that some error message pops up    
  
    casper.run(function(){
        test.done();
    });
});

