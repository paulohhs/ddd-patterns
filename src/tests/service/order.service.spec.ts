import Customer from "../../entity/customer";
import Order from "../../entity/order";
import OrderItem from "../../entity/order_item";
import OrderService from "../../service/order.service";

describe("Order service unit tests", () => {
    it("should place an order", () => {
        const customer = new Customer("1", "Customer 1");
        const item1 = new OrderItem("1", "Order Item 1", 10, "p1", 1);

        const order = OrderService.placeOrder(customer, [item1]);

        expect(customer.rewardPoints).toBe(5);
        expect(order.total()).toBe(10);
    });
    
    it("should get total of all orders", () => {
        const item1 = new OrderItem("1", "Order Item 1", 100, "p1", 1);
        const item2 = new OrderItem("2", "Order Item 2", 200, "p2", 2);

        const order = new Order("1", "c1", [item1]);
        const order2 = new Order("2", "c1", [item2]);

        const total = OrderService.total([order, order2]);

        expect(total).toBe(500);
    });
});
