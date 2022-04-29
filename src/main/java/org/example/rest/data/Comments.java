package org.example.rest.data;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import javax.persistence.*;

@ToString
@Setter
@Getter
@AllArgsConstructor
@Entity
@Table(name="comments")
@NoArgsConstructor
public class Comments {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(nullable = false, length = 50)
    private String date;
    @ManyToOne
    @JsonIgnoreProperties({"posts", "comments"})
    private User author;
    @ManyToOne
    @JsonIgnoreProperties({"author"})
    private Post post;
    @Column(nullable = false, length = 5000)
    private String comment;
}
