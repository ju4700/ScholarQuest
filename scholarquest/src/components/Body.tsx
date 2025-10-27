import Navbar from "./Navbar";
import Hero from "./Hero";

function Body() {
    return (
        <>
            <div className="flex flex-col h-screen xl:overflow-hidden">
                <Navbar />
                <Hero />
            </div>
        </>
    )
}
export default Body;