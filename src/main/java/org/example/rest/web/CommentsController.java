package org.example.rest.web;



import lombok.AllArgsConstructor;
import org.example.rest.data.CommentsRepository;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping(value = "/api/comments", headers = "Accept=application/json")
@AllArgsConstructor
public class CommentsController {
    private final CommentsRepository commentsRepository;



}
