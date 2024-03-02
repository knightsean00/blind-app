import { MDXEditor, UndoRedo, BoldItalicUnderlineToggles, toolbarPlugin, linkPlugin, linkDialogPlugin, CreateLink } from "@mdxeditor/editor";
import Header from "../components/Header";
import { Event, EventList, checkSum } from "../commons/event";
import { DateTime } from "luxon";
import { useState, useEffect } from "react";
import zones from "tzdata";

const format = "yyyy-MM-dd'T'HH:mm z"

function EventElement({ timezone, lastDate, blindEvent, onBlindEventChange, idx, maxIdx, onDelete }) {
    const [date, setDate] = useState(blindEvent.start != null && blindEvent.start.isValid ? blindEvent.start.toFormat("yyyy-MM-dd") : "");
    const [isValidDate, setIsValidDate] = useState(true);

    const [startTime, setStartTime] = useState(blindEvent.start != null && blindEvent.start.isValid ? blindEvent.start.toFormat("HH:mm") : "");
    const [isValidStart, setIsValidStart] = useState(true);

    const [endTime, setEndTime] = useState(blindEvent.end != null && blindEvent.end.isValid ? blindEvent.end.toFormat("HH:mm") : "");
    const [isValidEnd, setIsValidEnd] = useState(true);

    const [displayTime, setDisplayTime] = useState(blindEvent.displayTime != null && blindEvent.displayTime.isValid ? blindEvent.displayTime.toFormat("HH:mm") : "");
    const [isValidDisplayTime, setIsValidDisplayTime] = useState(true);

    const [description, setDescription] = useState(blindEvent.markdown != null ? blindEvent.markdown : "");

    useEffect(() => {
        if (date === "" && lastDate != null && dateCheck(lastDate)) {
            setDate(lastDate);
        }
    }, []);

    useEffect(() => {
        // This results in an additional unnecessary render perhaps?
        updateTimes(date, startTime, endTime, displayTime);
    }, [timezone]);

    function updateTimes(newDate, newStart, newEnd, newDisplayTime) {
        let changed = false;
        if (newDate != null) {
            setDate(newDate);
        }

        if (newStart != null) {
            setStartTime(newStart);
            newStart = DateTime.fromFormat(`${newDate}T${newStart} ${timezone}`, format, { setZone: true });
            if (newStart.isValid) {
                blindEvent.setStart(newStart);
                changed = true;
            }
        }

        if (newEnd != null) {
            setEndTime(newEnd);
            newEnd = DateTime.fromFormat(`${newDate}T${newEnd} ${timezone}`, format, { setZone: true });
            if (newEnd.isValid) {
                blindEvent.setEnd(newEnd);
                changed = true;

            }
        }

        if (newDisplayTime != null) {
            setDisplayTime(newDisplayTime);
            newDisplayTime = DateTime.fromFormat(`${newDate}T${newDisplayTime} ${timezone}`, format, { setZone: true });
            if (newDisplayTime.isValid) {
                blindEvent.setDisplayTime(newDisplayTime);
                changed = true;

            }
        }

        if (changed) {
            onBlindEventChange();
        }
    }

    function updateDescription(newDescription) {
        if (newDescription != null) {
            setDescription(newDescription);
            blindEvent.setToDisplay(newDescription);
            onBlindEventChange();
        }
    }

    function dateCheck(date) {
        return DateTime.fromFormat(date, "yyyy-MM-dd").isValid
    }

    function timeCheck(time) {
        return DateTime.fromFormat(`${date}T${time} ${timezone}`, format, { setZone: true }).isValid
    }

    function deleteEvent() {
        if (window.confirm("Are you sure you want to delete this event?")) {
            onDelete()
        }
    }

    return (
        <div className="mt-5 pb-4 row card">
            <div className="col-md-12">
                <h2>Event {idx + 1}</h2>

                <p className="label-title">*Date</p>
                <input type="date" className={isValidDate ? "" : "invalid-input"} value={date} onChange={ev => updateTimes(ev.target.value, startTime, endTime, displayTime)} onBlur={() => setIsValidDate(dateCheck(date))} />
                {
                    isValidDate ?
                        <></> :
                        <p className="invalid label">Invalid date</p>
                }

                <p className="label-title">*Start</p>
                <input type="time" className={isValidStart ? "" : "invalid-input"} value={startTime} onChange={ev => updateTimes(date, ev.target.value, endTime, displayTime)} onBlur={() => setIsValidStart(timeCheck(startTime))} />
                {
                    isValidStart ?
                        <></> :
                        <p className="invalid label">Invalid time</p>
                }

                {
                    idx === maxIdx ?
                        <p className="label-title">*End</p> :
                        <p className="label-title">End (leave blank to take next start time)</p>
                }
                <input type="time" className={isValidEnd || idx !== maxIdx ? "" : "invalid-input"} value={endTime} onChange={ev => updateTimes(date, startTime, ev.target.value, displayTime)} onBlur={() => setIsValidEnd(timeCheck(endTime))} />
                {
                    isValidEnd || idx !== maxIdx ?
                        <></> :
                        <p className="invalid label">Invalid time</p>
                }

                {
                    idx === 0 ?
                        <p className="label-title">*Display Time</p> :
                        <p className="label-title">Display Time (leave blank to take previous end time)</p>
                }

                <input type="time" className={isValidDisplayTime || idx !== 0 ? "" : "invalid-input"} value={displayTime} onChange={ev => updateTimes(date, startTime, endTime, ev.target.value)} onBlur={() => setIsValidDisplayTime(timeCheck(displayTime))} />
                {
                    isValidDisplayTime || idx !== 0 ?
                        <></> :
                        <p className="invalid label">Invalid time</p>
                }

                <p className="label-title pt-3">*Description</p>
                <MDXEditor
                    markdown={description}
                    plugins={[
                        linkPlugin(),
                        linkDialogPlugin(),
                        toolbarPlugin({
                            toolbarContents: () => (
                                <>
                                    <UndoRedo />
                                    <BoldItalicUnderlineToggles />
                                    <CreateLink />
                                </>
                            )
                        })
                    ]}
                    onChange={updateDescription}
                    className="dark-theme dark-editor dark-editor-border"
                />

                <div className="pt-5 text-center">
                    <button className="delete" onClick={() => deleteEvent()}>Delete</button>
                </div>
            </div>
        </div>
    )
}

