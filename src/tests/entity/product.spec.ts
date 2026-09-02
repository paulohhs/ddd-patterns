import Product from "../../entity/product";

describe("Product unit tests", () => {

    it("show throw error when id is empty", () => {
        expect(() => {
            const product = new Product("", "Produto 1", 100);
        }).toThrow("ID is required");
    });

    it("show throw error when name is empty", () => {
        expect(() => {
            const product = new Product("1", "", 100);
        }).toThrow("Name is required");
    });

    it("show throw error when price is less than zero", () => {
        expect(() => {
            const product = new Product("1", "Produto 1", -1);
        }).toThrow("Price must be greater than zero");
    });

    it("should change name", () => {
        const product = new Product("1", "Produto 1", 100);
        product.changeName("Produto 2");
        expect(product.name).toBe("Produto 2");
    });

    it("should change price", () => {
        const product = new Product("1", "Produto 1", 100);
        product.changePrice(200);
        expect(product.price).toBe(200);
    });

});
