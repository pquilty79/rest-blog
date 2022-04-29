package org.example.rest.web;


import lombok.AllArgsConstructor;
import org.example.rest.data.*;
import org.example.rest.services.EmailService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.*;

import static org.example.rest.data.User.Role.ADMIN;


@CrossOrigin
@RestController
@RequestMapping(value = "/api/posts", headers = "Accept=application/json")
@AllArgsConstructor
public class PostsController {

    private final PostsRepository postRepository;
    private final CategoryRepository categoryRepository;
    private final EmailService emailService;
    private final UsersRepository userRepository;
    private final CommentsRepository commentsRepository;

    @GetMapping
    public Collection<Post> getPosts() {
        return postRepository.findAll();
    }

    @GetMapping("{id}")
    public Optional<Post> getById(@PathVariable long id){
        return postRepository.findById(id);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('USER') || hasAuthority('ADMIN')")
    public void createPost(@RequestBody Post post, OAuth2Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email);
        post.setAuthor(user);
        Collection<Category> categories = new ArrayList<>();
        for(Category category: post.getCategories()) {
            if(categoryRepository.findCategoryByName(category.getName()) !=null){
                categories.add(categoryRepository.findCategoryByName(category.getName()));
            } else {
                Category newerCat = new Category();
                newerCat.setName(category.getName());
                categoryRepository.save(newerCat);
                categories.add(categoryRepository.findCategoryByName(newerCat.getName()));
            }
        }
        post.setCategories(categories);
        postRepository.save(post);
        emailService.prepareAndSend(post, "You made a new post", "Here is your recent post:");
        System.out.println("post was created");
    }


    @PutMapping("{id}")
    public void updatePost(@PathVariable long id, @RequestBody Post post, OAuth2Authentication auth) {
        String email = auth.getName();
        Post postToUpdate = postRepository.getById(id);
        User user = userRepository.findByEmail(email);
        if (user.getRole().equals(ADMIN) || (postToUpdate.getAuthor().getEmail().equals(email))) {
            if(post.getTitle() != null || !post.getTitle().isEmpty()) {
                postToUpdate.setTitle(post.getTitle());
            }
            if(post.getContent() !=null || !post.getContent().isEmpty()){
                postToUpdate.setContent(post.getContent());
            }
            if(post.getCategories() !=null || !post.getCategories().isEmpty()) {
                postToUpdate.setCategories(post.getCategories());
            }
            postRepository.save(postToUpdate);
        }
    }
    @PutMapping("/comment/{id}")
    public void addComment(@PathVariable long id, @RequestBody Comments comment, OAuth2Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email);
        Post post = postRepository.getById(id);
        comment.setAuthor(user);
        comment.setPost(post);
        commentsRepository.save(comment);
    }

    @DeleteMapping("/comment/{id}")
    public void deleteComment(@PathVariable long id) {
        commentsRepository.deleteById(id);
    }



    @DeleteMapping("{id}")
    @PreAuthorize("hasAuthority('USER') || hasAuthority('ADMIN')")
    public void deletePost(@PathVariable Long id, OAuth2Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email);
        Post postToUpdate = postRepository.getById(id);
        if(user.getRole().equals(ADMIN) || postToUpdate.getAuthor().getEmail().equals(email)) {
            postRepository.deleteById(id);
        }
    }

    @GetMapping("searchByCategory")
    public List<Post> searchPostsByCategory(@RequestParam String category){
        return postRepository.findAllByCategories(categoryRepository.findCategoryByName(category));
    }




}
