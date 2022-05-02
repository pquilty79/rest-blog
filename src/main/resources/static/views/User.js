import createView from "../createView.js";
import {getHeaders} from "../auth.js";

const URI = "http://localhost:8081/api/users/me"


export default function User(props) {
    return `
    <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8"/>
                <title>Edit User</title>
            </head>
            <body>
                <form id="profile-form">
                    <h3>Profile</h3>
                    <p>Username: ${props.users.username}</p>
                    <p>Email: ${props.users.email}</p>
                    <p>Account Level: ${props.users.role} &nbsp&nbsp&nbsp&nbsp&nbspMember Since: ${props.users.createdAt}</p>
                    <p>Total Posts: ${props.users.posts.length} &nbsp&nbsp&nbsp&nbsp&nbspTotal Comments: ${props.users.comments.length}</p>
                    <h6>Change Password:</h6>
                    <label for="new-password">Enter New Password:</label>
                    <input id="new-password" name="newpassword" type="password"/>
                    <label for="confirm-password">Confirm Password:</label>
                    <input id="confirm-password" name="confirmpassword" type="password"/>
                    <button id="submit-edit-btn" type="button">Submit</button>
                    <p id="password-message"></p>
                </form>
            <div id="posts-container" class= "container-fluid mt-5">
                <div class="row">
                    <div class="col">
                        <h4>Post History</h4>
             ${props.users.posts.reverse().map(post => `<div class="card">
                 <div class="card-body">
                 <div class="card-header text-muted"><p id="date">posted: ${post.date} by ${props.users.username}</p></div>
                 <h4 id="initial-title-${post.id}" class="posttitle">${post.title}</h4><input class="edit" id="edit-title-${post.id}" style="display:none;"  value=${post.title}>
                 <br id="br-${post.id}" style="display:none;">
                 <p id="initial-post-${post.id}">${post.content}</p>
                 <textarea class="form-control" id="edit-content-${post.id}" rows="8" style="display:none;">${post.content}</textarea>

          </div>
             <div class="card-footer text-muted">
             <input type="text" id="edit-category-${post.id}" style="display:none;" class="form-control" value=${post.categories[0].name}  name="postCategory">
             ${post.categories.map(category => `<p class="post-categories">#${category.name}</p>`).join('')}
             <input id="initial-button-${post.id}"type="submit" class="btn btn-primary edit-post-button" data-id="${post.id}" value="Edit">
             <input type="submit" id="edit-button-${post.id}" class="btn btn-primary submit-post-button edit" style="display:none;" data-id="${post.id}" value="Submit">
                <input type="submit" id="delete-button-${post.id}" class="btn btn-primary delete-post-button" data-id="${post.id}" value="Delete">
                <input type="submit" id="cancel-button-${post.id}" class="btn btn-primary edit cancel-button" style="display:none;" data-id="${post.id}" value="Cancel">
</div></div>
         `).join('')}
                    </div>
                    </div>
                    </div>
            </body>
        </html>
`;
}

export function UserEvents() {
    updatePasswordListener();
    deletePostListener();
    editPostListener();
    updatePostListener();
    cancelListener()
}

function updatePasswordListener() {
    $("#submit-edit-btn").click(function () {

        const newPassword = $("#new-password").val();
        const confirmPassword = $("#confirm-password").val();
        if (newPassword !== confirmPassword) {
            $("#password-message").innerText = "Passwords do not match. Renter new password to update."
        } else {
            $("#password-message").innerText = "Passwords updated."
            const request = {
                method: "PUT",
                headers: getHeaders(),
            }
            let uriExtra = '/updatePassword?newPassword=' + newPassword;
            fetch(URI + uriExtra, request)
                .then(res => {
                    console.log(res.status);
                }).catch(error => {
                console.log(error);
                $("#password-message").innerText = "Error updating password."
            }).finally(() => {
                createView("/users")
            })
        }
    })
}


function deletePostListener() {
    $(".delete-post-button-up").click(function (e) {
        const id = e.target.getAttribute("data-id")
        console.log(id)
        const request = {
            method: "DELETE",
            headers: getHeaders(),
        }
        fetch("http://localhost:8081/api/posts/" + id, request)
            .then(res => {
                console.log(res.status);
            }).catch(error => {
            console.log(error);
        }).finally(() => {
            createView("/users")
        });

    })
}

function cancelListener() {
    $(".cancel-button").click(function (e) {
        const id = e.target.getAttribute("data-id")
        $("#initial-title-" + id).css({display: "inline-block"});
        $("#initial-post-" + id).css({display: "inline-block"});
        $("#initial-button-" + id).css({display: "inline-block"});
        $("#delete-button-" + id).css({display: "inline-block"});
        $("#edit-title-" + id).css({display: "none"});
        $("#edit-content-" + id).css({display: "none"});
        $("#edit-category-" + id).css({display: "none"});
        $("#edit-button-" + id).css({display: "none"});
        $("#cancel-button-" + id).css({display: "none"});
    })
}

function editPostListener() {
    $(".edit-post-button").click(function (e) {
        const id = e.target.getAttribute("data-id")
        $("#initial-title-" + id).css({display: "none"});
        $("#initial-post-" + id).css({display: "none"});
        $("#initial-button-" + id).css({display: "none"});
        $("#delete-button-" + id).css({display: "none"});
        $("#edit-title-" + id).css({display: "inline-block"});
        $("#edit-content-" + id).css({display: "inline-block"});
        $("#edit-category-" + id).css({display: "inline-block"});
        $("#br-" + id).css({display: "inline-block"})
        $("#edit-button-" + id).css({display: "inline-block"});
        $("#cancel-button-" + id).css({display: "inline-block"});
    })
}

function updatePostListener() {
    $(".submit-post-button ").click(function (e) {
        const id = e.target.getAttribute("data-id")
        console.log(id)
        const title = $("#edit-title-" + id).val();
        const content = $("#edit-content-" + id).val();
        let categoriesList = $("#edit-category-" + id).val();
        let breakCats = (categoriesList.split(','));
        let categories = [];
        for (let category of breakCats) {
            category = {"name": category}
            categories.push(category)
        }
        const editedPost = {title, content, categories}
        console.log(editedPost)
        const request = {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(editedPost)
        }
        fetch("http://localhost:8081/api/posts/" + id, request)
            .then(res => {
                console.log(res.status);
            }).catch(error => {
            console.log(error);
        }).finally(() => {
            createView("/users")
        });
    })
}







