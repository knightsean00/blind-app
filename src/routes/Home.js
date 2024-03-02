import Header from "../components/Header";

function Home() {

    return (
        <>
            <Header />
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h1>Reimagine the Blind Date</h1>
                        <p>
                            Traditional blind dates are a gamble. The anticipation builds as you imagine who your 
                            mystery date might be, only to plummet after the initial awkward "hello".
                        </p>
                        <p>
                            Blind is here to upend the script. We believe the magic of a blind date 
                            shouldn't be confined to the pre-meeting jitters.
                        </p>
                        <p>
                            Imagine this: you know you're going on a date, but not where, with whom, or what 
                            awaits you. Your trusted friend, the "Blind Matchmaker," has crafted a curated adventure 
                            for you and your date, filled with unveiling moments and engaging activities.
                        </p>
                        <p>
                            Blind empowers matchmakers to become architects of serendipity, weaving a 
                            narrative through the date that fosters genuine connection.
                        </p>
                        <p>
                            Join Blind and become a part of the future of dating. Step outside the
                            box, ignite the spark, and rewrite the blind date script.
                        </p>
                        <p>
                            Blind stores all of its data in the URL (resulting in some funky looking links) and was written to be serverless.
                            Because of this, Blind will always remain a free service for those looking to matchmake and be matchmade.
                        </p>
                        <p className="note">Most of the section above was written by <a href="https://gemini.google.com/app">Gemini by Google</a> because I'm lazy as fuck</p>
                        <h2 className="pt-5">Tips for creating blind dates</h2>
                        <ol>
                            <li className="pb-3">
                                Try to split up your date into as many small tasks as possible. This keeps the daters 
                                on their toes for each upcoming event.
                            </li>
                            <li className="pb-3">
                                Add decoys. Similar to tip #1, this keeps daters on their toes. Try directing them to a
                                nearby restaurant that is closed and then revealing to them in a later event the correct, nearby location.
                            </li>
                            <li className="pb-3">
                                Add checkpoints. Ask them to text you at specific points or Venmo you for reservations that
                                you have created for them. This allows you to ensure that the date is progressing smoothly.
                            </li>
                        </ol>
                        <p>
                            You can view an example date page <a href="/test">here</a>. Note that a real date page will not contain
                            extraneous information like the data stored in the URL or the checksum.

                            The default behavior for most dates will likely be displaying events one after the other, while always keeping
                            the daters at most one step ahead.
                        </p>
                    </div>
                </div>
                <div className="row pt-5">
                    <div className="col-md-12 text-center">
                        <a href="/create"><button className="text-center">Create Your First Date Now</button></a>
                    </div>
                </div>
                <div className="row pt-5 pb-3">
                    <div className="col-md-12 text-center">
                        <a href="https://github.com/knightsean00/blind-app"><p className="footer-text">View source</p></a>
                        <a href="https://knightsean00.github.io/"><p className="footer-text">Created by Sean Knight with <a className="colored">♥</a></p></a>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
