import Customer from "../../domain/entity/customer";
import CustomerModel from "../db/sequelize/model/customer.model";
import CustomerRepositoryInterface from "../../domain/repository/customer-repository.interface";
import Address from "../../domain/entity/address";
import EventDispatcherInterface from "../../domain/event/@shared/event-dispatcher.interface";

export default class CustomerRepository implements CustomerRepositoryInterface {
    constructor(private eventDispatcher?: EventDispatcherInterface) {}

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

        this.publishEvents(entity);
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

        this.publishEvents(entity);
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

        const customer = new Customer(id, customerModel.name);
        const address = new Address(
            customerModel.street,
            customerModel.number,
            customerModel.zip,
            customerModel.city
        );
        customer.changeAddress(address);
        customer.clearEvents()

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

            customer.clearEvents()

            return customer;
        });
        return customers;
    }

    private publishEvents(entity: Customer): void {
        entity.events.forEach((event) => this.eventDispatcher?.notify(event));
        entity.clearEvents();
    }
}