import EventDispatcher from "../../@shared/event/event-dispatcher"

describe('Customer domain eventsTests', () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendLogWhenCustomerIsCreatedHandler();

    eventDispatcher.register("CustomerCreatedEvent", eventHandler);

    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined()

    expect(eventDispatcher.getEventHandlers["CusomerCreatedEvent"].length).toBe(1);

    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler)
  })


})