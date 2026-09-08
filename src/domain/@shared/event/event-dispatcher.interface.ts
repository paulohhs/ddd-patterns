import EventHandlerInterface from "./event-handler.interface";
import EventInterface from "./event.interface";

export default interface EventDispatcherInterface {
    notify<T extends EventInterface>(event: T): void;
    register<T extends EventInterface>(eventName: string, eventHandler: EventHandlerInterface<T>): void;
    unregister<T extends EventInterface>(eventName: string, eventHandler: EventHandlerInterface<T>): void;
    unregisterAll(): void;
}
