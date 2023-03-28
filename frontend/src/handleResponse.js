import { toast } from "react-toastify";

export class HandleResponse {
    static handle(response_json) {
        if (response_json.consoleError) {
            console.log(response_json.consoleError)
        } else if (response_json.error) {
            toast.error(response_json.error)
        } else if (response_json.message) {
            toast.success(response_json.message)
        } else {
            console.log("The response has no info.")
        }
    }
}