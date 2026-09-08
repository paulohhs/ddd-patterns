import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import EventDispatcher from "../../domain/event/@shared/event-dispatcher";
import CustomerAddressChangedEvent from "../../domain/event/customer/customer-address-changed.event";
import CustomerCreatedEvent from "../../domain/event/customer/customer-created.event";
import EnviaConsoleLog1Handler from "../../domain/event/customer/handler/envia-console-log-1.handler";
import EnviaConsoleLog2Handler from "../../domain/event/customer/handler/envia-console-log-2.handler";
import EnviaConsoleLogHandler from "../../domain/event/customer/handler/envia-console-log.handler";

describe("CustomerCreated domain event unit test", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should record a CustomerCreatedEvent when a customer is created", () => {
    const customer = new Customer("123", "Customer 1");

    expect(customer.events).toHaveLength(1);

    const recordedEvent = customer.events[0] as CustomerCreatedEvent;
    expect(recordedEvent).toBeInstanceOf(CustomerCreatedEvent);
    expect(recordedEvent.eventData).toEqual({ id: "123", name: "Customer 1" });
    expect(recordedEvent.dataTimeOccurred).toBeInstanceOf(Date);
  });

  it("should not notify handlers until the recorded events are dispatched", () => {
    const eventDispatcher = new EventDispatcher();
    const handler1 = new EnviaConsoleLog1Handler();
    const handler2 = new EnviaConsoleLogHandler();
    const spyHandler1 = jest.spyOn(handler1, "handle");
    const spyHandler2 = jest.spyOn(handler2, "handle");

    eventDispatcher.register("CustomerCreatedEvent", handler1);
    const customer = new Customer("123", "Customer 1");
    expect(spyHandler1).not.toHaveBeenCalled();

    eventDispatcher.register("CustomerChangeAddressEvent", handler2);
    const address = new Address("Street 1", 1, "Zip 1", "City 1");
    customer.changeAddress(address);
    expect(spyHandler2).not.toHaveBeenCalled();
  });

  it("should notify both handlers exactly once when the recorded events are dispatched", () => {
    const eventDispatcher = new EventDispatcher();
    const handler1 = new EnviaConsoleLog1Handler();
    const handler2 = new EnviaConsoleLog2Handler();
    const spyHandler1 = jest.spyOn(handler1, "handle");
    const spyHandler2 = jest.spyOn(handler2, "handle");

    eventDispatcher.register("CustomerCreatedEvent", handler1);
    eventDispatcher.register("CustomerCreatedEvent", handler2);

    const customer = new Customer("123", "Customer 1");
    customer.events.forEach((event) => eventDispatcher.notify(event));

    expect(spyHandler1).toHaveBeenCalledTimes(1);
    expect(spyHandler2).toHaveBeenCalledTimes(1);
  });

  it("should record a CustomerAddressChangedEvent when customer address changed", () => {
    const customer = new Customer("123", "Customer 1");
    customer.clearEvents();
    expect(customer.events).toHaveLength(0);

    const address = new Address("Street 1", 1, "Zip 1", "City 1");
    customer.changeAddress(address);
    expect(customer.events).toHaveLength(1);

    const recordedEvent = customer.events[0] as CustomerAddressChangedEvent;
    expect(recordedEvent).toBeInstanceOf(CustomerAddressChangedEvent);
    expect(recordedEvent.eventData).toEqual({ id: "123", name: "Customer 1", address: address.toString() });
    expect(recordedEvent.dataTimeOccurred).toBeInstanceOf(Date);
  });

  it("should notify CustomerAddressChangedEvent exactly once when the recorded events are dispatched", () => {
    const eventDispatcher = new EventDispatcher();
    const handler = new EnviaConsoleLogHandler();
    const spyHandler = jest.spyOn(handler, "handle");

    eventDispatcher.register("CustomerAddressChangedEvent", handler);

    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zip 1", "City 1");
    customer.changeAddress(address);
    customer.events.forEach((event) => eventDispatcher.notify(event));

    expect(spyHandler).toHaveBeenCalledTimes(1);
  });

  it("should clear the recorded events once they are drained", () => {
    const customer = new Customer("123", "Customer 1");
    expect(customer.events).toHaveLength(1);

    customer.clearEvents();

    expect(customer.events).toHaveLength(0);
  });
});
