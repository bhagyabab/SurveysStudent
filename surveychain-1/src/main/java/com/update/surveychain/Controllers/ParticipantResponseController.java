package com.update.surveychain.Controllers;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.update.surveychain.Entites.ParticipantResponse;
import com.update.surveychain.Entites.Participants;
import com.update.surveychain.Entites.Surveys;
import com.update.surveychain.Repos.ParticipantResponseRepository;
import com.update.surveychain.Repos.ParticipantsRepository;
import com.update.surveychain.Repos.SurveyRepository;



@RestController
@RequestMapping("/api/responses")
@CrossOrigin("*")
public class ParticipantResponseController {

    @Autowired
    private ParticipantResponseRepository responseRepository;

    @Autowired
    private SurveyRepository surveyRepository;

    @Autowired
    private ParticipantsRepository participantsRepository;

    // Utility to hash strings with SHA-256
    private String hashSHA256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedHash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            // Convert to hex
            StringBuilder hexString = new StringBuilder(2 * encodedHash.length);
            for (byte b : encodedHash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing response", e);
        }
    }

    @PostMapping("/submit")
    public ResponseEntity<String> submitResponse(@RequestBody ParticipantResponse response) {
        try {
            boolean alreadySubmitted = responseRepository.existsBySurveyIdAndParticipantEmail(
                    response.getSurveyId(), response.getParticipantEmail());

            if (alreadySubmitted) {
                return ResponseEntity.badRequest().body("You have already submitted this survey");
            }

            // 1️⃣ Hash the participant's response before saving
            String hashedResponse = hashSHA256(response.getResponse());
            response.setResponse(hashedResponse);

            responseRepository.save(response);

            // 2️⃣ Update survey totalResponses
            Surveys survey = surveyRepository.findById(response.getSurveyId()).orElse(null);
            if (survey == null) {
                return ResponseEntity.badRequest().body("Survey not found");
            }
            survey.setTotalResponses(survey.getTotalResponses() + 1);
            surveyRepository.save(survey);

            // 3️⃣ Update participant reward
            Participants participant = participantsRepository.findByEmail(response.getParticipantEmail()).orElse(null);
            if (participant == null) {
                return ResponseEntity.badRequest().body("Participant not found");
            }
            Integer currentReward = participant.getReward() == null ? 0 : participant.getReward();
            participant.setReward(currentReward + survey.getRewards());
            participantsRepository.save(participant);

            return ResponseEntity.ok("Response submitted successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error submitting response");
        }
    }

    @GetMapping("/participant/{email}/submitted-rewards")
    public ResponseEntity<?> getSubmittedRewards(@PathVariable String email) {
        try {
            List<ParticipantResponse> responses = responseRepository.findByParticipantEmail(email);
            if (responses.isEmpty()) return ResponseEntity.ok(Collections.emptyList());

            List<Map<String, Object>> rewards = new ArrayList<>();
            for (ParticipantResponse r : responses) {
                Surveys survey = surveyRepository.findById(r.getSurveyId()).orElse(null);
                if (survey != null) {
                    Map<String, Object> reward = new HashMap<>();
                    reward.put("surveyId", survey.getId());
                    reward.put("title", survey.getTitle());
                    reward.put("description", survey.getDescription());
                    reward.put("points", survey.getRewards());
                    reward.put("hashedResponse", r.getResponse()); // Store hashed response
                    rewards.add(reward);
                }
            }
            return ResponseEntity.ok(rewards);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to fetch submitted rewards");
        }
    }

    @GetMapping("/survey/{surveyId}")
    public ResponseEntity<?> getResponsesBySurvey(@PathVariable Long surveyId) {
        try {
            List<ParticipantResponse> responses = responseRepository.findBySurveyId(surveyId);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to fetch responses");
        }
    }
}
