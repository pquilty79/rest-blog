import {getUser} from "./PostIndex.js";
import {isLoggedIn} from "../auth.js";

export default function Home(props) {
    const loggedIn = isLoggedIn();
    if (loggedIn) {
        return `
            <div class="row set-up-row">
            <div class="card set-up-card"> 
            <h3>Welcome ${getUser()}!</h3>
                <p class="tagline">
                    Tell us what you know. If it is on the internet, it must be true. If others want to be right too, they should make sure they agree with you on all things.
                </p>    
                    </div>
            </div> 
    `;
    } else {
        return `
        <div class="row set-up-row">
            <div class="card set-up-card"> 
            <h3>Welcome!</h3>
                <p class="tagline">
                    You may lurk all you want, but only registered users can post.
                </p>    
            </div>
        </div>
    `;
    }

}