package com.update.surveychain.Repos;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.update.surveychain.Entites.Moderator;

import jakarta.transaction.Transactional;

public interface ModeratorRepository extends JpaRepository<Moderator, Long> {

	 

	Optional<Moderator> findById(Long id);



	@Modifying
	@Transactional
	@Query("DELETE FROM Moderator m WHERE m.id = :id")
	void deleteModeratorById(@Param("id") Long id);



	Optional<Moderator> findByEmail(String email);


}
