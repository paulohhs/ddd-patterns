import Customer from "../../entity/customer";
import Order from "../../entity/order";
import OrderItem from "../../entity/order_item";
import OrderService from "../../service/order.service";

describe("Order service unit tests", () => {
    it("should get total of all orders", () => {
        const item1 = new OrderItem("1", "Order Item 1", 100, "p1", 1);
        const item2 = new OrderItem("2", "Order Item 2", 200, "p2", 2);

        const order = new Order("1", "c1", [item1]);
        const order2 = new Order("2", "c1", [item2]);

        const total = OrderService.total([order, order2]);

        expect(total).toBe(500);
    });
});
