package com.update.surveychain.Entites;

import jakarta.persistence.*;

@Entity
@Table(name = "surveys")
public class Surveys {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", nullable = false, length = 1000)
    private String description;

    @Column(name = "rewards", nullable = false)
    private Integer rewards;

    @Column(name = "total_responses")
    private Integer totalResponses = 0;

    @Column(name = "status")
    private String status = "Active";

    // Default constructor
    public Surveys() {
    }

    // Full constructor
    public Surveys(Long id, String title, String description, Integer rewards, Integer totalResponses, String status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.rewards = rewards;
        this.totalResponses = totalResponses;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getRewards() {
        return rewards;
    }

    public void setRewards(Integer rewards) {
        this.rewards = rewards;
    }

    public Integer getTotalResponses() {
        return totalResponses;
    }

    public void setTotalResponses(Integer totalResponses) {
        this.totalResponses = totalResponses;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "Surveys{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", rewards=" + rewards +
                ", totalResponses=" + totalResponses +
                ", status='" + status + '\'' +
                '}';
    }
}

