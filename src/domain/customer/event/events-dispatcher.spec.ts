import EventDispatcher from "../../@shared/event/event-dispatcher"
import Customer from "../entity/customer";
import Address from "../value-object/address";
import CustomerChangedAddress from "./customer-changed-address";
import CustomerCreatedEvent from "./customer-created.event";
import SendLogWhenCustomerChangedAddres from "./handler/send-log-when-customer-changed-addres";
import SendLogWhenCustomerIsCreatedHandler from "./handler/send-log-when-customer-is-created.handler";
import SendLogWhenCustomerIsCreatedHandler2 from "./handler/send-log-when-customer-is-created.handler2";

describe('Customer domain eventsTests', () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendLogWhenCustomerIsCreatedHandler();
    const eventHandler2 = new SendLogWhenCustomerIsCreatedHandler2();
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2)
    eventDispatcher.register("CustomerCreatedEvent", eventHandler);

    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined()

    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);

    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler)
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2)
  })



  it ("should notify when Customer has been created", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendLogWhenCustomerIsCreatedHandler();
    const eventHandler2 = new SendLogWhenCustomerIsCreatedHandler2();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");
    const consoleLogTeste = jest.spyOn(console, "log");

    eventDispatcher.register("CustomerCreatedEvent", eventHandler);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2)

    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler)

    const customerCreatedEvent = new CustomerCreatedEvent({
      id: '1',
      name: 'shin',
      age: 25
    })

    eventDispatcher.notify(customerCreatedEvent)

    expect(spyEventHandler).toHaveBeenCalled();
    expect(consoleLogTeste).toHaveBeenCalledTimes(2);
    expect(consoleLogTeste.mock.calls[0][0]).toEqual("Esse é o primeiro console.log do evento: CustomerCreated");
    expect(consoleLogTeste.mock.calls[1][0]).toEqual("Esse é o segundo console.log do evento: CustomerCreated");

  })


  it ("should notify when Address customer has been changed ", () => {
    const eventHandler = new SendLogWhenCustomerChangedAddres();
    const newCustomer = new Customer('1', 'VS')

    const address = new Address("Street 1", 123, "13330-250", "São Paulo");
    
    newCustomer.changeAddress(address)

   

    const consoleLogTeste = jest.spyOn(console, "log");
    // const customerCreatedEvent = new CustomerChangedAddress(newCustomer)

    // eventDispatcher.notify(customerCreatedEvent)

    expect(consoleLogTeste.mock.calls[0][0]).toEqual(`Endereço do cliente: ${newCustomer.id}, ${newCustomer.name} alterado para ${address.toString()} `);

  })
})