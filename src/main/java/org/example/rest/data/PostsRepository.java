package org.example.rest.data;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostsRepository extends JpaRepository<Post, Long> {

    List<Post> findAllByCategories(Category category);
    Post findByTitle(String title);
    Post findFirstByTitle(String title);

}
