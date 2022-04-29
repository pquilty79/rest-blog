import {getUser} from "./PostIndex.js";
import {isLoggedIn} from "../auth.js";

export default function Home(props) {
    const loggedIn = isLoggedIn();
    if (loggedIn) {
        return `
        <header>
            <h3>Welcome ${getUser()}!</h3>
        </header>
        <main>
            <div>
                <p class="tagline">
                    Tell us what you know. If it is on the internet, it must be true. If others want to be right too, they should make sure they agree with you on all things.
                </p>    
            </div>
        </main>
    `;
    } else {
        return `
        <header>
            <h3>Welcome!</h3>
        </header>
        <main>
            <div>
                <p class="tagline">
                    You may lurk all you want, but only registered users can post.
                </p>    
            </div>
        </main>
    `;
    }

}