import EventInterface from "../../@shared/event/event.interface";
import CustomerAddressChangedEvent from "../event/customer-address-changed.event";
import CustomerCreatedEvent from "../event/customer-created.event";
import Address from "../value-object/address";

export default class Customer {
    private _id: string;
    private _name: string = "";
    private _address!: Address;
    private _active: boolean = false;
    private _rewardPoints: number = 0;
    private _events: EventInterface[] = [];

    constructor(id: string, name: string) {
        this._id = id;
        this._name = name;
        this.validate();

        this._events.push(
            new CustomerCreatedEvent({ id: this._id, name: this._name })
        );
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get rewardPoints(): number {
        return this._rewardPoints;
    }

    get active(): boolean {
        return this._active;
    }

    get address(): Address {
        return this._address;
    }

    get events(): EventInterface[] {
        return [...this._events];
    }

    set address(address: Address) {
        this._address = address;
    }

    validate() {
        if (this._id.length === 0) {
            throw new Error("ID is required");
        }
        if (this._name.length === 0) {
            throw new Error("Name is required");
        }
    }

    clearEvents() {
        this._events = [];
    }

    changeName(name: string): void {
        this._name = name;
        this.validate();
    }

    changeAddress(address: Address): void {
        this._address = address;
        this._events.push(
            new CustomerAddressChangedEvent({ id: this._id, name: this._name, address: address.toString() })
        );
    }

    isActive(): boolean {
        return this._active;
    }

    activate(): void {
        if (this._address === undefined) {
            throw new Error("Address is mandatory to activate a customer.")
        }
        this._active = true;
    }

    deactivate(): void {
        this._active = false;
    }

    addRewardPoints(points: number): void {
        this._rewardPoints += points;
    }
}
