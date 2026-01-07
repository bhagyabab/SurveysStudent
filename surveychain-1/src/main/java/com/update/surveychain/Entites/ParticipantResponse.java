package com.update.surveychain.Entites;

import jakarta.persistence.*;

@Entity
@Table(name = "participant_responses")
public class ParticipantResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String participantEmail; 

    private Long surveyId;           

    private String response;         

    private String description;      

    // Getters and Setters
    public Long getId() { return id; }
    public String getParticipantEmail() { return participantEmail; }
    public void setParticipantEmail(String participantEmail) { this.participantEmail = participantEmail; }
    public Long getSurveyId() { return surveyId; }
    public void setSurveyId(Long surveyId) { this.surveyId = surveyId; }
    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
