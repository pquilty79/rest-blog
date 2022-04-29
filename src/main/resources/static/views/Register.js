import CreateView from "../createView.js"
import {getHeaders} from "../auth.js";
import createView from "../createView.js";

export default function Register(props) {
    return `
    <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8"/>
                <title>Register</title>
            </head>
            <body>
                <h3>Register</h3>
        
                <form id="register-form">
                    <label for="username">Username:</label>
                    <input id="username" name="username" type="text"/>
                    <br>
                    <label for="email">Email:</label>
                    <input id="email" name="email" type="email">
                    <br>
                    <label for="password">Password:</label>
                    <input id="password" name="password" type="password"/>
                    <br>
                    <button id="register-btn" type="button">Register</button>
                    <br>
                    <p id="register-response">Registration failed. Please try again.</p>
                </form>
            </body>
        </html>
`;
}

export function RegisterEvent(){
    $("#register-btn").click(function(){

        let newUser = {
            username: $("#username").val(),
            email: $("#email").val(),
            password: $("#password").val()
        }

        console.log(newUser);

        let request = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newUser)
        }

        fetch("http://localhost:8081/api/users/create", request)
            .then(response => {
                console.log(response.status);
                if(response.status === 500){
                    $("#register-response").css({display: "inline-block"});
                } else {
            createView("/")
        }
            })
    })
}
