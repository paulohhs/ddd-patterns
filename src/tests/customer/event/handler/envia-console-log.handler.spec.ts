import CustomerAddressChangedEvent from "../../../../domain/customer/event/customer-address-changed.event";
import CustomerCreatedEvent from "../../../../domain/customer/event/customer-created.event";
import EnviaConsoleLog1Handler from "../../../../domain/customer/event/handler/envia-console-log-1.handler";
import EnviaConsoleLog2Handler from "../../../../domain/customer/event/handler/envia-console-log-2.handler";
import EnviaConsoleLogHandler from "../../../../domain/customer/event/handler/envia-console-log.handler";
import Address from "../../../../domain/customer/value-object/address";

describe("Enviar console.log unit test", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should print the first CustomerCreated message", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const handler = new EnviaConsoleLog1Handler();
    const event = new CustomerCreatedEvent({ id: "123", name: "Customer 1" });

    handler.handle(event);

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Esse é o primeiro console.log do evento: CustomerCreated"
    );
  });

  it("should print the second CustomerCreated message", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const handler = new EnviaConsoleLog2Handler();
    const event = new CustomerCreatedEvent({ id: "123", name: "Customer 1" });

    handler.handle(event);

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Esse é o segundo console.log do evento: CustomerCreated"
    );
  });

  it("should print the CustomerChangeAddress message", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const handler = new EnviaConsoleLogHandler();
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    const event = new CustomerAddressChangedEvent({ 
      id: "123", 
      name: "Customer 1",
      address: address.toString(),
    });

    handler.handle(event);

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      `Endereço do cliente: ${event.eventData.id}, ${event.eventData.name} alterado para: ${event.eventData.address.toString()}`
    );
  });
});
