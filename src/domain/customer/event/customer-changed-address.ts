import EventInterface from "../../@shared/event/event.interface";
import Customer from "../entity/customer";
import Address from "../value-object/address";

export default class CustomerChangedAddress implements EventInterface {
  dataTimeOccurred: Date;
  eventData: { id: string, name: string, address: Address};

  constructor(eventData: { id: string, name: string, address: Address}) {
    this.dataTimeOccurred = new Date();
    this.eventData = eventData;
  }
}