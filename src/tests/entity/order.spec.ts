import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";

describe("Order unit tests", () => {

    it("show throw error when id is empty", () => {
        expect(() => {
            let order = new Order("", "1", []);
        }).toThrow("ID is required");
    });

    it("show throw error when customerId is empty", () => {
        expect(() => {
            let order = new Order("1", "", []);
        }).toThrow("CustomerId is required");
    });

    it("show throw error when items is empty", () => {
        expect(() => {
            let order = new Order("1", "1", []);
        }).toThrow("Item quantity must be greater than 0");
    });

    it("show calculate total", () => {
        const item = new OrderItem("1", "Item 1", 100, "1", 2);
        const item2 = new OrderItem("2", "Item 2", 200, "2", 2);
        const order = new Order("1", "1", [item]);
        const order2 = new Order("2", "2", [item, item2]);

        let total = order.total();
        expect(total).toBe(200);

        total = order2.total();
        expect(total).toBe(600);
    });

    it("should throw error if the item qte is less or equal zero", () => {
        expect(() => {
            const item = new OrderItem("1", "Item 1", 100, "1", 0);
            const order = new Order("1", "1", [item]);
        }).toThrow("Quantity must be greater than 0");
    });
});