function Create({ linkCheckSum, linkData }) {
    const [blindEvents, setEvents] = useState([]);
    const [timezone, setTimezone] = useState(DateTime.local().zoneName);
    const [isValidTimezone, setIsValidTimezone] = useState(timezoneCheck(timezone))
    const [blindCheckSum, setBlindCheckSum] = useState(null);
    const [blindData, setBlindData] = useState(null);

    function timezoneCheck(timezone) {
        return DateTime.local().setZone(timezone).isValid;
    }

    function deleteEvent(idx) {
        setEvents([...blindEvents.slice(0, idx), ...blindEvents.slice(idx + 1)])
    }

    function handleEventChange() {
        setEvents([...blindEvents]);
    }

    useEffect(() => {
        if (linkData != null && linkCheckSum != null) {
            try {
                const calculatedEvents = EventList.decompress(linkData);
                if (checkSum(calculatedEvents.toString()) === linkCheckSum) {
                    console.log(calculatedEvents.events);
                    setEvents(calculatedEvents.events);
                    setBlindData(linkData);
                    setBlindCheckSum(linkCheckSum);
                }
            }
            catch (err) {
                console.log("Invalid link data");
                console.error(err);
            }
        }
    }, []);

    useEffect(() => {
        try {
            const newBlindEvent = new EventList(blindEvents);
            setBlindData(newBlindEvent.compress());
            setBlindCheckSum(checkSum(newBlindEvent.toString()))
        } catch (err) {
            // console.error(err);
            setBlindData(null);
            setBlindCheckSum(null);
        }
    }, [blindEvents])

    function copyLink(suffix) {
        let output = `${window.location.protocol}//${window.location.hostname}`;
        if (window.location.port.length > 0) {
            output += `:${window.location.port}`;
        }

        output += suffix;
        console.log(`Copying ${output} to clipboard`);
        navigator.clipboard.writeText(output);
    }


    return (
        <>
            <Header />
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h1>Create</h1>
                        <p className="label-title">Timezone to use</p>
                        <select name="timezone" value={timezone} onBlur={() => setIsValidTimezone(timezoneCheck(timezone))} onChange={ev => setTimezone(ev.target.value)}>
                            {
                                Object.keys(zones.zones).map((val, idx) => <option value={val} key={idx}>{val}</option>)
                            }
                        </select>
                        {
                            isValidTimezone ?
                                <></> :
                                <p className="invalid label">Invalid timezone</p>
                        }
                    </div>
                </div>
                {
                    blindEvents.map((val, idx) =>
                        <EventElement
                            key={idx}
                            idx={idx}
                            maxIdx={blindEvents.length - 1}
                            onDelete={() => deleteEvent(idx)}
                            lastDate={blindEvents.length > 1 && blindEvents[blindEvents.length - 2].start != null ? blindEvents[blindEvents.length - 2].start.toFormat("yyyy-MM-dd") : null}
                            onBlindEventChange={handleEventChange}
                            timezone={timezone}
                            blindEvent={blindEvents[idx]}
                        />
                    )
                }
                <div className="row py-5">
                    <div className="col-md-12 text-center">
                        <button onClick={() => setEvents([...blindEvents, new Event()])}>+ Add Event</button>
                    </div>
                </div>
                {
                    blindData != null && blindData.length > 0 && blindCheckSum != null && blindCheckSum > 0 ?
                        <div className="row pt-3 pb-5">
                            <div className="col-md-12 text-center">
                                <p>The URLs generated will contain all the data necessary for the date, please copy <strong>All OF THEM</strong> somewhere safe!</p>
                                <p>The first button (Participants) will copy the link that you should provide to the date-goers, this link should display your events as normal</p>
                                <p>
                                    The second button (Spectators) will copy the link that you and other spectators of the date
                                    should use, this link will display all of your events regardless of display time.

                                    <strong>
                                        YOU SHOULD NOT PROVIDE THIS LINK TO THE PARTICIPANTS, IT WILL TELL THEM OF ALL OF THE EVENTS
                                        YOU HAVE PLANNED!
                                    </strong>

                                    You might also notice that your event list looks a bit different than how you arranged it, that is because we will automatically
                                    sort the events based on their start time.
                                </p>
                                <p>
                                    The third button (Editors) will provide you a link so you can return to this page and make changes.
                                    Just like the (Spectators) button, you should not give this link to the participants! Also, if you make changes,
                                    please note that you will have to regnerate the link and provide the new link to the participants because this service
                                    is serverless and stores all of the date information in the link!
                                </p>
                                {/* <p>{blindData != null ? blindData : ""}</p> */}
                            </div>
                            <div className="col-md-4 text-center">
                                <button onClick={() => copyLink(`/date/${blindData}`)}>Copy Participants</button>
                            </div>
                            <div className="col-md-4 text-center">
                                <button onClick={() => copyLink(`/watcher/${blindCheckSum}/${blindData}`)}>Copy Spectators</button>
                            </div>
                            <div className="col-md-4 text-center">
                                <button onClick={() => copyLink(`/edit/${blindCheckSum}/${blindData}`)}>Copy Editors</button>
                            </div>
                        </div>
                        :
                        <></>
                }
            </div>
        </>
    );
}

export default Create;
