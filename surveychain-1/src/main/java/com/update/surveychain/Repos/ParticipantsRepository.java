package com.update.surveychain.Repos;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.update.surveychain.Entites.Participants;

public interface ParticipantsRepository extends JpaRepository<Participants, Long> {

	Optional<Participants> findByEmail(String email);

	

}
