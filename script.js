console.log("test")

d3.csv("data/antimicrobial.csv", function(data) {
  console.log(data[0]);
});