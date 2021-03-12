// us = d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
//   if (error) throw error;
// }).then(function(result) {
//   console.log(us)
//
// });
async function getPromise() {
    let result = await d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
      if (error) throw error;
    });
    console.log(result.objects)
    return result.objects;
}
console.log(getPromise())
// console.log(us)
// console.log(us.PromiseResult)
