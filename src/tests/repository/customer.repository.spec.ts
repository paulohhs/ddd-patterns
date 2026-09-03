import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../infrastructure/db/sequelize/model/customer.model";
import Customer from "../../domain/entity/customer";
import CustomerRepository from "../../infrastructure/repository/customer.repository";
import Address from "../../domain/entity/address";

describe("Customer repository tests", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([CustomerModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.address = address;
        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne({ where: { id: "123" } });

        if (!customerModel) {
            throw new Error("Customer was not created");
        }
        expect(customerModel.toJSON()).toStrictEqual({
            id: "1",
            name: customer.name,
            active: customer.active,
            rewardPoints: customer.rewardPoints,
            street: address.street,
            number: address.number,
            zip: address.zip,
            city: address.city
        });
    });

    it("should update a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.address = address;
        await customerRepository.create(customer);

        customer.changeName("Customer 1 Updated");
        await customerRepository.update(customer);
        const customerModel = await CustomerModel.findOne({ where: { id: "1" } });

        if (!customerModel) {
            throw new Error("Customer was not updated");
        }
        expect(customerModel.toJSON()).toStrictEqual({
            id: "1",
            name: customer.name,
            active: customer.active,
            rewardPoints: customer.rewardPoints,
            street: customer.address.street,
            number: customer.address.number,
            zip: customer.address.zip,
            city: customer.address.city,
        });
    });

    it("should delete a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.address = address;
        await customerRepository.create(customer);

        const createdCustomer = await CustomerModel.findOne({ where: { id: "1" } });
        expect(createdCustomer).not.toBeNull();

        await customerRepository.delete("1");
        const deletedCustomer = await CustomerModel.findOne({ where: { id: "1" } });
        expect(deletedCustomer).toBeNull();
    });

    it("should find a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.address = address;
        await customerRepository.create(customer);

        const foundCustomer = await customerRepository.find(customer.id);
        

        if (!foundCustomer) {
            throw new Error("Customer was not found");
        }
        expect(customer).toStrictEqual({foundCustomer});
    });

    it("should find all customers", async () => {
        const customerRepository = new CustomerRepository();

        const customer1 = new Customer("1", "Customer 1");
        const address1 = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer1.changeAddress(address1);
        customer1.addRewardPoints(10);
        await customerRepository.create(customer1);

        const customer2 = new Customer("2", "Customer 2");
        const address2 = new Address("Street 2", 2, "Zipcode 2", "City 2");
        customer2.changeAddress(address2);
        customer2.addRewardPoints(10);
        await customerRepository.create(customer2);

        const foundCustomers = await customerRepository.findAll();

        expect(foundCustomers).toHaveLength(2);
        expect(foundCustomers).toContainEqual(customer1);
        expect(foundCustomers).toContainEqual(customer2);
    });

    it("should throw an error when customer is not found", async () => {
        const customerRepository = new CustomerRepository();
        expect(async () => {
            await customerRepository.find("456ABC");
        }).rejects.toThrow("Customer not found");
    });
});
