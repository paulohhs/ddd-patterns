import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";

describe("Customer unit tests", () => {

    it("show throw error when id is empty", () => {
        expect(() => {
            let customer = new Customer("", "John");
        }).toThrow("ID is required");
    });

    it("show throw error when name is empty", () => {
        expect(() => {
            let customer = new Customer("123", "");
        }).toThrow("Name is required");
    });

    it("show change name", () => {
        let customer = new Customer("123", "John");
        customer.changeName("Jane");

        expect(customer.name).toBe("Jane");
    });

    it("show activate customer", () => {
        const customer = new Customer("1", "Customer 1");
        const address = new Address("Street 1", 123, "Zipcode 1", "City 1");
        customer.address = address;

        customer.activate();
        expect(customer.isActive()).toBe(true);
    });

    it("show deactivate customer", () => {
        const customer = new Customer("1", "Customer 1");
        
        customer.deactivate();
        expect(customer.isActive()).toBe(false);
    });

    it("show throw error when addess is undefined when you activate a customer", () => {
        expect(() => {
            const customer = new Customer("1", "Customer 1");
            customer.activate();
        }).toThrow("Address is mandatory to activate a customer.");
    });

    it("should add reward points", () => {
        const customer = new Customer("1", "Customer 1");
        expect(customer.rewardPoints).toBe(0);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(20);
    });

});
