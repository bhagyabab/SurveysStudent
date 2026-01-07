package com.update.surveychain.Controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.update.surveychain.Entites.Moderator;

import com.update.surveychain.Repos.ModeratorRepository;

@RestController
@RequestMapping("/api/moderators")
@CrossOrigin("*")
public class ModeratorController {

	@Autowired
	private ModeratorRepository moderatorRepository;

	// GET all moderators
	 @GetMapping("/all")
	    public ResponseEntity<List<Moderator>> getAllModerator() {
		 
	        return ResponseEntity.ok(moderatorRepository.findAll());
	    }

	// GET moderator by ID
	@GetMapping("/{id}")
	public ResponseEntity<Moderator> getModeratorById(@PathVariable Long id) {
		return moderatorRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	// POST add moderator (PLAIN PASSWORD)
	@PostMapping("/add")
	public ResponseEntity<Moderator> addModerator(@RequestBody Moderator moderator) {
		return ResponseEntity.ok(moderatorRepository.save(moderator));
	}

	// POST login (PLAIN PASSWORD)
	@PostMapping("/login/{email}/{password}")
	public ResponseEntity<Map<String, String>> login(@PathVariable String email, @PathVariable String password) {

		Optional<Moderator> modOpt = moderatorRepository.findByEmail(email);

		if (modOpt.isPresent() && modOpt.get().getPassword().equals(password)) {

			Map<String, String> resp = new HashMap<>();
			resp.put("loginStatus", "success");
			resp.put("role", "MODERATOR");
			resp.put("email", email);

			return ResponseEntity.ok(resp);
		}

		Map<String, String> resp = new HashMap<>();
		resp.put("loginStatus", "failed");
		resp.put("message", "Invalid credentials");

		return ResponseEntity.status(401).body(resp);
	}

	// DELETE moderator by ID
	@DeleteMapping("/{id}")
	public ResponseEntity<Map<String, String>> deleteModerator(@PathVariable Long id) {
	    Map<String, String> resp = new HashMap<>();
	    if (moderatorRepository.existsById(id)) {
	        moderatorRepository.deleteById(id);
	        resp.put("status", "success");
	        resp.put("message", "Moderator removed");
	        return ResponseEntity.ok(resp);
	    } else {
	        resp.put("status", "failed");
	        resp.put("message", "Moderator not found");
	        return ResponseEntity.status(404).body(resp);
	    }
	}


}
