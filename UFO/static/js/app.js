// from data.js
var tableData = data;

// Variables
var button = d3.select("#filter-btn");
var inputField1 = d3.select("#datetime");
var inputField2 = d3.select("#city");
var inputField3 = d3.select("#state");
var inputField4 = d3.select("#country");
var inputField5 = d3.select("#shape");
var tbody = d3.select("tbody");
var resetbtn = d3.select("#reset-btn");
var columns = ["datetime", "city", "state", "country", "shape", "durationMinutes", "comments"]

var populateUFOData = (dataInput) => {
  dataInput.forEach(ufo => {
    var row = tbody.append("tr");
    columns.forEach(column => row.append("td").text(ufo[column])
    )
  });
}

// Populate UFO Data table
populateUFOData(tableData);

// Filter by attribute
button.on("click", () => {
  d3.event.preventDefault();
  var inputDate = inputField1.property("value").trim();
  var inputCity = inputField2.property("value").toLowerCase().trim();
  var inputState = inputField3.property("value").toLowerCase().trim();
  var inputCountry = inputField4.property("value").toLowerCase().trim();
  var inputShape = inputField5.property("value").toLowerCase().trim();
  // Filter by field matching input value
  var filterDate = tableData.filter(tableData => tableData.datetime === inputDate);
  console.log(filterDate)
  var filterCity = tableData.filter(tableData => tableData.city === inputCity);
  console.log(filterCity)
  var filterState = tableData.filter(tableData => tableData.state === inputState);
  console.log(filterState)
  var filterCountry = tableData.filter(tableData => tableData.country === inputCountry);
  console.log(filterCountry)
  var filterShape = tableData.filter(tableData => tableData.shape === inputShape);
  console.log(filterShape)
  var filterAllData = tableData.filter(tableData =>
      tableData.datetime === inputDate &&
      tableData.city === inputCity &&
      tableData.state === inputState &&
      tableData.country === inputCountry &&
      tableData.shape === inputShape
  );
  console.log(filterAllData)

  // Add filtered sighting to table
  tbody.html("");

  let response = {
    filterAllData,
    filterCity,
    filterDate,
    filterState,
    filterCountry,
    filterShape
  }

  if (response.filterAllData.length !== 0) {
    populateUFOData(filterAllData);
  }
    else if (
        response.filterAllData.length === 0 && ((
        response.filterCity.length !== 0 ||
        response.filterDate.length !== 0 ||
        response.filterState.length !== 0 ||
        response.filterCountry.length !== 0 ||
        response.filterShape.length !== 0))
  ) {
      populateUFOData(filterCity) ||
      populateUFOData(filterDate) ||
      populateUFOData(filterState) ||
      populateUFOData(filterCountry) ||
      populateUFOData(filterShape);
    }
    else {
      tbody.append("tr").append("td").text("No UFOs found!");
    }
})

resetbtn.on("click", () => {
  tbody.html("");
  populateUFOData(tableData)
  console.log("Table reset")
})