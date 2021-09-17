
<h1> Getting Started with Customizing Sample Application - HERE Technologies </h1>

<h2> This is a Quick Guide to customizing the sample application to your needs. Let's start by adding a new API functionality into the sample app - Astronomy Forecast for a city.</h2> <br>
<br>

<h3> Append the following code in service.js [services -> service.js]</h3>

<h3> This step would let us call the API for getting the Astronomy forecast data</h3>

<br>

```
  exports.getastroforecast = function (city= "") {

    return new Promise((resolve, reject) => {

      generateToken().then((authtoken) => {

        let options = {
          method: 'GET',
          url: 'https://weather.cc.api.here.com/weather/1.0/report.json',
          qs: {
            product: 'forecast_astronomy',
            name: city
          },
          headers: {
            'Authorization': authtoken
          }
        };
        
        var astro_list = {};
        var astro_full = {};
        request(options, function (error, response) {
        if (error) reject(error);
        const jsonform2 = JSON.parse(response.body);

        for(var i = 0; i<jsonform2["astronomy"]["astronomy"].length;i++){

        astro_list["sunrise"] = jsonform2["astronomy"]["astronomy"][i]["sunrise"];
        astro_list["sunset"] = jsonform2["astronomy"]["astronomy"][i]["sunset"];
        astro_list["moonrise"] = jsonform2["astronomy"]["astronomy"][i]["moonrise"];
        astro_list["moonset"] = jsonform2["astronomy"]["astronomy"][i]["moonset"];
      
        astro_full[i] = astro_list
        astro_list = {}
      }

        resolve(astro_full);
      });

      })


    });
  }
```

<br>


<h3> Append this code to app.js at line 57. This is with regard to the function we exprted in the previous step. Make sure to 'require' it as well by adding 'getastroforecast' along with the rest of the functions (Refer Line 3 in app.js) </h3>
<br>

```
    this.app.get("/getastroforecast", function (request, response) {
      
      let city = request.query.city

      getastroforecast(city).then((res)=>{
        response.json(res);
      }).catch((e) => {
        response.end({result: "fail"})
        console.log("Error : ",e)
      })

    });
```

<br>


<h3> Now let's append this code in the line 255 of w-g-component.ejs [views -> components -> w-g-component.ejs]</h3>
<h3> This would let us interact with the API from the frontend elements. The async function would get the data from the frontend and pass it onto the API</h3>

<br>

```
async function getastroforecast() {

    let city = document.getElementById("city").value;

    if (city === "") {
      window.alert("Required data value is missing");
    }

    else {

    document.getElementById("overlay").style.display = "block";

    let response = await fetch('/getastroforecast?city='+ city);
    let result = await response.json();

    var table2 = document.getElementById("astro-table");
    table2.style.display = "";

    var tbody2 = document.getElementById('astro-table').getElementsByClassName('wtbody2')[0];
    tbody2.innerHTML = '';
    tbody2 = document.getElementById('astro-table').getElementsByClassName('wtbody2')[0];

    document.getElementById("alerts-table").style.display = 'none';
    document.getElementById('week-forecast-table').style.display = 'none'
    document.getElementById("categorycha").style.display = 'none';
    document.getElementById("address-geocode").style.display = 'none';
    document.getElementById("stores").style.display = 'none';
    document.getElementById('closest-addr').style.display = 'none';

    document.getElementById("overlay").style.display = "none";

    if(JSON.stringify(result) === JSON.stringify({})){
        window.alert("Results not found");
        document.getElementById("astro-table").style.display = 'none';
    }


    for (var key in result) {
        if (result.hasOwnProperty(key)){
          var val = result[key];

          var row = tbody2.insertRow();
          var cell1 = row.insertCell(0);
          var cell2 = row.insertCell(1);
          var cell3 = row.insertCell(2);
          var cell4 = row.insertCell(3);

          cell1.innerHTML = val["sunrise"];
          cell2.innerHTML = val["sunset"];
          cell3.innerHTML = val["moonrise"];
          cell4.innerHTML = val["moonset"];
        } 
    } 
  }
}

```
<br>

<h3> Let's create a button that would call the above function. Append this code into the line 706 of w-g-component.ejs [views -> components -> w-g-component.ejs] </h3>
<br>

```
<button type = "submit" onclick="getastroforecast()">Get Astronomy Forecast </button> 
```
<br>

<h3> ..And a table that would display the results. Append this code into the line 741 of w-g-component.ejs [views -> components -> w-g-component.ejs] </h3>
<br>

```
 <table class = "table table-striped" id = "astro-table" style="width:50%;display:none;">
      <thead>
                <th>Sun Rise</th>
                <th>Sun Set</th>
                <th>Moon Rise</th>
                <th>Moon Set</th>
      </thead>
  
      <tbody class= "wtbody2">
  
      </tbody>
                        
</table>
```
<br>

<h3> We've successfully added a new API function to our sample application! Go ahead and re-launch the application. </h3>
