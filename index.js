const express = require("express");
const cors = require('cors');
const axios = require('axios');


const app = express();
app.use(cors());
app.use(express.json())


app.get('/', (req, res) => {
    res.send('bank entegration is running..');
});
var uid= 'U171091266'
var pwd= 'HIF60X06V8'
var localAddress= '213.14.168.240' // Set the IP address you want to use

// async function fetchBankData() {
//     try {
//       // 1. Fetch the latest BankInfo
//     //   const bankInfoResponse = await axios.get('http://your-api-url/get-latest-bank-info');
//     //   const bankInfo = bankInfoResponse.data;
  
//     //   if (!bankInfo) {
//     //     throw new Error("Banka bilgileri bulunamadı.");
//     //   }
  
//       // 2. Initialize HTTP client
  
//       // 3. Make the initial HTTP request to the login page
//       const initialResponse = await axios("https://posmatik2.isbank.com.tr/LoginPanel.html");
  
//       if (!initialResponse.status === 200) {
//         throw new Error("Login sayfası yüklenirken hata oluştu.");
//       }
  
//       // 4. Create form data for login
//       const loginData = new FormData();
//       loginData.append('uid', bankInfo.UserName);
//       loginData.append('pwd', bankInfo.Sifre);
  
//       // 5. Perform the login POST request
//       const loginResponse = await axios.post("https://posmatik2.isbank.com.tr/Authenticate.aspx", loginData);
  
//       // 6. Process the response after login
//       if (loginResponse.status === 200) {
//         const responseContent = loginResponse.data;
  
//         // Process XML content
//         parseString(responseContent, async (err, result) => {
//           if (err) throw err;
  
//           const xmlDocument = result;
  
//           // Process general bank info
//           const generalBankInfo = {
//             Tarih: new Date(xmlDocument.Tarih),
//             Saat: xmlDocument.Saat,
//             BankaKodu: xmlDocument.bankaKodu,
//             BankaAdi: xmlDocument.bankaAdi,
//             BankaVergiDairesi: xmlDocument.bankaVergiDairesi,
//             BankaVergiNumarasi: xmlDocument.bankaVergiNumarasi
//           };
  
//           // Save general bank info to the database
  
//           // Process accounts
//           const accounts = xmlDocument.Hesaplar.Hesap;
//           for (const accountNode of accounts) {
//             const account = {
//               // Process account details
//             };
  
//             // Save account to the database
  
//             // Process movements
//             const movements = accountNode.Hareketler.Hareket;
//             for (const movementNode of movements) {
//               const movement = {
//                 // Process movement details
//               };
  
//               // Save movement to the database
//             }
//           }
  
//           console.log("Banka bilgileri başarıyla alındı ve veritabanına kaydedildi!");
//         });
//       } else {
//         throw new Error("Oturum açma işlemi başarısız.");
//       }
//     } catch (error) {
//       console.error("Error:", error.message);
//     }
//   }
  
//   // Call the function
//   fetchBankData();

const login =async()=>{
    return "hi"
}
app.post('/is', async (req, res) => {
  const {user,pass}=req.body
    try {
      const result = await login(user,pass);
  
      res.status(200).json({ result });
      console.log({ result });
    } catch (error) {
      console.error('Error in /money endpoint:', error);
      } 
    
  });

app.get('/is', async (req, res) => {
    
    try {
      const result = await login();
  
      res.status(200).json({ result:"başarılı" });
      console.log({ result });
    } catch (error) {
      console.error('Error in /money endpoint:', error);
      } 
    
  });


  app.listen(process.env.PORT || 8805 ,()=>{
    console.log("bank entegration is running..!")
});
