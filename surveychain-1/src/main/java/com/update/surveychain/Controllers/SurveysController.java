package com.update.surveychain.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.update.surveychain.Entites.Surveys;
import com.update.surveychain.Repos.SurveyRepository;

@RestController
@RequestMapping("/api/surveys")
@CrossOrigin(origins = "*")
public class SurveysController {

    @Autowired
    private SurveyRepository surveysRepository;

    // GET ALL SURVEYS
    @GetMapping("/getAllSurveys")
    public ResponseEntity<List<Surveys>> getAllSurveys() {
        try {
            List<Surveys> surveys = surveysRepository.findAll();
            return ResponseEntity.ok(surveys);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // CREATE NEW SURVEY
    @PostMapping("/add")
    public ResponseEntity<Surveys> createSurvey(@RequestBody Surveys survey) {
        try {
            if (survey.getTitle() == null || survey.getTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            if (survey.getDescription() == null || survey.getDescription().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            if (survey.getRewards() == null || survey.getRewards() < 0) {
                return ResponseEntity.badRequest().build();
            }

            // Default values
            survey.setTotalResponses(0);
            if (survey.getStatus() == null || survey.getStatus().trim().isEmpty()) {
                survey.setStatus("Active");
            }

            Surveys savedSurvey = surveysRepository.save(survey);
            return new ResponseEntity<>(savedSurvey, HttpStatus.CREATED);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // DELETE SURVEY
    @DeleteMapping("/deleteBy/{id}")
    public ResponseEntity<Void> deleteSurvey(@PathVariable Long id) {
        try {
            if (!surveysRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }

            surveysRepository.deleteById(id);
            return ResponseEntity.ok().build();

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
 // GET SURVEY BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Surveys> getSurveyById(@PathVariable Long id) {
        return surveysRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    
}
