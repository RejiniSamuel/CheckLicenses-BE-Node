var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
var datefns = require('date-fns')
var getDateExp = "";
var geLicName = "";
var geLicNo = "";
app.get('/scrape', function (req, res) {

  //url = 'https://www.imdb.com/title/tt1229340/';
  url = 'http://www.nysed.gov/coms/op001/opsc2a?profcd=60&plicno=191208';
  //http://www.nysed.gov/coms/op001/opsc2a?profcd=27&plicno=
  request(url, function (error, response, html) {
    if (!error) {
      var $ = cheerio.load(html);


      let allText = [];
      var jsonfile = {
        name: "",
        licno: "",
        licdate: "",
        expdate: ""
      };
      $('#content_column').contents().each(function (i, e) {


        allText[i] = $(this).text().trim();
        //console.log('allText:' + i + ' ' + allText[i]);
        jsonfile.name = allText[19];
        geLicName = allText[19];
        jsonfile.licno = allText[31];
        geLicNo = allText[31];
        jsonfile.licdate = allText[35];
        jsonfile.expdate = allText[47];
        getDateExp = allText[47];
      });


    }

    // To write to the system we will use the built in 'fs' library.
    // In this example we will pass 3 parameters to the writeFile function
    // Parameter 1 :  output.json - this is what the created filename will be called
    // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
    // Parameter 3 :  callback function - a callback function to let us know the status of our function

    fs.writeFile('output.json', JSON.stringify(jsonfile, null, 4), function (err) {

      console.log('File successfully written! - Check your project directory for the output.json file');

    })


    /*const todaysDate = new Date();
    var month = todaysDate.getMonth();
    var yy = (new Date().getFullYear()+'').slice(-2);
    */
    //var test =yearStr.substring(0,2);
    var expMonth = getDateExp.substring(0, 2);
    var expYear = getDateExp.substring(3, 5);

    const format = require('date-fns/format');
    var expiryDate = format(new Date(expYear, expMonth - 1, 01), 'MM/DD/YY');
    var newToday = format(new Date(), 'MM/DD/YY');

    var compareAsc = require('date-fns/compare_asc');
    var result = compareAsc(
      expiryDate,
      newToday)
    console.log("result: " + result);
    // Compare the two dates and return 1 if the first date is after the second, -1 if the first date is before the second or 0 if dates are equal.

    var textAdd = "";
    var expired = false;
    //var getExpDateAsDate=new Date(getDateExpDate);
    //var getExpDateAsDate=Date(getExpDateAsDate.getFullYear(), getExpDateAsDate.getMonth(),1);
    //var expMonth = getDateExpDate.getMonth()
    //var expYear = getDateExpDate.getFullYear()

    /*if (expYear<year) {
      console.log("Expiry Year is earlier than today - Exp Year:" + expYear)
    }*/

    expiryDate = '07/21/19';
    var differenceInWeeks = require('date-fns/difference_in_weeks')
    var weeks = differenceInWeeks(
      expiryDate,
      newToday
    )

    console.log("Weeks: " + weeks);

    if (result == -1 || result == 0) {
      //expired
      textAdd = "has expired";
      expired = true;


    } else {
      //expiry date is coming up in future ie not expired
      //hpw many days away

      if (weeks >= 0 && weeks < 4) {
        textAdd = "expires within " + (weeks + 1) + " weeks"
        console.log(textAdd);
      } else if (weeks >= 4) {

        textAdd = "";
        console.log(textAdd);
      } else {

        textAdd = "";
        console.log("Longer");
      }
    }

    console.log("Today:" + newToday + " expiryDate:" + expiryDate);
    if (textAdd != "") {
      console.log(textAdd);
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey('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');
      const msg = {
        to: 'rejinisamuel@gmail.com',
        cc: 'rsamuel.authorservices@gmail.com',
        from: 'rejinisamuel@gmail.com',
        subject: 'Reminder Email for:' + geLicName,
        text: 'THIS IS JUST A TEST - The Licence: ' + geLicNo + ' for ' + geLicName + ' ' + textAdd,
        html: '<strong>THIS IS JUST A TEST - The Licence: ' + geLicNo + ' for ' + geLicName + ' ' + textAdd + '.</strong>',
      };
      console.log(msg);
      sgMail.send(msg);
    }
    // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
    res.send('Check your console!')

  });
})



//sgMail.send(msg);
app.listen('8081');
console.log('Magic happens on port 8081');


exports = module.exports = app;