package org.example.rest.web;


import lombok.AllArgsConstructor;
import org.example.rest.data.PostsRepository;
import org.example.rest.data.User;
import org.example.rest.data.UsersRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.Collection;
import java.util.Optional;

@AllArgsConstructor
@CrossOrigin
@RestController
@RequestMapping(value = "/api/users", headers = "Accept=application/json")
public class UserController {


    private UsersRepository userRepository;
    private PostsRepository postRepository;
    private PasswordEncoder passwordEncoder;



    @GetMapping
    public Collection<User> getUsers() {
        System.out.println(userRepository);
        return userRepository.findAll();
    }

    @GetMapping("{id}")
    public Optional<User> getById(@PathVariable long id){
        return userRepository.findById(id);
    }

    @GetMapping("/email")
    public User getByEmail(@RequestParam String email){
        return userRepository.findByEmail(email);
    }
    @GetMapping("/username")
    public User getByUsername(@RequestParam String username) {
        return userRepository.findByUsername(username);
    }

    @GetMapping("/me")
    public User getCurrentUser(OAuth2Authentication auth) {
        String email = auth.getName();
        return userRepository.findByEmail(email);
    }

    @PostMapping("/create")
    public void createUser(@RequestBody User user) {
        user.setCreatedAt(LocalDate.now());
        user.setRole(User.Role.USER);
        String unencryptedPassword = user.getPassword();
        System.out.println(unencryptedPassword);
        String encryptedPassword = passwordEncoder.encode(unencryptedPassword);
        System.out.println(encryptedPassword);
        user.setPassword(encryptedPassword);
        userRepository.save(user);
    }


    @DeleteMapping("{id}")
    public void deleteUser(@PathVariable Long id){
        userRepository.deleteById(id);
    }

    @PutMapping("/me/updatePassword")
    @PreAuthorize("hasAuthority('USER') || hasAuthority('ADMIN')")
    public void updatePassword(@RequestParam String newPassword, OAuth2Authentication auth){
        String user = auth.getName();
        User updatedUser = userRepository.findByEmail(user);
        String encryptedPassword = passwordEncoder.encode(newPassword);
        updatedUser.setPassword(encryptedPassword);
        userRepository.save(updatedUser);
        System.out.println("Updating password");
    }
}


