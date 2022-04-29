package org.example.rest.web;



import org.example.rest.data.Category;
import org.example.rest.data.CategoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;



@CrossOrigin
@RestController
@RequestMapping(value = "/api/categories", headers = "Accept=application/json")
public class CategoryController {

    private CategoryRepository categoryRepository;
    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public Category getPostsByCategory(@RequestParam String categoryName){
        return categoryRepository.findCategoryByName(categoryName);
    }

}
