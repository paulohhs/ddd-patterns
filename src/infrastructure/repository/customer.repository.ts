import Customer from "../../domain/entity/customer";
import CustomerModel from "../db/sequelize/model/customer.model";
import CustomerRepositoryInterface from "../../domain/repository/customer-repository.interface";
import Address from "../../domain/entity/address";

export default class CustomerRepository implements CustomerRepositoryInterface {
    async create(entity: Customer): Promise<void> {
        await CustomerModel.create({
            id: entity.id,
            name: entity.name,
            active: entity.active,
            rewardPoints: entity.rewardPoints,
            street: entity.address.street,
            number: entity.address.number,
            zip: entity.address.zip,
            city: entity.address.city
        });
    }

    async update(entity: Customer): Promise<void> {
        await CustomerModel.update(
            {
                name: entity.name,
                active: entity.active,
                rewardPoints: entity.rewardPoints,
                street: entity.address.street,
                number: entity.address.number,
                zip: entity.address.zip,
                city: entity.address.city
            }, 
            { 
                where: { 
                    id: entity.id 
                } 
            }
        );
    }

    async delete(id: string): Promise<void> {
        await CustomerModel.destroy({ where: { id } });
    }

    async find(id: string): Promise<Customer> {
        let customerModel;
        try {
            customerModel = await CustomerModel.findOne({
                where: { id },
                rejectOnEmpty: true
            });
        } catch (error) {
            throw new Error("Customer not found");
        }

        if (!customerModel) {
            throw new Error("Customer not found");
        }

        const customer = new Customer(customerModel.id, customerModel.name);
        const address = new Address(
            customerModel.street,
            customerModel.number,
            customerModel.zip,
            customerModel.city
        );
        customer.changeAddress(address);

        return customer;
    }
    
    async findAll(): Promise<Customer[]> {
        const customerModels = await CustomerModel.findAll();
        const customers = customerModels.map((cm) => {
            let customer = new Customer(cm.id, cm.name)
            customer.addRewardPoints(cm.rewardPoints);
            const address = new Address(
                cm.street,
                cm.number,
                cm.zip,
                cm.city
            );
            customer.changeAddress(address);

            if (cm.active) {
                customer.activate();
            }

            return customer;
        });
        return customers;
    }
}