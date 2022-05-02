import createView from "../createView.js";
import {getHeaders, isLoggedIn} from "../auth.js";


const URI = "http://localhost:8081/api/posts"


export default function PostIndex(props) {
    return `
        <main>
            <div id="posts-container" class= "container-fluid mt-5">
                <div class="row">
                        <input type="submit" class="btn btn-primary" id="add-new-button" ${checkIfUser()}value="+ Post">
                        <input id="nosubmit" type="search" placeholder="Search categories...">
                        <br>
                        <div id="new-post" style="display: none;">
                            <form id="add-post-form" >
                                <h4>Add a Post:</h4>
                                <div class="form-group">
                                <input type="text" id="add-post-title" class="form-control" placeholder="Enter title" name="postTitle">
                        </div>
                        <div "class="form-group">
                        <input type="text" id="add-post-category" class="form-control" placeholder="Enter post category #'s" name="postCategory"><br>
                    </div>
                    <div "class="form-group">
                    <textarea class="form-control" id="add-post-content" rows="8" placeholder="Enter post here..."></textarea>
                    <form id="uploadform" enctype="multipart/form-data">

                    <table>
<tr><td>File to upload:</td><td><input type="file" name="file" id="add-file"/></td></tr>
<tr><td></td><td><input type="submit" value="Upload" id="uploadFile" class="btn"/></td></tr>
</table>
</form>
                    <input type="submit" id="cancel-button" class="btn btn-primary cancel-button" value="Cancel">
                    <input type="submit" class="btn btn-primary" id="add-post-button" value="Submit">
                </div>
                </form>
            </div>         
                        <h4>Posts</h4>
                        <div id="posts-display">${displayPosts(props.posts)}</div>
                    </div>
                    </div>
        </main>
    `;
}


