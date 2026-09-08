import EventInterface from "../@shared/event.interface";

export interface CustomerAddressChangedEventData {
  id: string;
  name: string;
  address: string;
}

export default class CustomerAddressChangedEvent implements EventInterface {
    dataTimeOccurred: Date;
    eventData: CustomerAddressChangedEventData;

    constructor(eventData: CustomerAddressChangedEventData) {
        this.dataTimeOccurred = new Date();
        this.eventData = eventData;
    }
}
