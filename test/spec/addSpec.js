var addNumbers = require("./../../js/test.js");

describe("A suite", function () {
		it("contains spec with an expectation", function () {
				expect(true).toBe(true);
		});

		it("take in the add function", function () {
				expect(addNumbers.addTwoNumbers(7, 7)).toBe(14);
		});

}); 