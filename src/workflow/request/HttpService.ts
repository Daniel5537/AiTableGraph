import axios from "axios";
import {IResponder} from "../events/interfaces/IResponder";
import {prefix, suffix} from "../config";

export class HttpService {
    private _fullURL: string;
    private _responder: IResponder;

    public set fullURL(value: string) {
        console.log(prefix);
        this._fullURL = `${prefix}${value}${suffix}`;
    }

    public get fullURL(): string {
        return this._fullURL;
    }

    constructor(rootURL: string, responder: IResponder) {
        console.log(rootURL);
        this.fullURL = rootURL;
        this._responder = responder;
    }

    public sendGetRequest(params: object= null): void {
        console.log(this._fullURL);
        axios.get(this._fullURL, {params: params})
            .then((resp) => {
                if (resp.status === 200)
                    if (typeof resp.data === "string") resp.data = JSON.parse(resp.data);
                    this._responder.result(resp.data);
            })
            .catch((error) => {
                this._responder.fault(error);
            });
    }

    public sendPostRequest(params: object= null): void {
        console.log(this._fullURL);
        this._fullURL = "http://localhost:5000/login";
        axios.post(this._fullURL, params)
            .then((resp) => {
                if (typeof resp.data === "string") resp.data = JSON.parse(resp.data);
                this._responder.result(resp);
            })
            .catch((error) => {
                this._responder.fault(error);
            });
    }
}