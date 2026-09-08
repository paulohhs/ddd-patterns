import EventDispatcherInterface from "./event-dispatcher.interface";
import EventHandlerInterface from "./event-handler.interface";
import EventInterface from "./event.interface";

export default class EventDispatcher implements EventDispatcherInterface {
    private eventHandlers: { [eventName: string]: EventHandlerInterface[] } = {};

    get getEventHandlers(): { [eventName: string]: EventHandlerInterface[] } {
        return this.eventHandlers;
    }

    register<T extends EventInterface>(eventName: string, eventHandler: EventHandlerInterface<T>): void {
        if (!this.eventHandlers[eventName]) {
            this.eventHandlers[eventName] = [];
        }
        this.eventHandlers[eventName].push(eventHandler);
    }

    unregister<T extends EventInterface>(eventName: string, eventHandler: EventHandlerInterface<T>): void {
        if (this.eventHandlers[eventName]) {
            const index = this.eventHandlers[eventName].indexOf(eventHandler);
            
            if (index !== -1) {
                this.eventHandlers[eventName].splice(index, 1);
            }
        }
    }

    unregisterAll(): void {
        this.eventHandlers = {};
    }

    notify<T extends EventInterface>(event: T): void {
        const eventName = event.constructor.name;
        const handlers = this.eventHandlers[eventName];

        if (handlers) {
            handlers.forEach(handler => handler.handle(event));
        }
    }
}