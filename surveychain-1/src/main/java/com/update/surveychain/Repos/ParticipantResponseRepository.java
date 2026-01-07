package com.update.surveychain.Repos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.update.surveychain.Entites.ParticipantResponse;

public interface ParticipantResponseRepository
        extends JpaRepository<ParticipantResponse, Long> {

   
    List<ParticipantResponse> findByParticipantEmail(String participantEmail);

   
    boolean existsBySurveyIdAndParticipantEmail(
            Long surveyId,
            String participantEmail
    );
    List<ParticipantResponse> findBySurveyId(Long surveyId);

}
