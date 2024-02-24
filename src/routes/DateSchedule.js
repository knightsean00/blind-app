import { Event, EventList, checkSum } from "../commons/event";
import { DateTime } from "luxon";
import { decompressFromEncodedURIComponent } from "lz-string";
import { PropTypes } from 'prop-types';
import { useState, useEffect } from "react";

const currentTime = DateTime.now().toSeconds();

// 115259
// EIJwlgdg5gBAhjALgCzAYwNYwFZ0wU0XggBMYBbfQ+IlfGAbQAUB7AGzAGdkYAVcONDb4AugApkiRAAdOALgD0C8nFkA6VdLVQWLbWwUB1ACIAWAMwA1RADkA0gA8AnDadQAGu4BMADgCUADQwAGaQZPh4PCx0IMRkkIggLCQArmj0AJ4sKSCc+GwAbvicAQCMAOwADD5epk7lPk5qXl4ArGVVNXU+rU0t7RXVtfXlfW0A3MD4UJAwAO5wbBiQsIgsjKwc3HwCQqISUrKKyqqcGtJaOnpQBiYW1vbOrh7e-h1D3b3Nbe9dTj6jb4DTrDBpjVrjACCJHIYBA9DoIXA+DIaFQBAgNBgwBYEDRuLiMAiRBILDmmMRSTgZDgRGY7C4PH4YEEN32khk8iUKnUmm0un0RjMVlsjhcbk8vj8MEgnEQERIv2GAPBSu6TlVgz+PXB4wAmtkYMg4EV4DB4XkQAVaWACbSYE45K1WjAAEYpWggDJIdau+ilF2wiAe4pEuAgNgZACEMAAkgAxGB6gDyAFUYJCAEoAURgABlIbxcyn0wBhSE2GzJ3gwJgFvVqWtwb3BFixVvJQl+maYhZLFY+jYM7bM1nCcQco7c07nS4Cm5C+6ip4S16BLXKjVAtUa0qakHdQH9KEgcCm+30rZM3ZsieHLknXkXfnXW7Ch5i56St4wNH4TAALSzCkpD4LEADKEQQAA5JwMAQHAlCEtIzYhG2SDIPQFpECwwQYfQJD4NILCcGARApKR0BGlwv7hmQBKhMIjY2GSMBZCkbrRFEcz0EhAAkLoEpY+AQOQ6xiAAAhgEBgFAkh5IIlSVOuB67vuHwauY6nalux5MKhghkMIJq8ZAYAATobDBI2ADi6xrEOV47Cyex3pyxw8mcfJXIKdwio84ovFKO5OFp24bnUThfP0IV7kCJ5nvQF6bIyzljuy94eTO3nzm+S4BV+a4wASiKkYRv5sCRxS0PZmG-mRGSNsYXBoBRnAKNSsLwvhMAFGA+BzISkGCLB8CumAHCIN6DnSGwghuhwpAwCQtLFCF0U-BFGpHptqmhbq+nTXV8IqGZVECWoTiVBh9rsWGaLFTxg7DZiQkiWJMCSdJsnyVBSnSoZy3rHMxrykUsSxjAUApMUJRbfU2nDBqiORRtrRAA

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
                <h1 style={{ textAlign: "center" }}>Invalid Event data</h1>
            </div>
        )
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h1>{props.checkSum ? "Watcher" : "Blind"}</h1>
                    {props.test != null && props.test === true ?
                        <>
                            <p>Compressed data</p>
                            <p style={{ wordWrap: "break-word" }}>{blindEvents.compress()}</p>
                            <p>Checksum</p>
                            <p style={{ wordWrap: "break-word" }}>{checkSum(blindEvents.toString())}</p>
                        </> :
                        <></>}
                    {/* <p>{blindEvents.toString()}</p>
                    <p>{checkSum(blindEvents.toString())}</p>
                    <p>{blindEvents.compress()}</p>
                    <p>{checkSum(blindEvents.compress())}</p>
                    <p>{decompressFromEncodedURIComponent(blindEvents.compress())}</p>
                    <p>{EventList.decompress(blindEvents.compress()).toString()}</p>
                    <p>{checkSum(EventList.decompress(blindEvents.compress()).toString())}</p> */}
                    {/* <p>{props.data}</p> */}
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
