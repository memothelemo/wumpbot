import { Event } from "../../typings/bot";
import { identity } from "../Functions/identity";

export = identity<Event<"ready">>({
	event: "ready",
	callback: () => console.log("Ready!"),
});
