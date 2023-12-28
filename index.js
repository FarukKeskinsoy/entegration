const express = require('express');
const axios = require('axios');
const jsdom = require("jsdom");
const app = express();
const port = 8080;
const http = require('http');

const hostname = '127.0.0.1';
const hostnamesql = '193.203.168.40';
const hostnameci = '213.14.168.240';
const hostnameweb = '45.13.252.197';
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Create an axios instance with a custom config
  const axiosInstance = {
    method:"get",
    url:"https://posmatik2.isbank.com.tr/LoginPanel.html",
    
  };
 

  try {
    // Step 1: Get the login page and extract form data
    const loginPageResponse = await axios(axiosInstance.url);
    const formData = {
      uid: username,
      pwd: password,
    };
    console.log(loginPageResponse)

    // Extract form data using DOMParser
    const dom = new jsdom.JSDOM(loginPageResponse.data)
    const inputElements = dom.window.document.querySelectorAll('form[name="input"] input');
    inputElements.forEach(input => {
      const fieldName = input.getAttribute('name');
      const fieldValue = input.value;
      formData[fieldName] = fieldValue;
    });

    console.log(inputElements)

    var data= new FormData()
    data.append('uid', username);
    data.append('pwd', password);
    const axiosInstance2 = {
      method:"post",
      url:"https://posmatik2.isbank.com.tr/Authenticate.aspx",
      // proxy: {
      //   host: '193.203.168.40',
      //   //port: 443,
      //   //protocol: 'http',
      // },
      host:"45.13.252.197",
     
      headers: {
        'Accept-Encoding': 'gzip, deflate',
        "x-forwarded-for":hostnamesql,
      },
      maxRedirects: 0, // Disable automatic redirects
      data:data
      
    };

    // Step 2: Post the login data to authenticate
    const authenticationResponse = await axios(axiosInstance2);

    // Step 3: Process the XML result
    const xmlResult = authenticationResponse.data;
    // Process the XML result as needed

    // Return the XML result or any other response to the client
    res.status(200).send(xmlResult);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port,"0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
//   });