function displayPosts(posts) {
    return posts.reverse().map(post => `<div class="card">
                 <div class="card-body">
                 <div class="card-header text-muted"><p id="date">posted: ${post.date} by ${post.author.username}</p></div>
                 <h4 id="initial-title-${post.id}" class="posttitle">${post.title}</h4><input class="edit" id="edit-title-${post.id}" style="display:none;"  value=${post.title}>
                 <br id="br-${post.id}" style="display:none;">
                 <p id="initial-post-${post.id}">${post.content}</p>
                 <textarea class="form-control" id="edit-content-${post.id}" rows="8" style="display:none;">${post.content}</textarea>
          </div>
             <div class="card-footer text-muted">
             <input type="text" id="edit-category-${post.id}" style="display:none;" class="form-control" value=${post.categories[0].name} name="postCategory">
             ${post.categories.map(category => `<p class="post-categories">#${category.name}</p>`).join('')}
             <input id="initial-button-${post.id}"type="submit" class="btn btn-primary edit-post-button" data-id="${post.id}" ${checkUser(post.author.email)} value="Edit">
             <input type="submit" id="edit-button-${post.id}" class="btn btn-primary submit-post-button edit" style="display:none;" data-id="${post.id}" value="Submit">
                <input type="submit" id="delete-button-${post.id}" class="btn btn-primary delete-post-button" data-id="${post.id}"  ${checkUser(post.author.email)} value="Delete">
                <input type="submit" id="cancel-button-${post.id}" class="btn btn-primary edit cancel-button" style="display:none;" data-id="${post.id}" value="Cancel">
               <br>
               
                <a href="#" class="readcomments" data-id="${post.id}">comments</a>
</div>
                <div class="comments" id="comments-${post.id}" style="display:none;">
                <a href="#" class="comment" data-id="${post.id}" ${checkIfUser()}>leave comment</a>
                <textarea class="form-control commentbox" id="add-comment-${post.id}" rows="2" style="display:none;" placeholder="Enter comments:"></textarea>
                <input type="submit" id="comment-button-${post.id}" class="btn btn-primary submit-comment-button" style="display:none;" data-id="${post.id}" value="Submit">
                <h6 id="commentsheader">Comments:</h6>
                ${post.comments.map(comment => `<p>posted: ${comment.date} by ${comment.author.username}:</p>
                <p>${comment.comment}</p>
                <a href="#" id="delete-comment-${comment.id}" class="delete-comment-button" data-id="${comment.id}"  ${checkUser(comment.author.email)}>delete</a>
                <br>`).join('')}
                </div></div>
         `).join('')
}

export function PostEvents() {
    createAddPostListener();
    editPostListener();
    deletePostListener();
    updatePostListener();
    cancelListener();
    addListener();
    cancelAddListener();
    viewCommentsListener();
    leaveCommentsListener();
    submitCommentsListener();
    deleteCommentsListener();
    searchBoxListener();
    saveFileListener()
}




function searchBoxListener() {
    $("#nosubmit").on('keypress',function(e){
        if(e.which === 13) {
            let searchedCat = $("#nosubmit").val()
                $("#nosubmit").val("")
                const request = {
                    method: 'GET',
                    headers: getHeaders()
                };
            if (searchedCat !== "") {
                fetch(URI + `/searchByCategory?category=${searchedCat}`, request)
                    .then(results => results.json())
                    .then(posts => {
                        $("#posts-display").html(`${displayPosts(posts)}`)
                    })
            } else {
                createView("/posts")
            }
        }
    })
}


function getUserRole() {
    const accessToken = localStorage.getItem("access_token");
    if(!accessToken) {
        return false;
    }
    const parts = accessToken.split('.');
    const payload = parts[1];
    const decodedPayload = atob(payload);
    const payloadObject = JSON.parse(decodedPayload);
    return payloadObject.authorities[0];
}

export function getUser() {
    const accessToken = localStorage.getItem("access_token");
    if(!accessToken) {
        return false;
    }
    const parts = accessToken.split('.');
    const payload = parts[1];
    const decodedPayload = atob(payload);
    const payloadObject = JSON.parse(decodedPayload);
    return payloadObject.user_name;
}


function checkUser(user) {
    if(getUserRole() === "ADMIN" || getUser() === user) {
        return `style='display: inline-block'`;
    } else {
        return `style='display: none'`;
    }
}

function checkIfUser() {
    const loggedIn = isLoggedIn();
    if(loggedIn){
        return `style='display: inline-block'`;
    } else {
        return `style='display: none'`;
    }
}
function viewCommentsListener() {
    $(".readcomments").click(function(e) {
        const id = e.target.getAttribute("data-id")
        $("#comments-" + id).toggle()
    })
}

function leaveCommentsListener() {
    $(".comment").click(function(e) {
        const id = e.target.getAttribute("data-id")
        $("#add-comment-" + id).toggle()
        $("#comment-button-" + id).toggle()

    })
}

function submitCommentsListener() {
    $(".submit-comment-button").click(function(e) {
        const id = e.target.getAttribute("data-id")
        $("#add-comment-" + id).toggle()
        $("#comment-button-" + id).toggle()
        let date = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()
        let comment = $("#add-comment-" + id).val()
        console.log(comment)
        const newComment = {date, comment}
        const request = {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(newComment)
        }
        fetch(URI+ "/comment/" + id, request)
            .then(res => {
                console.log(res.status);
            }).catch(error => {
            console.log(error);
        })
            .finally(() => {
            createView("/posts")
        });
    })
}

function deleteCommentsListener() {
    $(".delete-comment-button").click(function (e) {
        const id = e.target.getAttribute("data-id")
        const request = {
            method: "DELETE",
            headers: getHeaders()
        }
        fetch(URI + "/comment/" + id, request)
            .then(res => {
                console.log(res.status);
            }).catch(error => {
            console.log(error);
        }).finally(() => {
            createView("/posts")
        });

    })
}

function addListener() {
    $("#add-new-button").click(function () {
        if(getUserRole()) {
            $("#new-post").toggle().css({display: "inline-block"});
            $("#add-new-button").toggle().css({display: "none"});
        }
    })
}

function cancelAddListener() {
    $("#cancel-button").click(function () {
        $("#new-post").toggle().css({display: "none"});
        $("#add-new-button").toggle().css({display: "inline-block"});
    })
}

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}


function saveFileListener() {
    $("#uploadFile").click(function () {
    let file = getBase64($("#add-file").prop('files')[0])
    const token = localStorage.getItem("access_token");
    let saveURI = "http://localhost:8081/upload?file=" + file
    let request = {
        method: "POST",
        headers: {
            'Authorization': 'Bearer ' + `${token}`
        }
    }
    fetch(saveURI, request)
        .then(res => {
            console.log(res.status);
        }).catch(error => {
        console.log(error);
    })
    })
    }






function createAddPostListener() {
    $("#add-post-button").click(function () {
        $("#new-post").toggle().css({display: "none"});
        $("#add-new-button").toggle().css({display: "inline-block"});
        const title = $("#add-post-title").val();
        const content = $("#add-post-content").val();
        let categoriesList = $("#add-post-category").val();
        let breakCats = (categoriesList.split(','));
        let categories = [];
        for (let category of breakCats) {
            category = {"name": category}
            categories.push(category)
            }
        let date = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()
        const newPost = {title, content, date, categories}
        let request = {
        method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(newPost)
        }
        console.log(request)
        fetch(URI, request)
        .then(res => {
            console.log(res.status);
        }).catch(error => {
        console.log(error);
        }).finally(() => {
            createView("/posts")
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
    $(".submit-post-button").click(function (e) {
        const id = e.target.getAttribute("data-id")
        const title = $("#edit-title-" + id).val();
        const content = $("#edit-content-" + id).val();
        let categoriesList = $("#edit-category-" +id).val();
        let breakCats = (categoriesList.split(','));
        let categories = [];
        for (let category of breakCats) {
            category = {"name": category}
            categories.push(category)
        }
        const editedPost = {title, content, categories}
        const request = {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(editedPost)
        }
        fetch(URI+ "/" + id, request)
            .then(res => {
                console.log(res.status);
            }).catch(error => {
            console.log(error);
        }).finally(() => {
            createView("/posts")
        });
    })
}


function deletePostListener() {
    $(".delete-post-button").click(function (e) {
        const id = e.target.getAttribute("data-id")
        const request = {
            method: "DELETE",
            headers: getHeaders()
        }
        fetch(URI + "/" + id, request)
            .then(res => {
                console.log(res.status);
            }).catch(error => {
            console.log(error);
        }).finally(() => {
            createView("/posts")
        });
    })
}