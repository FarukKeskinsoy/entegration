const express = require('express');
const axios = require('axios');
var nodeBase64 = require('nodejs-base64-converter');
var crypto = require('crypto');
var request = require('request');
const app = express();
const port = 8080;
const xml2js = require('xml2js');
const cors =require("cors")

const hostname = '127.0.0.1';
const hostnamesql = '193.203.168.40';
const hostnameci = '213.14.168.240';
const hostnameweb = '45.13.252.197';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('entegrator is running..');
});

//ödeme için

var merchant_id = '421245';
var merchant_key = 'QQadTeRT8zrtFb4y';
var merchant_salt = 'ETjefTsruqc534ph';

var max_installment = '0';
var no_installment = '0'  // Taksit yapılmasını istemiyorsanız, sadece tek çekim sunacaksanız 1 yapın.
var user_ip = 'localhost';
var currency = 'TL';
var test_mode = '0'; // Mağaza canlı modda iken test işlem yapmak için 1 olarak gönderilebilir.

var timeout_limit = 30; // İşlem zaman aşımı süresi - dakika cinsinden
var debug_on = 1; // Hata mesajlarının ekrana basılması için entegrasyon ve test sürecinde 1 olarak bırakın. Daha sonra 0 yapabilirsiniz.
var lang = 'tr'; // Türkçe için tr veya İngilizce için en gönderilebilir. Boş gönderilirse tr geçerli olur.

app.get("/test3DPay", function (req, res) {

  const {
      email,
      payment_amount,
      merchant_oid,
      user_name,
      user_address,
      user_phone,
      user_basket,
      p,
      pt
      // Add other parameters here
  } = req.query;
  var basket = JSON.stringify([
      [user_basket, payment_amount, 1],
  ]);
  var user_basketed = nodeBase64.encode(basket);
  var integeredpayment=parseInt(String(payment_amount), 10)
  var hashSTR = `${merchant_id}${user_ip}${merchant_oid}${email}${integeredpayment}${user_basketed}${no_installment}${max_installment}${currency}`;

  var paytr_token = hashSTR + merchant_salt;

  var token = crypto.createHmac('sha256', merchant_key).update(paytr_token).digest('base64');
  var formData = new FormData();
  formData.append(merchant_id, merchant_id);
  formData.append(merchant_id, merchant_id);


  var options = {
      method: 'POST',
      url: 'https://www.paytr.com/odeme/api/get-token',
      headers:
          { 'content-type': 'application/x-www-form-urlencoded' },
      formData: {
          merchant_id: merchant_id,
          merchant_key: merchant_key,
          merchant_salt: merchant_salt,
          email: email,
          payment_amount: integeredpayment,
          merchant_oid: merchant_oid,
          user_name: user_name,
          user_address: user_address,
          user_phone: user_phone,
          //merchant_ok_url: `https://recdoai.com/profil/satin-al/${p}/${pt}/basarili`,
          merchant_ok_url: `http://localhost:5173/profil/satin-al/${p}/${pt}/basarili`,
          //merchant_ok_url: merchant_ok_url,
          //merchant_fail_url: `https://recdoai.com/profil/satin-al/${p}/${pt}/basarisiz`,
          merchant_fail_url: `http://localhost:5173/profil/satin-al/${p}/${pt}/basarisiz`,
          user_basket: user_basketed,
          user_ip: user_ip,
          timeout_limit: timeout_limit,
          debug_on: debug_on,
          lang: lang,
          no_installment: no_installment,
          max_installment: max_installment,
          currency: currency,
          paytr_token: token,


      }
  };

  request(options, function (error, response, body) {
      if (error) throw new Error(error);
      var res_data = JSON.parse(body);

      if (res_data.status == 'success') {
          //res.render('layout', { iframetoken: res_data.token });
          res.json({iframetoken: res_data.token})
      } else {

          res.end(body);
      }


  });


});


app.post('/blogin', async (req, res) => {
  const { uid, pwd } = req.body;
  try {
    var fdata= new FormData()
    fdata.append('uid', uid);
    fdata.append('pwd', pwd);
    const axiosInstance2 = {
      method:"post",
      url:"https://posmatik2.isbank.com.tr/Authenticate.aspx",
      headers: {
        'Accept-Encoding': 'gzip, deflate',
        "x-forwarded-for":hostnamesql,
      },
      maxRedirects: 0, // Disable automatic redirects
      data:fdata
      
    };
    const authenticationResponse = await axios(axiosInstance2);
    const xmlResult = authenticationResponse.data;
    xml2js.parseString(xmlResult, (err, result) => {
      if (err) {
        console.error('Error parsing XML:', err);
        res.status(500).send('Internal Server Error');
      } else {
        // Now `result` is a JavaScript object representing the parsed XML structure
        // Send it as JSON in the response
        res.status(200).json(result);
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(process.env.PORT || port,() => {
  console.log(`Server is running on port ${port}`);
});