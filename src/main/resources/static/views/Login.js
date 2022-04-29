


export default function Login(props) {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8"/>
    <title>Log In</title>
</head>
<body>
<div class="row set-up-row">
<div class="card set-up-card"> 
<h3>Log In</h3>
<form id="login-form">
    <label for="username">Email:</label>
    <input id="username" name="username" type="text"/>
    <br>
    <label for="password">Password:</label>
    <input id="password" name="password" type="password"/>
    <br>
    <button id="login-btn" type="submit" value="Log In"/>Login</button>
    <br>
    <p id="login-response">Login failed. Please try again.</p>
</form>
</div>
</div>
</body>
</html>`;

}

