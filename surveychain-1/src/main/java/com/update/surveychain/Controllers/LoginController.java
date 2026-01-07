package com.update.surveychain.Controllers;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.update.surveychain.Entites.Participants;
import com.update.surveychain.Entites.Moderator;
import com.update.surveychain.Repos.ParticipantsRepository;
import com.update.surveychain.Repos.ModeratorRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class LoginController {

    @Autowired
    private ParticipantsRepository participantsRepository;

    @Autowired
    private ModeratorRepository moderatorRepository;

    @GetMapping("/login/{email}/{password}")
    public ResponseEntity<Map<String, String>> login(
            @PathVariable String email,
            @PathVariable String password) {

        Map<String, String> resp = new HashMap<>();

        // === ADMIN LOGIN ===
        if ("admin@gmail.com".equals(email) && "admin123".equals(password)) {
            resp.put("loginStatus", "success");
            resp.put("role", "ADMIN");
            resp.put("email", email);
            return ResponseEntity.ok(resp);
        }

        // === MODERATOR LOGIN ===
        Optional<Moderator> modOpt = moderatorRepository.findByEmail(email);
        if (modOpt.isPresent()) {
            if (modOpt.get().getPassword().equals(password)) {
                resp.put("loginStatus", "success");
                resp.put("role", "MODERATOR");
                resp.put("email", email);
                return ResponseEntity.ok(resp);
            } else {
                resp.put("message", "Password mismatch");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resp);
            }
        }

        // === PARTICIPANT LOGIN ===
        Optional<Participants> partOpt = participantsRepository.findByEmail(email);
        if (partOpt.isPresent()) {
            if (partOpt.get().getPassword().equals(password)) {
                resp.put("loginStatus", "success");
                resp.put("role", "PARTICIPANT");
                resp.put("email", email);
                return ResponseEntity.ok(resp);
            } else {
                resp.put("message", "Password mismatch");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resp);
            }
        }

        // === USER NOT FOUND ===
        resp.put("message", "User not found");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resp);
    }
}
