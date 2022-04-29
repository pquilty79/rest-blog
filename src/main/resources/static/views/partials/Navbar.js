import {isLoggedIn} from "../../auth.js";


export default function Navbar(props) {
    const loggedIn = isLoggedIn();
    let html = `<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand" href="#">MyOpinionShouldBeYours.com</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <a class="nav-link" href="/" data-link>Home</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/about" data-link>About</a>
      </li>`

    if(loggedIn) {
        html = html + `
              <li class="nav-item">
        <a class="nav-link" href="/posts" data-link>Posts</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/users" data-link>Profile</a>
      </li>
      <li class=""nav-item">
      <a class="nav-link" href="/logout" onclick="window.localStorage.clear()" data-link>Logout</a>
      </li>
`
    } else {
        html = html + `
              <li class="nav-item">
        <a class="nav-link" href="/posts" data-link>Posts</a>
      </li>
              <li class="nav-item">
        <a class="nav-link" href="/login" data-link>Login</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/register" data-link>Register</a>
      </li>
       `
    }
    html = html + '    </ul>\n  </div>\n</nav>'

    return html;
}


