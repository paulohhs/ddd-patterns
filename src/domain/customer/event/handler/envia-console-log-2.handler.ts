import EventHandlerInterface from "../../../@shared/event-handler.interface";
import CustomerCreatedEvent from "../../../event/customer/customer-created.event";

export default class EnviaConsoleLog2Handler implements EventHandlerInterface<CustomerCreatedEvent> {
    handle(event: CustomerCreatedEvent): void {
        console.log(`Esse é o segundo console.log do evento: CustomerCreated`);
    }
}
