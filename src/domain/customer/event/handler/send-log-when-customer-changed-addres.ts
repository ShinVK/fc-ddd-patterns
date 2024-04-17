import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerChangedAddress from "../customer-changed-address";

export default class SendLogWhenCustomerChangedAddres implements EventHandlerInterface<CustomerChangedAddress> {
  handle(event: CustomerChangedAddress): void {
    const {eventData: {id, name, address }} = event;

    console.log(`Endereço do cliente: ${id}, ${name} alterado para ${address.toString()} `)
  }
}