import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
    
    const [data, setData] = useState(null);

    useEffect(() => {
        // api for image of the day
        fetch("https://api.nasa.gov/planetary/apod?api_key=fF4HMbuEQk2CW3JVNGNehOUK0a2Z42Fy5iprCoEY")
            .then((res) => res.json())
            .then((data) => {
                setData(data);
            });
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                {/* list top 5 songs */}
                {data ? (
                    <div>
                        <h1>{data.title}</h1>
                        <img src={data.url}
                            alt={data.title}
                            style={{ width: "400px" }}
                        />
                        <p>{data.explanation}</p>
                    </div>
                ) : (
                    <h1>Loading...</h1>
                )}
                <h1>PWA</h1>
            </header>
        </div>
    );
}

export default App;
