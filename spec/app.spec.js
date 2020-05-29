var Request = require("request");
var swiggy = require("../swiggy");
var zomato = require("../zomato");

describe("Server", () => {
    var server;
    beforeAll(() => {
        server = require("../app");
    });
    afterAll(() => {
        server.close();
    });
    describe("GET /", () => {
        var data;
        beforeAll( (done) => {
            Request.get("http://localhost:3000/", (error, response, body) => {
                data = response.statusCode;
                done();
            });
        });
        it("Status 200", () => {
            expect(data).toBe(200);
        });
    });

    // describe("GET /toppick", () => {
    //     var data;
    //     beforeAll( (done) => {
    //         Request.get("http://localhost:3000/toppick?location=banglore", (error, response, body) => {
    //             data = response.statusCode;
    //             done();
    //         });
    //     });
    //     it("Status 200", () => {
    //         expect(data).toBe(200);
    //     });
    // });


    // // describe("SWIGGY", () => {
    // //    var data, data1;
    // //    var keys, keys1;
    // //    var urls;
    // //     beforeAll(async (done) => {
    // //            await swiggy.initialize("banglore");
    // //            urls = await swiggy.getUrls();
    // //            data = await swiggy.retrieve("https://www.swiggy.com/restaurants/rolls-on-wheels-woods-street-central-bangalore-bangalore-9103");
    // //             keys = Object.keys(data);
    // //             data1 = await swiggy.bestseller();
    // //             keys1 = Object.keys(data1[0]);
                
    // //             done();
                
    // //     }, 500000);
    // //     it("description of single item of a restaurant", () => {
    // //         expect(keys).toEqual(["restaurantName","tag", "address", "rating", "peopleRated", "weblink", "items"]);
    // //     });
    // //     it("best seller restaurants in the town", () => {
    // //         expect(keys1).toEqual(["restaurantName","tag", "rating", "sgylink"]);
    // //     });
    // //     it("restaurant urls", () => {
    // //         expect(typeof(urls)).toBe("object");
    // //     });
    // // });
   
    // // // describe("GET /test", () => {
    //     var data = {};
    //     beforeAll((done) => {
    //         Request.get("http://localhost:3000/test", (error, response, body) => {
    //             data.status = response.statusCode;
    //             data.body = JSON.parse(body);
    //             done();
    //         });
    //     });
    //     it("Status 200", () => {
    //         expect(data.status).toBe(500);
    //     });
    //     it("Body", () => {
    //         expect(data.body.message).toBe("This is an error response");
    //     });
    // });
});