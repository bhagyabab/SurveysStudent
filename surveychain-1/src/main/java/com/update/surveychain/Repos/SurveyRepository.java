package com.update.surveychain.Repos;



import org.springframework.data.jpa.repository.JpaRepository;

import com.update.surveychain.Entites.Surveys;

public interface SurveyRepository extends JpaRepository<Surveys, Long> {
	
}
