// Require modules needed for tests.
_ = require('lodash');

// All test suites will have a name and a list 
exports = module.exports = {
  name: "dataproofer-core-suite",
  tests: [],      // the list of main tests to be run in the suite
  subtests: [],   // a list of tests that can be triggered by the main tests but wont be run automatically
}

function percent(fraction) {
  var formatPercent = d3.format('.2f')
  return formatPercent(100*fraction) + "%";
}


/** 
 * This fooBar function is a placeholder to demonstrate what a test can expect
 * @param  {Array} The rows of the spreadsheet parsed out
 * @param  {String} The raw string of the file
 * @param  {Object} User defined input
 * @return {Object} The result of the test
 */
function fooBar(rows, str, input) {
  console.log("fooing some bars", rows.length)
  var result = {
    // whether or not the 
    passed: false,
    // potential ways of reporting problems
    // we probably just want to use indexes into the dataset
    invalidRows: [1, 55, 200],
    invalidColumns: ['State', 'zipcode'],
    invalidCells: [ [0, 0], [100, 234], [ 55, 60 ]],
    message: "You foo'd up",
    template: _.template(`<span class="test-header">foooooo: <%= foo %></span>`)({ foo: 100}) //define template and compile it to html
  };
  return result;
}
// We don't actually want to run this test, but if we did we would push it to the tests
//exports.tests.push(fooBar)

/**
 * Simple test to count and display the number of rows
 * @param  {Array}
 * @return {Object}
 */
function numberOfRows(rows) {
  var message = "This spreadsheet has " + rows.length + " rows"
  var template = _.template(`
    <span class="test-header">This spreadsheet has <%= rows %> rows</span>
  `)({ rows: rows.length })
  var result = {
    passed: true, // this doesn't really fail, as it is mostly an insight
    message: message,
    template: template
  }
  return result;
}
exports.tests.push(numberOfRows)

/**
 * Determine the percentage of rows that are empty for each column
 * @param  {Array} the rows of the spreadsheet
 * @return {Object} the result
 */
function columnsContainNothing(rows) {
  // TODO: should we pass in the columns?
  // when using d3 it will include one of each detected column for all rows
  // so we have it implicitly. we may want to be more explicit
  var cols = Object.keys(rows[0]);
  var nothing = {};
  cols.forEach(function(col) {
    nothing[col] = 0;
  })

  var cells = [] // we will want to mark cells to be highlighted here
  // look through the rows
  rows.forEach(function(row) {
    var crow = {} // we make a row to keep track of cells we want to highlight
    cols.forEach(function(col) {
      var cell = row[col];
      if(cell === "") { 
        nothing[col] += 1;
        crow[col] = 1;
      } else {
        crow[col] = 0;
      }
    })
    cells.push(crow) // push our marking row onto our cells array
  })

  var message = ", ";
  cols.forEach(function(col, i) {
    message += col + ": " + nothing[col]
    if(i < cols.length-1) message += ", "
  })

  var template = _.template(`
  <span class="test-header">Empty Cells</span><br/>
  <% _.forEach(cols, function(col) { %>
    <% if(nothing[col]) { %>
    We found <span class="test-value"><%= nothing[col] %></span> empty cells (<%= percent(nothing[col]/rows.length) %>) for column <span class="test-column"><%= col %></span><br/>
    <% } %>
  <% }) %>
  `)({ cols: cols, nothing: nothing, rows: rows, percent: percent })

  var result = {
    passed: true, // this doesn't really fail, as it is mostly an insight
    numbers: nothing,
    highlightCells: cells,
    message: message, // for console rendering
    template: template,
  }
  return result;
}
exports.tests.push(columnsContainNothing)


/**
 * Determine the percentage of rows that are numbers for each column
 * @param  {Array} the rows of the spreadsheet
 * @return {Object} the result
 */
function columnsContainNumbers(rows) {
  var cols = Object.keys(rows[0]);
  var numbers = {};
  cols.forEach(function(col) {
    numbers[col] = 0;
  })
  var cells = [] // we will want to mark cells to be highlighted here
  // look through the rows
  rows.forEach(function(row) {
    var crow = {} // we make a row to keep track of cells we want to highlight
    cols.forEach(function(col) {
      var cell = row[col];
      var f = parseFloat(cell);
      if(f.toString() === cell) { // this will only be true if the cell is a number
        numbers[col] += 1;
        crow[col] = 1
      } else {
        crow[col] = 0
      }
    })
    cells.push(crow) // push our marking row onto our cells array
  })

  var message = "# of rows for each column with number values:<br/> ";
  cols.forEach(function(col, i) {
    message += col + ": " + numbers[col]
    if(i < cols.length-1) message += "<br/> "
  })

  var template = _.template(`
  <span class="test-header">Numeric Cells</span><br/>
  <% _.forEach(cols, function(col) { %>
    <% if(numbers[col]) { %>
    We found <span class="test-value"><%= numbers[col] %></span> cells (<%= percent(numbers[col]/rows.length) %>) with a numeric value for column <span class="test-column"><%= col %></span><br/>
    <% } %>
  <% }) %>

  `)({ cols: cols, numbers: numbers, rows: rows, percent: percent })

  var result = {
    passed: true, // this doesn't really fail, as it is mostly an insight
    numbers: numbers,
    highlightCells: cells, // a mirror of the dataset, but with a 1 or 0 for each cell if it should be highlighted or not
    message: message,
    template: template
  }
  return result;
}
exports.tests.push(columnsContainNumbers)


/** 
 * @param  {Array} The rows of the spreadsheet parsed out
 * @param  {String} The raw string of the file
 * @return {Object} The result of the test
 */
function checkColumnHeaders(rows, str) {
  console.log("checking column headers", rows.length)
  var result = {};
  return result;
}
exports.tests.push(checkColumnHeaders)

