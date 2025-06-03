import axios from "../../axios";
import settings from "../config"
// handling sent messages
register("messageSent", (message, event) => {
    if (settings().muteBypass) {
        if (message.startsWith("/")) return
        cancel(event)
        axios.post("http://192.168.0.5:3001/api/mutechat", {
            headers: {
                Authorization: "yonkowashere"
            },
            body: {
                author: Player.getName(),
                message: message
            }
        })
            .catch(error => {
                if (error.isAxiosError) {
                    console.log(error.code + ": " + error.response.data);
                } else {
                    console.log(error.message);
                }
            })
    }
})