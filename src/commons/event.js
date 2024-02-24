import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import { DateTime } from "luxon";
import Showdown from "showdown";
import parse from "html-react-parser";
import RemoveMarkdown from "remove-markdown";

const converter = new Showdown.Converter();

class Event {
    constructor(toDisplay = null, start = null, end = null, displayTime = null) {
        this.start = start;
        this.end = end;
        this.markdown = toDisplay;
        if (toDisplay != null) {
            this.toDisplay = parse(converter.makeHtml(toDisplay));
        }
        this.displayTime = displayTime;
        this.notified = false;
    }

    setStart(start) {
        this.start = start;
    }
    setEnd(end) {
        this.end = end;
    }
    setToDisplay(toDisplay) {
        this.markdown = toDisplay;
        this.toDisplay = parse(converter.makeHtml(toDisplay));
    }
    setDisplayTime(displayTime) {
        this.displayTime = displayTime;
    }

    validate() {
        const errors = {}
        if (this.start == null) {
            errors["start"] = new Error("Start time must be specified")
        }
        if (this.end == null) {
            errors["end"] = new Error("End time must be specified")
        }
        if (this.displayTime == null) {
            errors["displayTime"] = new Error("Disply time must be specified")
        }
        if (this.toDisplay == null) {
            errors["toDisplay"] = new Error("An event description must be specified")
        }
        return errors
    }

    /**
     * Given an event that occurs before this and if this displayTime has not already been set,
     * then set this displayTime based on the start of the previous event.
     * 
     * NOTE: This does not work on the first event.
     * 
     * @param {Event} event the event preceeding this one
     */
    updateFromLast(event) {
        if (this.displayTime == null && event.start != null) {
            this.displayTime = event.start
        }
    }

    /**
     * Given an event that occurs after this and if this end has not already been set,
     * then set this end based on the start of the next event.
     * 
     * NOTE: This does not work on the last event
     * 
     * @param {Event} event the event after this
     */
    updateFromNext(event) {
        if (this.end == null && event.start != null) {
            this.end = event.start
        }
    }

    render(showAll = false) {
        if (this.start == null || this.end == null || this.displayTime == null) {
            throw Error("Start, end, and displayTime has to be set.")
        }

        const now = DateTime.now();
        if (!showAll && now < this.displayTime) {
            return <></>;
        }
        if (this.start < now && now < this.end) {
            return (
                <>
                    <div className="col-md-5 active">
                        <p>{now.toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)}</p>
                    </div>
                    <div className="col-md-7 active">{this.toDisplay}</div>
                </>
            );
        }

        if (!this.showAll && !this.notified) {
            this.notified = true;
            
            if (window.Notification) {
                Notification.requestPermission().then((res) => {
                    if (res === "granted") {
                        navigator.serviceWorker.ready.then((registration) => {
                            registration.showNotification(
                                `New event revealed, starting at ${this.start.toLocaleString(DateTime.TIME_WITH_SECONDS)}`,
                                {
                                    body: RemoveMarkdown(this.markdown),
                                    icon: `${process.env.PUBLIC_URL}/logo512.png`
                                }
                            )
                        })
                    }
                });
            }
        }
        return (
            <>
                <div className="col-md-5 greyed">
                    <p>{this.start.toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)}</p>
                </div>
                <div className="col-md-7 greyed">{this.toDisplay}</div>
            </>
        );
    }

    // NOTE: Could save space by switching to object and just doing to string on that
    // Could also use reference time to reduce epoch seconds
    toString() {
        return `${this.markdown}\v${Math.floor(this.start.toSeconds())}\v${Math.floor(this.end.toSeconds())}\v${Math.floor(this.displayTime.toSeconds())}`
    }

    static fromString(str) {
        const values = str.split("\v");
        return new Event(values[0], DateTime.fromSeconds(parseInt(values[1])), DateTime.fromSeconds(parseInt(values[2])), DateTime.fromSeconds(parseInt(values[3])));
    }
}

class EventList {
    constructor(events) {
        this.events = [...events];
        const startEvent = this.events[0];
        const endEvent = this.events[this.events.length - 1];

        if (startEvent.start == null || startEvent.displayTime == null) {
            throw Error("Start event must have a start and a display time");
        }

        if (endEvent.start == null || endEvent.end == null) {
            throw Error("End event must have an end time");
        }

        for (let i = 0; i < this.events.length; i++) {
            if (this.events[i].start == null) {
                throw Error(`Event ${i} must have a start time that is non-null`);
            }
        }

        for (let i = 1; i < this.events.length; i++) {
            this.events[i].updateFromLast(this.events[i - 1]);
        }

        for (let i = this.events.length - 2; i >= 0; i--) {
            this.events[i].updateFromNext(this.events[i + 1]);
        }

        this.events.sort((a, b) => {
            if (a.start < b.start) {
                return -1;
            }
            if (a.start > b.start) {
                return 1;
            }
            return 0;
        });
    }

    validate() {
        const output = []
        for (let i = 0; i < this.events.length; i++) {
            output.push(this.events[i].validate())
        }
        return output;
    }

    toString() {
        return this.events.map(i => i.toString()).join("\t");
    }

    static fromString(str) {
        const events = str.split("\t");
        return new EventList(events.map(i => Event.fromString(i)));
    }

    compress() {
        return compressToEncodedURIComponent(this.toString());
    }

    static decompress(str) {
        return this.fromString(decompressFromEncodedURIComponent(str));
    }
}

function checkSum(str) {
    return [...str].reduce((sum, char) => sum + char.charCodeAt(), 0);
}

export { Event, EventList, checkSum };