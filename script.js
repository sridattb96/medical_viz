
console.log("test")

d3.csv("data/antimicrobial.csv", function(data) {
  console.log(data[0]["Dose"]);
});

d3.csv("data/sample.csv", function(data) {
  console.log(data[1]);
});

d3.csv("data/enrollment.csv", function(data) {
  console.log(data[3]);
});