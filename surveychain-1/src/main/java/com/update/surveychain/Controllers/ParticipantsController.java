package com.update.surveychain.Controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.update.surveychain.Entites.Participants;
import com.update.surveychain.Repos.ParticipantsRepository;

@RestController
@RequestMapping("/api/participants")
@CrossOrigin("*")
public class ParticipantsController {

    @Autowired
    private ParticipantsRepository participantsRepository;
    
    // GET ALL PARTICIPANTS
    @GetMapping("/all")
    public ResponseEntity<List<Participants>> getAllParticipants() {
        List<Participants> participants = participantsRepository.findAll();
        System.out.println("Fetched " + participants.size() + " participants");
        return ResponseEntity.ok(participants);
    }

    // GET PARTICIPANT BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Participants> getParticipantById(@PathVariable Long id) {
        System.out.println("Fetching participant with ID: " + id);
        Optional<Participants> participantOpt = participantsRepository.findById(id);
        
        if (participantOpt.isPresent()) {
            System.out.println("Participant found: " + participantOpt.get().getName());
            return ResponseEntity.ok(participantOpt.get());
        } else {
            System.err.println("Participant not found with ID: " + id);
            return ResponseEntity.notFound().build();
        }
    }

    // GET PARTICIPANT BY EMAIL
    @GetMapping("/email/{email}")
    public ResponseEntity<Participants> getParticipantByEmail(@PathVariable String email) {
        System.out.println("Fetching participant with email: " + email);
        Optional<Participants> participantOpt = participantsRepository.findByEmail(email);
        
        if (participantOpt.isPresent()) {
            System.out.println("Participant found: " + participantOpt.get().getName());
            return ResponseEntity.ok(participantOpt.get());
        } else {
            System.err.println("Participant not found with email: " + email);
            return ResponseEntity.notFound().build();
        }
    }

    // ADD NEW PARTICIPANT (REGISTRATION)
    @PostMapping("/add")
    public ResponseEntity<Participants> addParticipant(@RequestBody Participants participant) {
        try {
            // Set default values if not provided
            if (participant.getReward() == null) {
                participant.setReward(0);
            }
            if (participant.getStatus() == null || participant.getStatus().trim().isEmpty()) {
                participant.setStatus("Active");
            }
            
            Participants savedParticipant = participantsRepository.save(participant);
            System.out.println("Participant registered: " + savedParticipant.getEmail() + 
                             " | Status: " + savedParticipant.getStatus() + 
                             " | Reward: " + savedParticipant.getReward());
            
            return ResponseEntity.ok(savedParticipant);
            
        } catch (Exception e) {
            System.err.println("Error adding participant: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}
