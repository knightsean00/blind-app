import { Event, EventList, checkSum } from "../commons/event";
import { DateTime } from "luxon";
import { PropTypes } from 'prop-types';
import { useState, useEffect } from "react";

const currentTime = DateTime.now().toSeconds();

const testEvents = new EventList([
    new Event(
        "This is a test",
        DateTime.fromSeconds(currentTime + 10),
        null,
        DateTime.fromSeconds(currentTime)
    ),
    new Event(
        "The second event occurs [here](https://www.google.com/maps)",
        DateTime.fromSeconds(currentTime + 20),
    ),
    new Event(
        "The third event occurs now",
        DateTime.fromSeconds(currentTime + 30),
    ),
    new Event(
        "The _fourth event_ occurs now",
        DateTime.fromSeconds(currentTime + 40),
    ),
    new Event(
        "The fifth event **occurs** now",
        DateTime.fromSeconds(currentTime + 50),
    ),
    new Event(
        "You can use any kind of markdown syntax!",
        DateTime.fromSeconds(currentTime + 60),
        DateTime.fromSeconds(currentTime + 100),
    ),
]);

function DateSchedule(props) {
    const [time, setTime] = useState(new Date());
    const [blindEvents, setEvents] = useState(null);
    const [realValue, setRealValue] = useState(null);


    useEffect(() => {
        try {
            const calculatedEvents = (props.test != null && props.test === true) ? testEvents : EventList.decompress(props.data);
            setEvents(calculatedEvents);
            setRealValue(checkSum(calculatedEvents.toString()))
        }
        catch (err) {
            console.error(err);
            console.log("Invalid event data");
        }

        Notification.requestPermission().then((res) => { console.log(res); })

        setInterval(() => {
            setTime(new Date());
        }, 1000);
    }, []);

    if (blindEvents == null || realValue == null) {
        return (
            <div className="full">
                <h1 style={{ textAlign: "center" }}>Invalid event data</h1>
            </div>
        )
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h1>{props.checkSum ? "Watcher" : "Blind"}</h1>
                    {
                        props.test != null && props.test === true ?
                            <>
                                <p>Compressed data</p>
                                <p style={{ wordWrap: "break-word" }}>{blindEvents.compress()}</p>
                                <p>Checksum</p>
                                <p style={{ wordWrap: "break-word" }}>{checkSum(blindEvents.toString())}</p>
                            </> :
                            <></>
                    }
                </div>
            </div>
            {blindEvents.events.map((i, idx) => <div className="row" key={idx}> {i.render(realValue === props.checkSum)} </div>)}
        </div>
    );
}

DateSchedule.propTypes = {
    data: PropTypes.string,
    checkSum: PropTypes.number,
    test: PropTypes.bool
}


export default DateSchedule;
