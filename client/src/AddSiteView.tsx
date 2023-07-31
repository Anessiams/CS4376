import {useState} from "react";
import LoadingIndicator from "./components/LoadingIndicator";
import {useNavigate} from "react-router-dom";

const API_URL = "https://sanjaykumaran.com/";

export default function AddSiteView() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [payment, setPayment] = useState(false);
    const [url, setUrl] = useState("");
    const sendAddSiteRequest = async () => {
        console.log("Sending add site request for: " + url)
        console.log("Payment: " + payment)
        setLoading(true);
        const response = await fetch(API_URL + "/add-site", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url: url,
                payment: true,
            })
        });
        const data = await response.json();
        console.log(data);
        setLoading(false);
    }
    return (
        <div className="flex flex-col p-5">
            <h2 className="text-2xl font-bold mb-2">Add site</h2>
            <input type="text" placeholder="Enter URL" className="input input-bordered w-[400px] max-w-xs"
            onChange={(e) => setUrl(e.target.value)}
            />
            <div className="form-control">
                <label className="label cursor-pointer">
                    <span className="label-text">Sponsored listing?</span>
                    <input type="checkbox" checked={payment} className="checkbox" onChange={()=>setPayment(!payment)}/>
                </label>
            </div>
            <p>Expiration (1 year): {new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('en-US')}</p>
            {loading ? <LoadingIndicator /> : <button onClick={sendAddSiteRequest} className="btn mt-2">Add</button>}
            <button onClick={()=>navigate("/")} className="btn mt-2">Back to search</button>
        </div>
    )
}