import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DefaultWrapper } from "./components";

/*
This is the response page after submitting a request

*/
export default function Responses(){
    const [searchParams] = useSearchParams();
    const nav = useNavigate();
    return (<>
        <DefaultWrapper>
            {
                (searchParams.get("res") ?? "") == "error" &&
                <div>
                <h3 style={{fontSize: "2rem"}}>
                    An error has occurred! 
                </h3>
                <h3 style={{fontSize: "2rem"}}>
                    Error: {searchParams.get("data")}
                </h3>
                <h3 style={{fontSize: "2rem"}}>
                    Please retry or contact us @email.
                </h3>
                </div>
            }
            {
                (searchParams.get("res") ?? "") == "ok" &&
                <div>
                <h3 style={{fontSize: "2rem"}}>
                    Submitted Successfully.
                </h3>
                {
                    (searchParams.get("data")??"").length > 0 &&
                    <div>
                    <h3 style={{fontSize: "2rem"}}>
                        These entries were skipped: {searchParams.get('data')}
                    </h3>
                    <h3 style={{fontSize: "2rem"}}>
                        Due to input mismatch, request header mismatch or others.
                    </h3>
                    </div>
                }
                </div>
            }
            <button className="logoutbut" onClick={()=>{
                nav("../req");
            }}>Back</button>
        </DefaultWrapper>
    </>);
}