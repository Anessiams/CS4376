import {useState} from "react";
import logo from './assets/astronaut-miner.png'
const API_URL = "https://sanjaykumaran.com/";
export default function App() {
    const [searchType, setSearchType] = useState("OR");
    const [resultsLength, setResultsLength] = useState(15);
    const [queryString, setQueryString] = useState("");
    const [results, setResults] = useState([]);

    const sendSearchRequest = async () => {
        console.log("Sending search request for: " + queryString);
        const response = await fetch(API_URL + "/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                queryString: queryString,
                type: searchType,
                results: resultsLength
            })
        });
        const data = await response.json();
        console.log(data);
        setResults(data);
    }

    return (
        <>
            {/*Header*/}
            <div className="flex row p-3 items-center mb-3">
                <img src={logo} height="55" width="55" alt=""/>
                <h2 className="text-2xl font-bold ml-3">Cyberminer</h2>
                <input type="text" placeholder="Search here!" className="input input-bordered w-[400px] ml-2"
                       onChange={(e) => setQueryString(e.target.value)}
                       value={queryString}
                />
                <button className="btn ml-1" onClick={sendSearchRequest}><strong>Search!</strong></button>
                <div className="dropdown">
                    <label tabIndex={0} className="btn m-1">Search type: {searchType}</label>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li className="font-bold p-2" onClick={() => setSearchType("OR")}>OR</li>
                        <li className="font-bold p-2" onClick={() => setSearchType("AND")}>AND</li>
                        <li className="font-bold p-2" onClick={() => setSearchType("NOT")}>NOT</li>
                    </ul>
                </div>
                <div className="dropdown">
                    <label tabIndex={0} className="btn m-1">Results: {resultsLength}</label>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li className="font-bold p-2" onClick={() => setResultsLength(5)}>5</li>
                        <li className="font-bold p-2" onClick={() => setResultsLength(10)}>10</li>
                        <li className="font-bold p-2" onClick={() => setResultsLength(15)}>15</li>
                    </ul>
                </div>
                <button className="btn">Add site</button>
            </div>
            {/*Results*/}
            <div className="px-10">
                {results.map((result: any, index: number) => {
                    return (<div className="mb-3" key={index}>
                        {result?.site?.payment ? <p><strong>Sponsored</strong></p> : null}
                        <a className="text-xl">{result?.site?.url}</a>
                        <div className="flex items-center">
                            <p className="mr-3"><strong>Expiration:</strong> {new Date(result?.site?.expirationDate).toLocaleDateString("en-US")}</p>
                            <p><strong>Clicks:</strong> {result?.site?.clicks}</p>
                        </div>
                    </div>)
                })}
            </div>
        </>
    )
}